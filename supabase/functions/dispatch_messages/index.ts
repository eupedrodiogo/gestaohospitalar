import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// We need the Service Role Key to update the dispatches table bypassing RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: {
    id: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    audience: string;
    channels: {
      whatsapp: boolean;
      email: boolean;
    };
    subject?: string;
    content: string;
    status: string;
    createdAt: number;
  };
  schema: "public";
  old_record: null;
}

// Helper to send WhatsApp via Twilio
async function sendWhatsApp(to: string, content: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioNumber = Deno.env.get("TWILIO_PHONE_NUMBER"); // e.g. whatsapp:+14155238886

  if (!accountSid || !authToken || !twilioNumber) {
    console.error("Twilio credentials missing");
    return false;
  }

  const formData = new URLSearchParams();
  formData.append("To", `whatsapp:${to}`);
  formData.append("From", twilioNumber);
  formData.append("Body", content);

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      const err = await response.text();
      console.error("Twilio error:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Twilio Fetch error:", err);
    return false;
  }
}

// Helper to send Email via Resend
async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const senderEmail = Deno.env.get("RESEND_SENDER_EMAIL") || "nao-responda@hospital.com";

  if (!resendApiKey) {
    console.error("Resend API key missing");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Marketing Hospitalar <${senderEmail}>`,
        to: [to],
        subject: subject,
        html: html,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend Fetch error:", err);
    return false;
  }
}

serve(async (req) => {
  try {
    // 1. Verify Request
    if (req.method !== 'POST') {
      return new Response("Method not allowed", { status: 405 });
    }

    const payload: WebhookPayload = await req.json();

    if (payload.table !== "dispatches" || payload.type !== "INSERT") {
      return new Response("Ignored", { status: 200 });
    }

    const record = payload.record;

    // Se já estiver processado ou falho, ignora
    if (record.status !== "pending") {
      return new Response("Already processed", { status: 200 });
    }

    // Marca como processando
    await supabase.from("dispatches").update({ status: "processing" }).eq("id", record.id);

    // 2. Obter público alvo
    // Em uma aplicação real, você faria um SELECT na tabela `user_profiles` ou `patients`
    // filtrando pelo `record.audience`. Para fins de demonstração, vamos simular contatos mockados.
    const mockContacts = [
      { name: "João", phone: "+5511999999999", email: "joao@example.com" },
      { name: "Maria", phone: "+5511888888888", email: "maria@example.com" },
    ];

    let successCount = 0;
    let failCount = 0;

    // 3. Loop e envio
    for (const contact of mockContacts) {
      const formattedContent = `Olá ${contact.name},\n\n${record.content}`;

      let sentWh = false;
      let sentEm = false;

      if (record.channels.whatsapp) {
        sentWh = await sendWhatsApp(contact.phone, formattedContent);
      }
      
      if (record.channels.email) {
        // Converter \n para <br> no email
        const htmlContent = formattedContent.replace(/\n/g, '<br>');
        sentEm = await sendEmail(contact.email, record.subject || "Aviso Importante", htmlContent);
      }

      if ((record.channels.whatsapp && sentWh) || (record.channels.email && sentEm)) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // 4. Conclui o processo
    const finalStatus = failCount === 0 ? "completed" : "failed";
    await supabase.from("dispatches").update({ status: finalStatus }).eq("id", record.id);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount, 
      failed: failCount 
    }), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { "Content-Type": "application/json" },
      status: 500 
    });
  }
});

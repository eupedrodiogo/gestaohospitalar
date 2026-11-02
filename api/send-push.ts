import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configura o web-push com as chaves VAPID do ambiente
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@saofrancisco.com.br',
  process.env.VITE_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

// Cria o client Supabase usando a chave de ambiente local/Vercel
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    // Verifica a validade do usuário através do JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { title, body, url, icon, targetUserId } = req.body;

    // Busca inscrições
    let query = supabase.from('push_subscriptions').select('user_id, subscription');
    
    if (targetUserId) {
      // Push direto para um usuário específico (ex: Chat 1-a-1)
      query = query.eq('user_id', targetUserId);
    } else {
      // Push global: Todos exceto quem disparou (ex: Comunidade e Avisos)
      query = query.neq('user_id', user.id);
    }

    const { data: subscriptions, error: dbError } = await query;

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ message: 'No subscriptions found', count: 0 });
    }

    const payload = JSON.stringify({
      title: title || 'Novo Alerta do HSF',
      body: body || 'Verifique o painel para mais detalhes.',
      url: url || '/',
      icon: icon || '/icon.png'
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err: any) {
        // Se o endpoint retornou 410 (Gone) ou 404 (Not Found), a inscrição expirou/foi revogada
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('subscription', sub.subscription);
        } else {
          console.error('Erro ao enviar push para user_id:', sub.user_id, err);
        }
      }
    });

    await Promise.all(sendPromises);

    return res.status(200).json({ success: true, count: subscriptions.length });
  } catch (error: any) {
    console.error('Push error:', error);
    return res.status(500).json({ error: error.message });
  }
}

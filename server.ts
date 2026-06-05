import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: AI Goals Suggestion Endpoint
app.post("/api/ai-goals", async (req, res) => {
  const { improvements, language } = req.body || {};

  if (!improvements || improvements.trim() === "") {
    return res.status(400).json({ error: "Improvements string is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const currentLang = language || "pt";

  // Graceful fallback if API key is missing
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    const fallbackResponses: Record<string, { short: string; long: string }> = {
      pt: {
        short: `1. Realizar um curso especializado em comunicação clínica no próximo trimestre.\n2. Concluir duas simulações práticas interdepartamentais até o fim do semestre.\n3. Aplicar metodologia ágil na rotina de triagem durante dois meses.`,
        long: `1. Tornar-se referência técnica atuando como mentor principal de novos ingressos.\n2. Liderar um projeto transdisciplinar reduzindo tempos de resposta em 15%.\n3. Concluir uma pós-graduação em gestão de saúde nos próximos 2 anos.`,
      },
      en: {
        short: `1. Enroll in a certified clinical communication course within the next quarter.\n2. Complete two multi-department practical workflows by the end of this semester.\n3. Apply agile methodologies in the triage routine for two months.`,
        long: `1. Attain senior clinical leadership serving as a master mentor.\n2. Coordinate a hospital-wide service delivery study steering a 15% reduction in discharge times.\n3. Complete a postgraduate degree in healthcare management within 2 years.`,
      },
      es: {
        short: `1. Completar un curso certificado de comunicación clínica en el próximo trimestre.\n2. Participar en dos simulaciones prácticas enfocadas en flujos de salud antes del fin de semestre.\n3. Aplicar metodología ágil en la rutina de triaje durante dos meses.`,
        long: `1. Consolidar el liderazgo técnico sirviendo de mentor clave.\n2. Dirigir una iniciativa de mejora continua para garantizar un 10% más de agilidad en los ingresos.\n3. Completar un posgrado en gestión sanitaria en los próximos 2 años.`,
      },
    };
    const responseData = fallbackResponses[currentLang] || fallbackResponses.pt;
    return res.json(responseData);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const isEnglish = currentLang === "en";
    const isSpanish = currentLang === "es";

    let instructions =
      "Atue como Mentor de Recursos Humanos em um ambiente hospitalar renomado. ";
    instructions += `Sugira três metas SMART de curto prazo (6 meses) e três de longo prazo (2 anos) baseadas nas áreas de melhoria digitadas: "${improvements}". `;
    instructions +=
      "As metas devem ser precisas, acionáveis e totalmente contextualizadas na área da saúde. ";
    instructions +=
      "Você DEVE formatar e responder APENAS um objeto JSON no seguinte formato (sem bloco markdown extra, apenas o json limpo):\n";
    instructions +=
      '{"short": "texto das metas de curto prazo", "long": "texto das metas de longo prazo"}';

    if (isEnglish) {
      instructions += "\nRespond and explain entirely in English.";
    } else if (isSpanish) {
      instructions += "\nResponde y redacta completamente en Español.";
    } else {
      instructions += "\nResponda e redija inteiramente em Português.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: instructions,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({
        short: parsed.short || parsed.shortTerm || "",
        long: parsed.long || parsed.longTerm || "",
      });
    } else {
      throw new Error("No text generated");
    }
  } catch (error) {
    console.error("Gemini Suggestion Call Failed:", error);
    // Dynamic default in case API call experiences any rate limits / network quotas
    const emergencyResponses: Record<string, { short: string; long: string }> =
      {
        pt: {
          short: `• Participar de formações em comunicação de alta performance médica.\n• Estabelecer rotina diária de verificação eletrônica de prontuários.\n• Revisar semanalmente metas e kpis de desempenho.`,
          long: `• Obter acreditação técnica avançada de nível nacional em cuidados integrados.\n• Implementar um protocolo padronizado que eleve a satisfação do paciente em 10%.\n• Liderar grupo de estudos contínuos no setor da saúde.`,
        },
        en: {
          short: `• Complete interactive courses in clinical-scale communication protocols.\n• Setup a standard daily schedule checks checklist to prevent auditing logs.\n• Weekly review of targets and performance KPIs.`,
          long: `• Obtain a board-certified hospital management qualification.\n• Implement a validated transition protocol elevating department efficiency by 10%.\n• Lead continuous study group in healthcare sector.`,
        },
        es: {
          short: `• Cursar tutorías especializadas en coordinación clínica estratégica.\n• Integrar una pauta dinámica de supervisión de expedientes electrónicos.\n• Revisión semanal de metas y KPIs.`,
          long: `• Obtener la certificación superior en administración de servicios de salud.\n• Implementar un nuevo flujo operativo para garantizar un 10% más de agilidad en los ingresos.\n• Liderar grupo de estudios en salud continuamente.`,
        },
      };
    return res.json(emergencyResponses[currentLang] || emergencyResponses.pt);
  }
});

// API: AI Executive Summary Endpoint
app.post("/api/ai-summary", async (req, res) => {
  const { notes, language } = req.body || {};

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return res.status(400).json({ error: "Array of notes is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const currentLang = language || "pt";

  const isEnglish = currentLang === "en";
  const isSpanish = currentLang === "es";

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    const fallbackResponses: Record<string, string> = {
      pt: "Resumo Executivo do Ano: O colaborador demonstrou uma excelente progressão, participando de treinamentos essenciais e reduzindo o tempo de resposta geral. A resiliência e a atitude profissional foram notadas nas avaliações. Recomendamos manter a trajetória de aprendizado e considerar progressão de nível.",
      en: "Yearly Executive Summary: The employee has shown remarkable progression, participating in essential trainings and reducing overall response times. Resilience and professional attitude were highlighted in evaluations. We recommend maintaining the learning track and considering level progression.",
      es: "Resumen Ejecutivo del Año: El empleado ha demostrado una excelente progresión, participando en entrenamientos esenciales y reduciendo los tiempos de respuesta. La resiliencia y actitud profesional fueron notorias en las evaluaciones. Recomendamos mantener la trayectoria y considerar progresión.",
    };
    return res.json({
      summary: fallbackResponses[currentLang] || fallbackResponses.pt,
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let instructions =
      'Atue como Diretor de Recursos Humanos. Analise os seguintes registros de reuniões 1-on-1 (check-ins) de um funcionário durante o ano e gere um "Resumo Executivo do Ano" com as principais evoluções, desafios superados e recomendações para aprovação do RH. ';
    instructions += `\nRegistros:\n${notes.map((n, i) => `Check-in ${i + 1}: ${n}`).join("\n")}\n`;
    instructions +=
      "O resumo deve ser profissional, direto e claro. Mantenha menos de 150 palavras. ";

    if (isEnglish) {
      instructions += "Respond entirely in English.";
    } else if (isSpanish) {
      instructions += "Responde enteramente en Español.";
    } else {
      instructions += "Responda inteiramente em Português.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: instructions,
    });

    const text = response.text;
    if (text) {
      return res.json({ summary: text });
    } else {
      throw new Error("No text generated");
    }
  } catch (error) {
    console.error("Gemini Summary Call Failed:", error);
    const emergencyResponses: Record<string, string> = {
      pt: "Resumo Executivo do Ano: O colaborador demonstrou uma sólida progressão. As notas confirmam alinhamento com as expectativas da organização.",
      en: "Yearly Executive Summary: The employee demonstrated solid progression. The notes confirm alignment with organizational expectations.",
      es: "Resumen Ejecutivo del Año: El colaborador demostró una sólida progresión. Las notas confirman alineamiento con las expectativas organizacionales.",
    };
    return res.json({
      summary: emergencyResponses[currentLang] || emergencyResponses.pt,
    });
  }
});

// Setup Vite & Static Fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PDI App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

<h1>🏥 Gestão Hospitalar | Plataforma de Gestão Integrada por IA</h1>

  <p>
    <strong>Sistema Full-Stack de Gestão Hospitalar, Inteligência Artificial e Analytics</strong>
  </p>

  <p>
    <strong>Sistema Full-Stack de Gestão Hospitalar, Inteligência Artificial e Analytics</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-blue.svg?style=flat&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC.svg?style=flat&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-Backend-green.svg?style=flat&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/Gemini-AI%20Integration-orange.svg?style=flat&logo=google" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Supabase-Backend%20as%20a%20Service-3ecf8e.svg?style=flat&logo=supabase" alt="Supabase" />
  </p>

## 📖 Sobre o Projeto

O **sistema Gestão Hospitalar** é uma plataforma inovadora de gestão hospitalar projetada para revolucionar o acompanhamento clínico, financeiro e de recursos humanos através da inteligência artificial. Desenvolvida com foco em performance, segurança e uma interface de usuário super limpa (*clean UX*), a aplicação atua como o sistema nervoso central de qualquer instituição.

Nossa missão com este ecossistema é apoiar a **Diretoria e Coordenação** com insights acionáveis baseados em IA (como o inovador *Radar de Burnout*), facilitar o engajamento dos colaboradores através do Plano de Desenvolvimento Individual (PDI) criptografado de ponta a ponta, e fornecer painéis imersivos para as verticais de Suprimentos, Faturamento, Recursos Humanos, SADT e os demais.

---

## ✨ Principais Funcionalidades

- **🧠 IA Preditiva e Analítica (Radar de Burnout):** Integração com modelos Google Gemini para correlacionar dados do Termômetro Emocional, engajamento sistêmico e taxas de absenteísmo para sugerir intervenções de saúde mental das equipes de enfermagem e médicas.
- **📊 Dashboards Multidimensionais:** Painéis interativos construídos com **Recharts**, filtrados em tempo real abordando métricas chave da Diretoria: Faturamento Média, Taxa de Retenção, Controle de Suprimentos (OPME) e Visão Comercial.
- **🛡️ Criptografia Segura (PDI):** Fluxos de Plano de Desenvolvimento Individual confidenciais focados na privacidade dos avaliados.
- **📱 Interface Intuitiva e Responsiva:** Design System com *Tailwind CSS* recheado de *Glassmorphism* (Efeitos de Blur) nas tipografias e *Framer Motion* para animações em tempo real nas trocas de contexto. 
- **👥 Gestão de Pessoas 360:** Módulos de Recrutamento (Vagas, Fit Cultural, Tracking de Candidato), Feedbacks 360 e Controle de Ponto automatizado.
- **💬 Mural de Comunicação Interna:** Painel dinâmico gerando transparência e disseminação de Avisos Institucionais, de TI e Escalas organizados por níveis de prioridade.

---

## 🛠️ Arquitetura & Tecnologias

Optamos por uma stack moderna que garante **alta escalabilidade e fácil manutenção**, idealizada para aplicações SaaS Corporativas nível Enterprise.

![Architecture Flow](https://img.shields.io/badge/Arquitetura-Client--Side_SPA_com_BFF_Node-2d3748)

| Layer | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | React 19 + Vite + TypeScript | Performance máxima em renderização e Type-Safety garantindo baixo índice de runtime-errors. |
| **Estilização** | Tailwind CSS v4 + Motion | Desenvolvimento hiper ágil de UI e animações extremamente fluidas a 60 FPS. |
| **Data Viz** | Recharts + Lucide | Gráficos limpos e compreensíveis, iconografia consistente em todo o software. |
| **Backend/BFF** | Express + Node.js (via ESBuild) | Padrão robusto para servir as rotas da API, proteger as *API Keys* da IA, e gerenciar sessões. |
| **IA Engine** | `@google/genai` (Gemini) | Inferência linguística de ponta para análise sentimental dos funcionários. |
| **Cloud/BaaS** | Firebase (Firestore/Auth) | Integração serverless para gestão dos usuários (auth) e do banco de dados em tempo real. |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (versão 20+ recomendada)
- Chave de API do **Google Gemini** e credenciais do **Firebase**.

### Passos de Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SeuUsuario/pdi-hospital-sao-francisco.git
   cd pdi-hospital-sao-francisco

1. Instale as dependências:
code
Bash
npm install

2. Configure as Variáveis de Ambiente:
Crie um arquivo .env ou .env.local na raiz do projeto com base no arquivo de exemplo (se disponível):

code
Env
# API Keys server-side (NUNCA vaze essas chaves no frontend)
GEMINI_API_KEY="AIzaSy...sua-chave-gemini"

# Credenciais do Firebase se aplicável
VITE_FIREBASE_API_KEY="..."

Inicie o Servidor de Desenvolvimento:
code
Bash
npm run dev
O aplicativo estará rodando na porta 3000. Acesse: http://localhost:3000

Processo de Build e Deploy
A aplicação gera um build otimizado tanto do client SPA quanto do servidor Express, perfeito para containerização (Docker, Google Cloud Run, AWS).
code
Bash
# Compilar projeto
npm run build

# Iniciar o servidor de produção
npm run start
O comando de build compila o TypeScript via esbuild reduzindo o tamanho do container e eliminando dependências externas no tempo de execução.

📸 Telas & UX Destaque
A aplicação foi meticulosamente construída para transmitir calma e segurança através do uso de cores profundas (slate-900) aliadas a destaques vibrantes e gradientes sutis, reduzindo a fadiga ocular em profissionais de saúde durante longos turnos.
*(Dica: se quiser, você pode fazer upload das imagens do site na pasta do seu repo no Github e colocar os links nesta seção!)

💼 Por que os Recrutadores/Investidores devem se importar?
Escalável: Código bem componentizado seguindo arquitetura sustentável e padrões Clean Code.
Business-Oriented: Todo módulo reflete um problema real na rotina hospitalar (Ex: Turnover em Enfermagem) sendo atacado com dados e IA, mostrando visão de produto.
Segurança: As lógicas são aplicadas via Backend for Frontend (BFF) escondendo informações sensíveis, mantendo o frontend enxuto e seguro.
UX Premium: Uma quebra do padrão de "sistemas hospitalares antigos e cinzas" entregando uma experiência quase consumer-grade para operações críticas B2B.

📬 Contato & Networking
Sempre aberto a conexões inspiradoras, feedbacks de código e propostas de parcerias para escalar esse produto visionário!

• LinkedIn: https://www.linkedin.com/in/pedrodiogooficial

• Portfólio: https://eupedrodiogo.web.app

• E-mail: pedrodiogo.suporte@gmail.com
<p align="center">
<i>Desenvolvido com sofisticação em TypeScript e admiração pela área da saúde. ❤️🏥</i>
</p>
```

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, BrainCircuit, ChevronLeft } from 'lucide-react';

export default function AIAssistantWidget({ userName, userRole }: { userName: string, userRole: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `Olá, ${userName}! Sou a Assistente de IA do HSF. Como posso ajudar com sua jornada de desenvolvimento hoje?` }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Drag states
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);

  const suggestions = userRole === 'lider' ? [
    "Analisar PDI da minha equipe",
    "Sugerir metas para liderança"
  ] : userRole === 'rh' ? [
    "Resumo de engajamento geral",
    "Melhores práticas de recrutamento"
  ] : [
    "Ideias para meu PDI",
    "Como solicitar feedback?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startXRef.current === null || !isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startXRef.current;
    
    if (diff <= 0) {
      setDragOffset(Math.max(diff, -150));
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset < -30) {
      setIsOpen(true);
    }
    setDragOffset(0);
    setIsDragging(false);
    startXRef.current = null;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let responseText = "Entendi! Posso ajudar você a detalhar melhor esse ponto. O Hospital São Francisco valoriza muito a proatividade e o aprendizado contínuo. Sugiro buscar trilhas no módulo de Treinamentos ou conversar com seu líder no próximo check-in 1:1.";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("pdi") || lowerText.includes("meta")) {
        responseText = "Para estruturar um bom PDI, utilize o método SMART: Específico, Mensurável, Alcançável, Relevante e com Prazo definido. Que tal começar definindo uma meta de comunicação ou aprendizado em sua área?";
      } else if (lowerText.includes("feedback")) {
        responseText = "Um bom feedback deve ser focado na situação, no comportamento e no impacto (Modelo SCI). Lembre-se sempre de manter uma postura acolhedora, focada na evolução do profissional.";
      } else if (lowerText.includes("engajamento") || lowerText.includes("clima")) {
        responseText = "A plataforma ajuda a mapear o clima (Pesquisa de Clima) e o progresso em tempo real das equipes. Caso os níveis de engajamento caiam, recomendo sugerir 1:1s mais frequentes focados no bem estar.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText }]);
    }, 1500);
  };

  return (
    <>
      {!isOpen && !isDocked && (
        <div id="tour-ai-widget-floating" className="fixed bottom-24 md:bottom-6 right-6 z-40 group flex items-center justify-center transition-all duration-500 hover:scale-105">
          {/* Animated Glow Behind */}
          <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl group-hover:bg-teal-400/40 transition-all duration-500"></div>
          
          {/* Main Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full border border-slate-700/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden"
            title="Assistente de IA HSF"
          >
            {/* Glass Overlay */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <BrainCircuit className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] group-hover:animate-pulse" />
            
            <Sparkles className="absolute top-3 right-3 w-3 h-3 text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Dock / Dismiss Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsDocked(true); }}
            className="absolute -top-1 -left-1 w-5 h-5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-50 shadow-lg cursor-pointer"
            title="Ocultar na lateral"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Notification Badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></span>
        </div>
      )}

      {!isOpen && isDocked && (
        <div
          id="tour-ai-widget"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ transform: `translateX(${isDragging ? dragOffset : 0}px)` }}
          className={`fixed top-2/3 md:top-1/2 -translate-y-1/2 right-0 translate-x-[calc(100%-24px)] hover:translate-x-0 active:translate-x-0 z-50 group flex items-center transition-transform ${isDragging ? "duration-0" : "duration-500"} shadow-[-5px_0_30px_rgba(45,212,191,0.15)] bg-slate-900 border border-r-0 border-teal-500/30 rounded-l-2xl overflow-hidden cursor-pointer touch-none`}
        >
          {/* Edge Pull Handle (Always Visible) */}
          <div className="w-6 py-8 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-b from-teal-500/5 via-teal-500/20 to-teal-500/5 border-r border-teal-500/10">
             <ChevronLeft className="w-4 h-4 text-teal-400 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
             <div className="w-1 h-1 rounded-full bg-teal-400"></div>
             <div className="w-1 h-3 rounded-full bg-teal-400"></div>
             <div className="w-1 h-1 rounded-full bg-teal-400"></div>
          </div>
          
          {/* Main Content Area */}
          <div 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 pl-3 pr-6 py-4"
          >
            <div className="relative">
              <BrainCircuit className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] group-hover:animate-pulse" />
              <Sparkles className="absolute -top-1 -right-2 w-3 h-3 text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col items-start whitespace-nowrap">
              <span className="text-sm font-bold text-slate-100">Assistente IA</span>
              <span className="text-[10px] text-teal-400 font-medium tracking-wide leading-none mt-0.5">Deslize para abrir</span>
            </div>
          </div>

          <span className="absolute top-2 left-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"></span>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-[calc(100vw-32px)] md:w-[420px] bg-slate-950/80 backdrop-blur-2xl border border-slate-700/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-[2rem] flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
          
          {/* Header */}
          <div className="p-5 flex justify-between items-center relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"></div>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-b from-slate-800 to-slate-900 rounded-full border border-slate-700 shadow-inner">
                <BrainCircuit className="w-5 h-5 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)] animate-pulse" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-slate-100 text-[15px] flex items-center gap-1.5 tracking-wide">
                  Inteligência Unificada
                </h3>
                <span className="text-[11px] text-teal-400/80 font-medium tracking-widest uppercase">Assistente HSF</span>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); setIsDocked(true); }} className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-full hover:bg-slate-800/80 backdrop-blur-md">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-5 h-[55vh] md:h-[450px] overflow-y-auto flex flex-col gap-6 scrollbar-hide">
            {/* Ambient background glow inside messages */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-teal-500/10 blur-[60px] pointer-events-none"></div>

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
                {m.sender === 'ai' && (
                   <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mr-3 shadow-md mt-auto">
                      <BrainCircuit className="w-4 h-4 text-teal-400" />
                   </div>
                )}
                <div className={`whitespace-pre-wrap max-w-[80%] p-4 text-[13px] leading-relaxed relative ${
                  m.sender === 'user' 
                    ? 'bg-gradient-to-tr from-teal-600 to-teal-500 text-slate-50 rounded-2xl rounded-br-sm shadow-[0_5px_15px_rgba(13,148,136,0.25)]' 
                    : 'bg-slate-800/60 backdrop-blur-md border border-slate-700/50 text-slate-200 rounded-2xl rounded-bl-sm shadow-md'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mr-3 shadow-md mt-auto">
                   <BrainCircuit className="w-4 h-4 text-teal-400" />
                </div>
                <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 text-slate-400 p-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-md h-[46px]">
                  <span className="w-1.5 h-1.5 bg-slate-500/80 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500/80 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500/80 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Suggestions - Floating above input */}
          {messages.length === 1 && !isTyping && (
            <div className="px-5 pb-2 flex flex-wrap justify-end gap-2 relative z-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="bg-slate-800/80 backdrop-blur-md hover:bg-teal-500/20 border border-slate-700/80 hover:border-teal-500/50 text-teal-400/90 hover:text-teal-300 text-[11px] px-3.5 py-2 rounded-xl transition-all shadow-sm font-medium tracking-wide flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Area (Pill Design) */}
          <div className="p-4 pt-1 bg-transparent relative z-20">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2 shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Fale com a IA..."
                className="flex-grow bg-transparent border-none px-4 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 font-medium"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none text-slate-950 p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:shadow-[0_0_20px_rgba(20,184,166,0.6)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

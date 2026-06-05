import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Target, BarChart2, MessageSquare, ChevronRight, Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface OnboardingTourProps {
  userName: string;
  onComplete: () => void;
}

export default function OnboardingTour({ userName, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const steps = [
    {
      title: "Inteligência Unificada",
      description: `Olá, ${userName}! Preparamos um ambiente premium para que você acompanhe suas metas, plano de carreira e engajamento.`,
      icon: <BrainCircuit className="w-12 h-12 text-teal-400 animate-pulse" />,
      selector: null // Center screen
    },
    {
      title: "Meu PDI / Equipe",
      description: "Acompanhe todas as suas metas, planos e seu progresso com apenas um clique neste primeiro botão principal.",
      icon: <Target className="w-12 h-12 text-teal-400" />,
      selector: '[data-tour="nav-home"]' // Mobile bottom nav or Desktop sidebar
    },
    {
      title: "Ponto e Holerite",
      description: "Espelho de ponto e holerites a um clique de distância. Suplementos extras podem ser encontrados no botão \"Mais\".",
      icon: <BarChart2 className="w-12 h-12 text-teal-400" />,
      selector: '[data-tour="nav-escala"], [data-tour="nav-holerite"], [data-tour="nav-more"]' // Second nav buttons
    },
    {
      title: "Assistente de IA",
      description: "Sua assistente focada em Gente e Gestão está sempre disponível aqui no canto. Clique nela para conversar, tirar dúvidas e pedir orientações a qualquer momento.",
      icon: <MessageSquare className="w-12 h-12 text-teal-400" />,
      selector: '#tour-ai-widget, #tour-ai-widget-floating'
    }
  ];

  // Handle Resize & Scroll calculations
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const step = steps[currentStep];
    if (step.selector) {
      // Find all matching elements and get the first visible one
      const elements = document.querySelectorAll(step.selector);
      let foundEl: Element | null = null;
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Check if element is visible on screen
        if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top <= window.innerHeight) {
           if (!foundEl) foundEl = el;
        }
      });
      
      if (foundEl) {
        setTargetRect((foundEl as Element).getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, windowSize]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Ensure tour stays above everything
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 999999, // Super high z-index
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Determine modal position
  let modalStyle: React.CSSProperties = {
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: 'translateY(0)',
    opacity: 1
  };
  
  if (targetRect) {
    // If target is in the bottom half of screen, show modal above it
    const isBottom = targetRect.bottom > windowSize.height / 2;
    // If target is in the right half of screen, align right
    const isRight = targetRect.left > windowSize.width / 2;
    
    // Position modal relative to screen centers
    if (isBottom) {
       modalStyle.alignSelf = 'flex-end';
       modalStyle.marginBottom = `${windowSize.height - targetRect.top + 20}px`;
       
       if (isRight) {
          modalStyle.marginRight = '20px';
          modalStyle.marginLeft = 'auto';
       }
    } else {
       // Target top / Middle
       modalStyle.alignSelf = 'flex-start';
       modalStyle.marginTop = `${targetRect.bottom + 20}px`;
    }
  }

  // Generate an SVG mask for the spotlight effect
  const padding = 12;
  const rx = 16;

  const content = (
    <div style={overlayStyle} className="font-sans">
      {/* SVG Mask Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-all duration-700">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect 
                x={targetRect.left - padding} y={targetRect.top - padding} 
                width={targetRect.width + padding * 2} height={targetRect.height + padding * 2} 
                rx="16" fill="black" 
                className="transition-all duration-500 ease-out"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(2, 6, 23, 0.85)" mask="url(#spotlight-mask)" />
      </svg>
      {/* Highlight Stroke & Pulsing Target */}
      {targetRect && (
        <div 
          className="absolute z-10 border-2 border-teal-400/80 rounded-2xl shadow-[0_0_25px_rgba(45,212,191,0.6)] transition-all duration-500 ease-out pointer-events-none flex items-center justify-center"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
        >
          {/* Pulsing indicator exactly in the center of the highlight block */}
          <div className="absolute w-8 h-8 bg-teal-400/30 rounded-full animate-ping"></div>
          <div className="absolute w-2.5 h-2.5 bg-teal-300 rounded-full shadow-[0_0_10px_rgba(45,212,191,1)]"></div>
          
          {/* Arrow pointing at the target */}
          <div className="absolute top-[100%] mt-4 animate-bounce flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6e4336" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            <span className="font-bold text-teal-400 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full mt-2 text-xs border border-teal-500/30 shadow-lg whitespace-nowrap">
              Olhe aqui!
            </span>
          </div>
        </div>
      )}

      {/* Modal Container */}
      <div 
        className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700 w-[90%] max-w-[380px] rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative z-20 m-4"
        style={modalStyle}
      >
        {/* Glow Top */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
        
        <button 
           onClick={onComplete}
           className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1 bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors z-10"
        >
           <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col pt-10 relative">
          <div className="w-16 h-16 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-md border border-slate-700/50 relative">
             <div className="absolute inset-0 bg-teal-500/10 rounded-2xl blur-lg"></div>
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-xl font-display font-bold text-slate-100 mb-3 leading-tight">{steps[currentStep].title}</h2>
          <p className="text-slate-400 leading-relaxed text-[13px] font-medium min-h-[60px]">
            {steps[currentStep].description}
          </p>

          <div className="flex items-center justify-between mt-8">
             <div className="flex items-center gap-1.5">
               {steps.map((_, index) => (
                 <div 
                   key={index} 
                   className={`h-1.5 rounded-full transition-all duration-500 ${
                     index === currentStep ? 'w-6 bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'w-2 bg-slate-700'
                   }`}
                 />
               ))}
             </div>

            <button
              onClick={nextStep}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(20,184,166,0.3)] hover:shadow-[0_5px_20px_rgba(20,184,166,0.5)]"
            >
              {currentStep < steps.length - 1 ? (
                <>Continuar <ChevronRight className="w-4 h-4 -mr-1" /></>
              ) : (
                <>Começar a Usar <Check className="w-4 h-4 -mr-1" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render component using portal
  return createPortal(content, document.body);
}

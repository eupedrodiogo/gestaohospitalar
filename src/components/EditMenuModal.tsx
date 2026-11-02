import React, { useState } from 'react';
import { Reorder } from 'motion/react';
import { X, GripVertical, CheckCircle2 } from 'lucide-react';
import { ALL_NAV_MODULES, NavModule } from '../utils/navigationModules';

interface EditMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowedTabs: string[];
  initialOrder: string[];
  initialFixedCount: number;
  onSave: (newOrder: string[], fixedCount: number) => void;
  role: string;
}

export function EditMenuModal({ isOpen, onClose, allowedTabs, initialOrder, initialFixedCount, onSave, role }: EditMenuModalProps) {
  
  // Only order tabs that the user is allowed to see
  const defaultOrder = ALL_NAV_MODULES.filter(m => allowedTabs.includes(m.id)).map(m => m.id);
  
  // Use initialOrder if valid, otherwise fallback to default allowed
  const validInitial = initialOrder.filter(id => allowedTabs.includes(id));
  const missing = defaultOrder.filter(id => !validInitial.includes(id));
  const [items, setItems] = useState<string[]>([...validInitial, ...missing]);
  const [fixedCount, setFixedCount] = useState<number>(initialFixedCount || 4);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(items, fixedCount);
    onClose();
  };

  const renderLabel = (mod: NavModule) => {
    if (typeof mod.label === 'function') {
      return mod.label(role);
    }
    // Fallbacks for translations
    if (mod.id === 'feedback') return 'Feedback';
    if (mod.id === 'backup') return 'Backup';
    return mod.label;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col shrink-0 gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Personalizar Menu</h2>
              <p className="text-xs text-slate-400 mt-1">
                Arraste para reordenar os botões do menu.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <span className="text-xs font-medium text-slate-300">Botões fixos no celular:</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => setFixedCount(num)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    fixedCount === num 
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-1 p-2">
            {items.map((id, index) => {
              const mod = ALL_NAV_MODULES.find(m => m.id === id);
              if (!mod) return null;
              
              const isMobileBottomNav = index < fixedCount;

              return (
                <Reorder.Item 
                  key={id} 
                  value={id}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-grab active:cursor-grabbing hover:bg-slate-800 transition-colors ${isMobileBottomNav ? 'border-teal-500/20 bg-teal-500/5' : ''}`}
                >
                  <GripVertical className="w-4 h-4 text-slate-500 shrink-0" />
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${mod.bgClass || 'bg-slate-900'}`}>
                    <mod.icon className={`w-4 h-4 ${mod.colorClass || 'text-slate-300'}`} />
                  </div>
                  
                  <span className="text-sm font-medium text-slate-200 flex-grow">
                    {renderLabel(mod)}
                  </span>

                  {isMobileBottomNav && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/80 px-2 py-0.5 rounded-full bg-teal-400/10 border border-teal-400/20">
                      Fixo Mobile
                    </span>
                  )}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        <div className="p-5 border-t border-slate-800 bg-slate-900/50 shrink-0 flex gap-3">
          <button 
            onClick={() => {
              setItems(defaultOrder);
            }} 
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex-grow"
          >
            Restaurar Padrão
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors flex items-center justify-center gap-2 flex-grow"
          >
            <CheckCircle2 className="w-4 h-4" />
            Salvar Ordem
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { WorkOrderType, WorkOrderPriority, WorkOrder } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (order: Omit<WorkOrder, 'id' | 'createdAt' | 'status'>) => void;
}

export const ECNewWorkOrderModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentId: '',
    type: WorkOrderType.CORRECTIVE,
    priority: WorkOrderPriority.MEDIUM,
    technician: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({
      equipmentName: '',
      equipmentId: '',
      type: WorkOrderType.CORRECTIVE,
      priority: WorkOrderPriority.MEDIUM,
      technician: '',
      description: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nova Ordem de Serviço</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Preencha os dados para abrir um chamado</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Equipamento / Ativo</label>
              <input
                type="text" required
                placeholder="Ex: Respirador Hamilton G5"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm transition-all"
                value={formData.equipmentName}
                onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tag / Patrimônio</label>
                <input
                  type="text" placeholder="Ex: UTI-01"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm transition-all"
                  value={formData.equipmentId}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Técnico Responsável</label>
                <input
                  type="text" placeholder="Opcional"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm transition-all"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Manutenção</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as WorkOrderType })}
                >
                  {Object.values(WorkOrderType).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridade</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as WorkOrderPriority })}
                >
                  {Object.values(WorkOrderPriority).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição do Problema</label>
              <textarea
                required rows={4}
                placeholder="Descreva detalhadamente o defeito ou o serviço a ser realizado..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm resize-none transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {formData.priority === WorkOrderPriority.CRITICAL && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>Prioridade crítica acionará notificações imediatas para a equipe de plantão.</p>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm">
              <Save className="h-4 w-4" />
              Criar Ordem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ECNewWorkOrderModal;

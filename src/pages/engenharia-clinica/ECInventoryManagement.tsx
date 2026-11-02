import React, { useState, useMemo } from 'react';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, 
  CheckCircle2, AlertTriangle, AlertCircle, Info, MoreHorizontal, UploadCloud, Loader2
} from 'lucide-react';
import { Equipment, EquipmentStatus } from '../../types';
import { parseEquipmentExcelFile, getExcelSheets, parseEquipmentExcelSheet } from '../../services/ecDataService';

interface ECInventoryManagementProps {
  inventory: Equipment[];
  onAdd: (eq: Omit<Equipment, 'id'>) => void;
  onUpdate: (id: string, eq: Partial<Equipment>) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<EquipmentStatus, { color: string; icon: React.ElementType }> = {
  [EquipmentStatus.OPERATIONAL]: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: CheckCircle2 },
  [EquipmentStatus.MAINTENANCE]: { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: AlertTriangle },
  [EquipmentStatus.CALIBRATION]: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', icon: Info },
  [EquipmentStatus.DOWN]: { color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: AlertCircle },
};

export const ECInventoryManagement: React.FC<ECInventoryManagementProps> = ({
  inventory,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>({
    name: '',
    tag: '',
    sector: '',
    status: EquipmentStatus.OPERATIONAL,
    lastMaintenance: '',
    nextMaintenance: '',
    model: '',
    manufacturer: ''
  });

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.tag.toLowerCase().includes(search.toLowerCase()) ||
                          item.sector.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inventory, search, statusFilter]);

  const handleOpenModal = (item?: Equipment) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        tag: '',
        sector: '',
        status: EquipmentStatus.OPERATIONAL,
        lastMaintenance: '',
        nextMaintenance: '',
        model: '',
        manufacturer: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate(editingItem.id, formData);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o equipamento ${name}?`)) {
      onDelete(id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const result = await parseEquipmentExcelFile(file);
      if (result.normalized.length > 0) {
        if (window.confirm(`Foram encontrados ${result.normalized.length} equipamentos na planilha. Deseja importá-los para o banco de dados?`)) {
          // In real app, we should use a batch insert function from service. 
          // For now, we call onAdd sequentially.
          for (const eq of result.normalized) {
            const { id: _, ...eqData } = eq;
            onAdd(eqData);
          }
          alert('Equipamentos importados com sucesso!');
        }
      } else {
        alert('Nenhum dado válido de equipamento encontrado na planilha.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao processar o arquivo CSV/Excel: ' + err.message);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shrink-0">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{inventory.length}</p>
            <p className="text-xs text-slate-400">Total de Ativos</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shrink-0">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {inventory.filter(i => i.status === EquipmentStatus.OPERATIONAL).length}
            </p>
            <p className="text-xs text-slate-400">Operacionais</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg shrink-0">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {inventory.filter(i => i.status === EquipmentStatus.MAINTENANCE).length}
            </p>
            <p className="text-xs text-slate-400">Em Manutenção</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-2 justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl shadow-lg transition-all h-full whitespace-nowrap"
            title="Importar planilhas do Tasy (.csv, .xlsx)"
          >
            {isImporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
            <span className="hidden xl:inline">Importar Tasy</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-xl shadow-lg transition-all h-full whitespace-nowrap"
          >
            <Plus className="h-5 w-5" /> <span className="hidden xl:inline">Cadastrar Equipamento</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, tag ou setor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full md:w-auto px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-teal-500 transition-colors appearance-none"
          >
            <option value="ALL">Todos os Status</option>
            {Object.values(EquipmentStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Tag', 'Equipamento', 'Setor', 'Marca/Modelo', 'Status', 'Próx. Manutenção', 'Ações'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    Nenhum equipamento encontrado.
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => {
                  const sCfg = statusConfig[item.status];
                  const SIcon = sCfg.icon;
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-teal-400 whitespace-nowrap">{item.tag}</td>
                      <td className="px-5 py-4 text-white font-medium whitespace-nowrap">{item.name}</td>
                      <td className="px-5 py-4 text-slate-300 whitespace-nowrap">{item.sector}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {item.manufacturer} <br/><span className="text-slate-500">{item.model}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sCfg.color}`}>
                          <SIcon className="h-3 w-3 shrink-0" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-xs">
                        {item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleOpenModal(item)}
                            className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-teal-900/40 to-cyan-900/40">
              <h2 className="text-lg font-bold text-white">
                {editingItem ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Equipamento *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tag / Patrimônio *</label>
                  <input required type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Setor *</label>
                  <input required type="text" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Fabricante</label>
                  <input type="text" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Modelo</label>
                  <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status *</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as EquipmentStatus})}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 appearance-none">
                    {Object.values(EquipmentStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Última Manutenção</label>
                    <input type="date" value={formData.lastMaintenance} onChange={e => setFormData({...formData, lastMaintenance: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Próxima Manutenção</label>
                    <input type="date" value={formData.nextMaintenance} onChange={e => setFormData({...formData, nextMaintenance: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 [color-scheme:dark]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-slate-800">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-teal-900/20">
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

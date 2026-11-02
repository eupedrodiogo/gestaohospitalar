import React, { useState, useEffect } from 'react';
import {
  Droplets, Database, BarChart4, Plus, FileText, TrendingUp,
  CreditCard, Calendar, Loader2, Pencil, Trash2, UploadCloud, CheckCircle2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { LiquidGasEntry, CylinderDelivery, GasType } from '../../types';
import { GasService, GasDashboardData } from '../../services/ecGasService';
import { parseLiquidGasExcelSheet, getExcelSheets } from '../../services/ecDataService';

// ---- Sub-components ----

interface LiquidFormProps {
  initialData?: LiquidGasEntry;
  onSubmit: (e: Omit<LiquidGasEntry, 'id' | 'totalValue'>) => void;
  onCancel: () => void;
}

const LiquidGasForm: React.FC<LiquidFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [fd, setFd] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    orderDate: initialData?.orderDate || '',
    orderNumber: initialData?.orderNumber || '',
    invoiceDate: initialData?.invoiceDate || '',
    invoiceNumber: initialData?.invoiceNumber || '',
    volume: initialData?.volume || 0,
    pricePerUnit: initialData?.pricePerUnit || 0,
    boletoDueDate: initialData?.boletoDueDate || '',
    paymentStatus: initialData?.paymentStatus || ('Pending' as const),
  });
  const total = fd.volume * fd.pricePerUnit;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(fd); }} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white">{initialData ? 'Editar' : 'Novo'} Abastecimento — Oxigênio Líquido</h3>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white"><span className="text-xl">×</span></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Data de Entrega', key: 'date', type: 'date', required: true },
          { label: 'Data do Pedido', key: 'orderDate', type: 'date' },
          { label: 'Número do Pedido', key: 'orderNumber', type: 'text', placeholder: 'Ex: 555' },
          { label: 'Data da Nota', key: 'invoiceDate', type: 'date' },
          { label: 'Número da Nota (DANFE)', key: 'invoiceNumber', type: 'text', required: true },
          { label: 'Volume (m³)', key: 'volume', type: 'number', step: '0.001', min: '0', required: true },
          { label: 'Preço Unitário (R$)', key: 'pricePerUnit', type: 'number', step: '0.01', min: '0', required: true },
          { label: 'Vencimento Boleto', key: 'boletoDueDate', type: 'date', required: true },
        ].map(({ label, key, ...props }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
            <input
              {...props}
              value={(fd as any)[key] || ''}
              onChange={(e) => setFd({ ...fd, [key]: props.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-teal-500"
            />
          </div>
        ))}
        <div className="md:col-span-2 flex justify-between items-center bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl">
          <span className="font-semibold text-slate-300 text-sm">Total Estimado:</span>
          <span className="text-xl font-bold text-teal-400">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Status Pagamento</label>
          <select
            value={fd.paymentStatus}
            onChange={(e) => setFd({ ...fd, paymentStatus: e.target.value as any })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-teal-500"
          >
            <option value="Pending">Pendente</option>
            <option value="OK">Pago (OK)</option>
            <option value="NOK">Não Pago (NOK)</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-300 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">Salvar</button>
      </div>
    </form>
  );
};

interface CylinderFormProps {
  initialData?: CylinderDelivery;
  onSubmit: (d: Omit<CylinderDelivery, 'id' | 'totalValue'>) => void;
  onCancel: () => void;
}

const CylinderGasForm: React.FC<CylinderFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [fd, setFd] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    orderDate: initialData?.orderDate || '',
    orderNumber: initialData?.orderNumber || '',
    invoiceDate: initialData?.invoiceDate || '',
    invoiceNumber: initialData?.invoiceNumber || '',
    supplier: initialData?.supplier || 'White Martins',
  });
  const [items, setItems] = useState(initialData?.items || [{ gasType: GasType.O2_CYLINDER_10M3, quantity: 1, priceUnit: 0, total: 0 }]);
  const deliveryTotal = items.reduce((s, i) => s + i.quantity * i.priceUnit, 0);

  const updateItem = (idx: number, field: string, val: any) => {
    const newItems = [...items];
    (newItems[idx] as any)[field] = val;
    if (field === 'quantity' || field === 'priceUnit') newItems[idx].total = newItems[idx].quantity * newItems[idx].priceUnit;
    setItems(newItems);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...fd, items }); }} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white">{initialData ? 'Editar' : 'Nova'} Remessa — Cilindros</h3>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white text-xl">×</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Data Entrega', key: 'date', type: 'date', required: true },
          { label: 'Data Pedido', key: 'orderDate', type: 'date' },
          { label: 'Nº Pedido', key: 'orderNumber', type: 'text', placeholder: '555' },
          { label: 'Data Nota', key: 'invoiceDate', type: 'date' },
          { label: 'Nota Fiscal', key: 'invoiceNumber', type: 'text', required: true },
          { label: 'Fornecedor', key: 'supplier', type: 'text', required: true },
        ].map(({ label, key, ...props }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
            <input {...props} value={(fd as any)[key] || ''} onChange={(e) => setFd({ ...fd, [key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-teal-500" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Itens da Nota</h4>
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-wrap gap-3 items-end bg-white/5 border border-white/10 p-3 rounded-xl">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-slate-500 mb-1">Tipo de Gás</label>
              <select value={item.gasType} onChange={(e) => updateItem(idx, 'gasType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm outline-none">
                {Object.values(GasType).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="w-20">
              <label className="block text-xs text-slate-500 mb-1">Qtd</label>
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm outline-none" />
            </div>
            <div className="w-28">
              <label className="block text-xs text-slate-500 mb-1">Preço Unit.</label>
              <input type="number" step="0.01" min="0" value={item.priceUnit} onChange={(e) => updateItem(idx, 'priceUnit', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white text-sm outline-none" />
            </div>
            <div className="w-28">
              <label className="block text-xs text-slate-500 mb-1">Total</label>
              <div className="px-3 py-2 bg-teal-500/10 text-teal-400 rounded-lg text-sm font-medium text-right">{item.total.toFixed(2)}</div>
            </div>
            <button type="button" onClick={() => items.length > 1 && setItems(items.filter((_, i) => i !== idx))}
              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" disabled={items.length === 1}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setItems([...items, { gasType: GasType.O2_CYLINDER_10M3, quantity: 1, priceUnit: 0, total: 0 }])}
          className="w-full py-2 border-2 border-dashed border-white/10 hover:border-teal-500/50 text-slate-400 hover:text-teal-400 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
          <Plus size={16} /> Adicionar Item
        </button>
      </div>

      <div className="flex justify-between items-center bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl">
        <span className="font-bold text-slate-300 text-sm">Total da Nota Fiscal:</span>
        <span className="text-xl font-bold text-teal-400">{deliveryTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-300 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">Salvar Entrada</button>
      </div>
    </form>
  );
};

// ---- Main Component ----

const CHART_COLORS = ['#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#f59e0b'];

export const ECGasManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'liquid' | 'cylinder' | 'reports'>('liquid');
  const [showLiquidForm, setShowLiquidForm] = useState(false);
  const [showCylinderForm, setShowCylinderForm] = useState(false);
  const [liquidEntries, setLiquidEntries] = useState<LiquidGasEntry[]>([]);
  const [cylinderDeliveries, setCylinderDeliveries] = useState<CylinderDelivery[]>([]);
  const [dashboardData, setDashboardData] = useState<GasDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLiquidId, setEditingLiquidId] = useState<string | null>(null);
  const [editingCylinderId, setEditingCylinderId] = useState<string | null>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [showSheetSelect, setShowSheetSelect] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [liquid, cylinders, dashboard] = await Promise.all([
          GasService.getLiquidEntries(),
          GasService.getCylinderDeliveries(),
          GasService.getDashboardMetrics(),
        ]);
        setLiquidEntries(liquid);
        setCylinderDeliveries(cylinders);
        setDashboardData(dashboard);
      } catch (e) {
        console.error('Failed to load gas data', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSaveLiquid = async (entry: any) => {
    try {
      if (editingLiquidId) {
        await GasService.updateLiquidEntry(editingLiquidId, entry);
        setLiquidEntries(liquidEntries.map((e) => e.id === editingLiquidId ? { ...e, ...entry } : e));
        setEditingLiquidId(null);
      } else {
        const newEntry = await GasService.addLiquidEntry(entry);
        setLiquidEntries([newEntry, ...liquidEntries]);
      }
      setShowLiquidForm(false);
    } catch (e) { alert('Erro ao salvar entrada.'); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const sheets = await getExcelSheets(file);
      if (sheets.length > 0) {
        setAvailableSheets(sheets);
        setSelectedFile(file);
        setSelectedSheets([]);
        setShowSheetSelect(true);
      } else {
        alert('Nenhuma aba encontrada no arquivo.');
        setIsImporting(false);
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao ler o arquivo CSV/Excel: ' + err.message);
      setIsImporting(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmSheetSelection = async () => {
    if (!selectedFile || selectedSheets.length === 0) return;
    setShowSheetSelect(false);
    setIsImporting(true);
    try {
      let totalImported = 0;
      for (const sheet of selectedSheets) {
        const result = await parseLiquidGasExcelSheet(selectedFile, sheet);
        if (result.normalized.length > 0) {
          for (const entry of result.normalized) {
            const { id: _, ...entryData } = entry;
            const newEntry = await GasService.addLiquidEntry(entryData);
            setLiquidEntries(prev => [newEntry, ...prev]);
            totalImported++;
          }
        }
      }
      alert(`Foram importados ${totalImported} registros com sucesso das planilhas selecionadas!`);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao importar abas: ' + err.message);
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
      setAvailableSheets([]);
      setSelectedSheets([]);
    }
  };

  const toggleSheetSelection = (sheet: string) => {
    setSelectedSheets(prev => 
      prev.includes(sheet) ? prev.filter(s => s !== sheet) : [...prev, sheet]
    );
  };

  const handleSaveCylinder = async (delivery: any) => {
    try {
      if (editingCylinderId) {
        await GasService.updateCylinderDelivery(editingCylinderId, delivery);
        setCylinderDeliveries(cylinderDeliveries.map((d) => d.id === editingCylinderId ? { ...d, ...delivery } : d));
        setEditingCylinderId(null);
      } else {
        const newDel = await GasService.addCylinderDelivery(delivery);
        setCylinderDeliveries([newDel, ...cylinderDeliveries]);
      }
      setShowCylinderForm(false);
    } catch (e) { alert('Erro ao salvar remessa.'); }
  };

  const paymentBadge = (s: string) => {
    if (s === 'OK') return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30';
    if (s === 'NOK') return 'bg-red-400/10 text-red-400 border-red-400/30';
    return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30';
  };

  const tabs = [
    { id: 'liquid' as const, label: 'Oxigênio Líquido', icon: Droplets },
    { id: 'cylinder' as const, label: 'Cilindros', icon: Database },
    { id: 'reports' as const, label: 'Relatórios', icon: BarChart4 },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-10 w-10 text-teal-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      {/* Liquid Tab */}
      {activeTab === 'liquid' && (
        <div className="space-y-4">
          {!showLiquidForm ? (
            <div className="flex gap-3">
              <button onClick={() => { setEditingLiquidId(null); setShowLiquidForm(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors">
                <Plus className="h-4 w-4" /> Novo Abastecimento
              </button>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
                title="Importar planilhas CSV/XLSX"
              >
                {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                Importar CSV/XLSX
              </button>
            </div>
          ) : (
            <LiquidGasForm
              initialData={editingLiquidId ? liquidEntries.find((e) => e.id === editingLiquidId) : undefined}
              onSubmit={handleSaveLiquid}
              onCancel={() => { setShowLiquidForm(false); setEditingLiquidId(null); }}
            />
          )}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
              <Droplets className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-white">Histórico — Oxigênio Líquido</h3>
              <span className="ml-auto text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">{liquidEntries.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  {['Data', 'Nº Nota', 'Volume (m³)', 'Preço/m³', 'Total', 'Boleto', 'Pagamento', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {liquidEntries.map((e) => (
                    <tr key={e.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{e.date}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{e.invoiceNumber}</td>
                      <td className="px-4 py-3 text-white font-medium">{e.volume.toFixed(3)}</td>
                      <td className="px-4 py-3 text-slate-300">{e.pricePerUnit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="px-4 py-3 text-teal-400 font-semibold">{e.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{e.boletoDueDate || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${paymentBadge(e.paymentStatus)}`}>{e.paymentStatus}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditingLiquidId(e.id); setShowLiquidForm(true); }}
                          className="p-1.5 text-slate-500 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {liquidEntries.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm">Nenhum registro encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cylinder Tab */}
      {activeTab === 'cylinder' && (
        <div className="space-y-4">
          {!showCylinderForm ? (
            <button onClick={() => { setEditingCylinderId(null); setShowCylinderForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> Nova Remessa de Cilindros
            </button>
          ) : (
            <CylinderGasForm
              initialData={editingCylinderId ? cylinderDeliveries.find((d) => d.id === editingCylinderId) : undefined}
              onSubmit={handleSaveCylinder}
              onCancel={() => { setShowCylinderForm(false); setEditingCylinderId(null); }}
            />
          )}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
              <Database className="h-5 w-5 text-orange-400" />
              <h3 className="font-semibold text-white">Histórico — Cilindros</h3>
              <span className="ml-auto text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">{cylinderDeliveries.length} registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  {['Data', 'Nº Nota', 'Fornecedor', 'Itens', 'Total', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {cylinderDeliveries.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{d.date}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{d.invoiceNumber}</td>
                      <td className="px-4 py-3 text-white">{d.supplier}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{d.items.length} item(ns)</td>
                      <td className="px-4 py-3 text-orange-400 font-semibold">{d.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditingCylinderId(d.id); setShowCylinderForm(true); }}
                          className="p-1.5 text-slate-500 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cylinderDeliveries.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">Nenhum registro encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {dashboardData && dashboardData.monthlyCosts.length > 0 ? (
            <>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Custo Mensal de Gases</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dashboardData.monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                    <Legend />
                    <Bar dataKey="liquido" name="Oxigênio Líquido" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="cilindros" name="Cilindros" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {dashboardData.costDistribution.some((d) => d.value > 0) && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Distribuição de Custos</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={dashboardData.costDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {dashboardData.costDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <BarChart4 className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium">Nenhum dado de custo disponível ainda.</p>
              <p className="text-sm mt-1">Registre entregas nas abas Oxigênio Líquido ou Cilindros.</p>
            </div>
          )}
        </div>
      )}
      {/* Sheet selection modal */}
      {showSheetSelect && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowSheetSelect(false); setSelectedFile(null); setAvailableSheets([]); setIsImporting(false); }} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-white mb-2">Selecionar Abas para Importar</h3>
            <p className="text-sm text-slate-400 mb-4">Selecione uma ou mais abas da planilha para importar os dados:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {availableSheets.map((s) => {
                const isSelected = selectedSheets.includes(s);
                return (
                  <button key={s} onClick={() => toggleSheetSelection(s)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                      isSelected 
                        ? 'bg-teal-500/20 border-teal-500 text-white' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}>
                    {s}
                    {isSelected && <div className="h-4 w-4 bg-teal-500 rounded-full flex items-center justify-center"><CheckCircle2 className="h-3 w-3 text-white" /></div>}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowSheetSelect(false); setSelectedFile(null); setAvailableSheets([]); setIsImporting(false); }}
                className="px-4 py-2 text-slate-300 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                Cancelar
              </button>
              <button onClick={handleConfirmSheetSelection} disabled={selectedSheets.length === 0}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors">
                Importar ({selectedSheets.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ECGasManagement;

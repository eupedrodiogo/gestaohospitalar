/**
 * EngenhariaClinicaPanel — Painel raiz do módulo de Engenharia Clínica
 * Integrado ao sistema de tabs do gestaohospitalar
 */

import React, { useState, useEffect, useRef } from 'react';
import { Wrench, Droplets, LayoutDashboard, BrainCircuit, Loader2, Package } from 'lucide-react';

import { WorkOrder, RawExcelData, Equipment } from '../types';
import { ECDashboardHome } from './engenharia-clinica/ECDashboardHome';
import { ECGasManagement } from './engenharia-clinica/ECGasManagement';
import { ECNewWorkOrderModal } from './engenharia-clinica/ECNewWorkOrderModal';
import { ECAIModal } from './engenharia-clinica/ECAIModal';
import { ECInventoryManagement } from './engenharia-clinica/ECInventoryManagement';

import * as ecWorkOrderService from '../services/ecWorkOrderService';
import * as ecInventoryService from '../services/ecInventoryService';
import { getExcelSheets, parseExcelFile, parseExcelSheet } from '../services/ecDataService';

type ECTab = 'dashboard' | 'inventory' | 'gases';

const EngenhariaClinicaPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ECTab>('dashboard');
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [inventory, setInventory] = useState<Equipment[]>([]);
  const [rawExcelData, setRawExcelData] = useState<RawExcelData | null>(null);
  const [isRawView, setIsRawView] = useState(false);

  // Modals
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Excel import
  const [isImporting, setIsImporting] = useState(false);
  const [showSheetSelect, setShowSheetSelect] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Firestore subscription
  useEffect(() => {
    ecWorkOrderService.seedDatabaseIfEmpty().catch(console.error);
    const unsub = ecWorkOrderService.subscribeToWorkOrders(setOrders);
    
    ecInventoryService.seedInventoryIfEmpty().catch(console.error);
    const unsubInv = ecInventoryService.subscribeToInventory(setInventory);
    
    return () => {
      unsub();
      unsubInv();
    };
  }, []);

  const handleCreateOrder = async (orderData: Omit<WorkOrder, 'id' | 'createdAt' | 'status'>) => {
    try {
      await ecWorkOrderService.addWorkOrder({ ...orderData, status: 'Aberto', createdAt: new Date().toISOString() });
    } catch {
      alert('Erro ao criar ordem de serviço.');
    }
  };

  const handleAddEquipment = async (eq: Omit<Equipment, 'id'>) => {
    try { await ecInventoryService.addEquipment(eq); } catch (e) { alert('Erro ao adicionar equipamento.'); }
  };
  const handleUpdateEquipment = async (id: string, eq: Partial<Equipment>) => {
    try { await ecInventoryService.updateEquipment(id, eq); } catch (e) { alert('Erro ao atualizar equipamento.'); }
  };
  const handleDeleteEquipment = async (id: string) => {
    try { await ecInventoryService.deleteEquipment(id); } catch (e) { alert('Erro ao deletar equipamento.'); }
  };

  const handleAIAnalysis = async () => {
    if (orders.length === 0) { alert('Não há dados para analisar.'); return; }
    setIsAnalyzing(true);
    setIsAIOpen(true);
    try {
      // Análise básica local (sem chamar modelo externo neste momento)
      const critical = orders.filter((o) => o.priority === 'Crítica' && o.status !== 'Concluído').length;
      const open = orders.filter((o) => o.status !== 'Concluído').length;
      const preventive = orders.filter((o) => o.type === 'Preventiva').length;
      const riskLevel = critical > 2 ? 'Alto' : critical > 0 ? 'Médio' : 'Baixo';

      setAiResult({
        summary: `Há ${open} ordens abertas de um total de ${orders.length}. ${critical} OS críticas requerem atenção imediata. ${preventive} ordens são de manutenção preventiva.`,
        recommendations: [
          critical > 0 ? `Priorizar as ${critical} OS críticas em aberto.` : 'Manter o monitoramento preventivo em dia.',
          `Taxa de preventiva: ${Math.round((preventive / orders.length) * 100)}% — ${preventive / orders.length > 0.5 ? 'bom índice' : 'considere aumentar manutenções preventivas'}.`,
          'Revisar equipamentos com histórico de falhas recorrentes no próximo ciclo.',
        ],
        riskLevel,
      });
    } catch {
      setAiResult({ summary: 'Erro ao gerar análise.', recommendations: ['Tente novamente.'], riskLevel: 'Desconhecido' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportExcel = () => fileInputRef.current?.click();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const sheets = await getExcelSheets(file);
      if (sheets.length > 1) {
        setAvailableSheets(sheets);
        setSelectedFile(file);
        setShowSheetSelect(true);
        return;
      }
      const result = await parseExcelFile(file);
      if (result.normalized.length > 0) {
        setOrders(result.normalized);
        setRawExcelData(result);
        setIsRawView(true);
        alert(`${result.normalized.length} ordens importadas com sucesso!`);
      } else {
        alert('Nenhum dado válido encontrado na planilha.');
      }
    } catch {
      alert('Erro ao processar o arquivo Excel.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSheetSelect = async (sheetName: string) => {
    if (!selectedFile) return;
    setShowSheetSelect(false);
    setIsImporting(true);
    try {
      const result = await parseExcelSheet(selectedFile, sheetName);
      if (result.normalized.length > 0) {
        setOrders(result.normalized);
        setRawExcelData(result);
        setIsRawView(true);
        alert(`${result.normalized.length} ordens importadas da aba "${sheetName}".`);
      }
    } catch {
      alert('Erro ao processar a aba selecionada.');
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
      setAvailableSheets([]);
    }
  };

  const tabs: { id: ECTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Ordens de Serviço', icon: LayoutDashboard },
    { id: 'inventory', label: 'Gestão de Inventário', icon: Package },
    { id: 'gases', label: 'Gestão de Gases', icon: Droplets },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg">
          <Wrench className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Engenharia Clínica</h1>
          <p className="text-sm text-slate-400">Manutenção de Equipamentos e Gestão de Gases Medicinais</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
          >
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <ECDashboardHome
          onAnalyze={handleAIAnalysis}
          onNewOrder={() => setIsNewOrderOpen(true)}
          onImportExcel={handleImportExcel}
          searchQuery={searchQuery}
          orders={orders}
          rawExcelData={rawExcelData}
          isRawView={isRawView}
          setIsRawView={setIsRawView}
          isImporting={isImporting}
        />
      )}
      {activeTab === 'inventory' && (
        <ECInventoryManagement 
          inventory={inventory}
          onAdd={handleAddEquipment}
          onUpdate={handleUpdateEquipment}
          onDelete={handleDeleteEquipment}
        />
      )}
      {activeTab === 'gases' && <ECGasManagement />}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} />

      {/* Sheet selection modal */}
      {showSheetSelect && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowSheetSelect(false); setSelectedFile(null); setAvailableSheets([]); setIsImporting(false); }} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-white mb-2">Selecionar Aba</h3>
            <p className="text-sm text-slate-400 mb-4">O arquivo possui {availableSheets.length} abas. Selecione qual importar:</p>
            <div className="space-y-2">
              {availableSheets.map((s) => (
                <button key={s} onClick={() => handleSheetSelect(s)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-500/30 text-white text-sm transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ECNewWorkOrderModal isOpen={isNewOrderOpen} onClose={() => setIsNewOrderOpen(false)} onCreate={handleCreateOrder} />
      <ECAIModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} isLoading={isAnalyzing} data={aiResult} />
    </div>
  );
};

export default EngenhariaClinicaPanel;

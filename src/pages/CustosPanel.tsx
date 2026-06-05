import React, { useState } from "react";
import { 
  Building, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sliders, 
  PiggyBank, 
  Percent, 
  CheckCircle2, 
  X, 
  ChevronRight,
  RefreshCw,
  Search,
  Layers,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  FileWarning,
  Activity,
  FileText,
  Calculator,
  Users,
  Info
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface CustosPanelProps {
  userRole: string;
  userName: string;
  activeTab?: string;
}

const operationalCostsData = [
  { department: 'Pronto Socorro', Custo: 850000, Faturamento: 1100000 },
  { department: 'UTI Adulto', Custo: 1200000, Faturamento: 1450000 },
  { department: 'Centro Cirúrgico', Custo: 950000, Faturamento: 1700000 },
  { department: 'SADT / Exames', Custo: 450000, Faturamento: 680000 },
  { department: 'Internações', Custo: 750000, Faturamento: 1050000 },
];

const opmeCostsData = [
  { center: 'Hemodinâmica', amount: 820000 },
  { center: 'Ortopedia', amount: 650000 },
  { center: 'Neurologia', amount: 480000 },
  { center: 'Cardiologia', amount: 350000 },
  { center: 'Bucomaxilo', amount: 150000 },
];

const custosProcedimentoData = [
  { procedure: 'Troca Valvar (CV)', Previsto: 45000, Realizado: 52000 },
  { procedure: 'Artroplastia Joelho', Previsto: 28000, Realizado: 31000 },
  { procedure: 'Craniectomia', Previsto: 65000, Realizado: 62000 },
  { procedure: 'Revascularização', Previsto: 58000, Realizado: 64000 },
  { procedure: 'Apêndice (Vídeo)', Previsto: 12000, Realizado: 12500 },
];

const priceAlerts = [
  { id: 'M-1029', item: 'Dipirona Injetável 500mg', category: 'Medicamentos', prevPrice: 0.85, newPrice: 1.15, variance: 35.3 },
  { id: 'M-4032', item: 'Fentanila 50mcg/ml', category: 'Anestésicos', prevPrice: 4.50, newPrice: 5.80, variance: 28.9 },
  { id: 'O-9921', item: 'Cateter Venoso Central', category: 'Insumos UTI', prevPrice: 125.00, newPrice: 145.00, variance: 16.0 },
];

export interface DreSectorData {
  name: string;
  receitaBruta: number;
  deducoes: number; // glosas, impostos
  custosMed: number; // medicamentos e insumos
  custosOpme: number; // OPME e insumos especiais
  custosPessoal: number; // folha de pagamento alocada
  despesasGerais: number; // despesas diretas
  rateioIndireto: number; // rateio de TI, infra, adm
  colaboradoresAlocados: number;
  leitosAlocados: number;
}

const dreDataBySector: Record<string, DreSectorData> = {
  consolidado: {
    name: "Consolidado Geral (Hospital HSF)",
    receitaBruta: 8500000,
    deducoes: 960000,
    custosMed: 1450000,
    custosOpme: 2450000,
    custosPessoal: 4380000, // Alto custo devido a 1300 colaboradores
    despesasGerais: 340000,
    rateioIndireto: 1540000, // Carga indireta de retaguarda (79 centros de custo)
    colaboradoresAlocados: 1300,
    leitosAlocados: 140
  },
  utiAdulto: {
    name: "UTI Adulto",
    receitaBruta: 1450000,
    deducoes: 130500,
    custosMed: 280000,
    custosOpme: 350000,
    custosPessoal: 520000,
    despesasGerais: 45000,
    rateioIndireto: 260000, // Cota de rateio
    colaboradoresAlocados: 154,
    leitosAlocados: 30
  },
  centroCirurgico: {
    name: "Centro Cirúrgico",
    receitaBruta: 1700000,
    deducoes: 119000,
    custosMed: 340000,
    custosOpme: 820000,
    custosPessoal: 370000,
    despesasGerais: 38000,
    rateioIndireto: 310000,
    colaboradoresAlocados: 98,
    leitosAlocados: 0
  },
  prontoSocorro: {
    name: "Pronto Socorro",
    receitaBruta: 1100000,
    deducoes: 154000,
    custosMed: 250000,
    custosOpme: 110000,
    custosPessoal: 490000,
    despesasGerais: 25005,
    rateioIndireto: 195000,
    colaboradoresAlocados: 210,
    leitosAlocados: 10
  },
  sadt: {
    name: "SADT / Exames",
    receitaBruta: 680000,
    deducoes: 47600,
    custosMed: 95000,
    custosOpme: 30000,
    custosPessoal: 280000,
    despesasGerais: 15000,
    rateioIndireto: 120000,
    colaboradoresAlocados: 85,
    leitosAlocados: 0
  },
  internacoes: {
    name: "Internações e Enfermarias",
    receitaBruta: 3570000,
    deducoes: 508900,
    custosMed: 485000,
    custosOpme: 1140000,
    custosPessoal: 2720000,
    despesasGerais: 217000,
    rateioIndireto: 655000,
    colaboradoresAlocados: 753,
    leitosAlocados: 100
  }
};

const initialCostItems = [
  { 
    id: 'C-5581', 
    item: 'Órteses e Próteses Importadas (OPME)', 
    category: 'Cirurgia Cardiovascular', 
    unitCost: 18500, 
    volMonthly: 42, 
    status: 'Análise de Alternativas', 
    wasteRate: 8,
    action: 'Padronizar fornecedores e analisar similares nacionais homologados.'
  },
  { 
    id: 'C-5582', 
    item: 'Antibiótico de Alto Custo (Dose Unitária)', 
    category: 'Farmacologia / CCIH', 
    unitCost: 3500, 
    volMonthly: 120, 
    status: 'Otimizado via Fracionamento', 
    wasteRate: 2,
    action: 'Aplicação integral da dispensação fracionada por código de barras.'
  },
  { 
    id: 'C-5583', 
    item: 'Gasoterapia - Fluxo Central de Oxigênio', 
    category: 'Gases Medicinais', 
    unitCost: 75, 
    volMonthly: 1540, 
    status: 'Perda de Pressão Alerta', 
    wasteRate: 14,
    action: 'Manutenção preventiva da rede de gases para neutralizar vazamentos.'
  },
  { 
    id: 'C-5584', 
    item: 'Alimentação Enteral e Dietas Especiais', 
    category: 'Nutrição Hospitalar', 
    unitCost: 280, 
    volMonthly: 310, 
    status: 'Monitorado', 
    wasteRate: 5,
    action: 'Mapeamento antropométrico individual para evitar sobras clínicas.'
  }
];

export default function CustosPanel({ userRole, userName, activeTab = "dre" }: CustosPanelProps) {
  const [selectedItem, setSelectedItem] = useState<typeof initialCostItems[0] | null>(null);
  const [costItems, setCostItems] = useState(initialCostItems);
  const [searchTerm, setSearchTerm] = useState("");

  // Sub panel navigation and interactive DRE states
  const activeSubTab = 
    activeTab === "simulador_custos" ? "controladoria" : 
    activeTab === "kpis" ? "kpis" : "dre";
  const [selectedDreSector, setSelectedDreSector] = useState<string>("consolidado");
  const [dreAllocationMode, setDreAllocationMode] = useState<"contribution" | "absorption">("contribution");

  // Simulator States
  const [selectedCostCenter, setSelectedCostCenter] = useState("Pronto Socorro");
  const [wasteReduction, setWasteReduction] = useState(10); // in percent
  const [occupancyAdjustment, setOccupancyAdjustment] = useState(85); // in percent
  const [processDigitalization, setProcessDigitalization] = useState(20); // in percent

  // Calculate simulated monthly savings
  const getSimulatedSavings = () => {
    let baseCost = 0;
    if (selectedCostCenter === "Pronto Socorro") baseCost = 850000;
    if (selectedCostCenter === "UTI Adulto") baseCost = 1200000;
    if (selectedCostCenter === "Centro Cirúrgico") baseCost = 950000;
    if (selectedCostCenter === "SADT / Exames") baseCost = 450000;
    if (selectedCostCenter === "Internações") baseCost = 750000;

    const wasteSavings = baseCost * (wasteReduction / 100) * 0.4;
    const processSavings = baseCost * (processDigitalization / 100) * 0.3;
    const occupancyImpact = baseCost * ((occupancyAdjustment - 80) / 100) * 0.15;

    const totalSavings = Math.max(0, Math.round(wasteSavings + processSavings + occupancyImpact));
    return totalSavings;
  };

  const handleApplyOptimization = (itemId: string) => {
    setCostItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { 
          ...item, 
          status: 'Otimizado via Fracionamento',
          wasteRate: Math.max(1, item.wasteRate - 4)
        };
      }
      return item;
    }));
    setSelectedItem(prev => {
      if (prev && prev.id === itemId) {
        return {
          ...prev,
          status: 'Otimizado via Fracionamento',
          wasteRate: Math.max(1, prev.wasteRate - 4)
        };
      }
      return prev;
    });
  };

  const filteredItems = costItems.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DRE calculated fields based on current state variables
  const dreData = dreDataBySector[selectedDreSector] || dreDataBySector.consolidado;
  const recBruta = dreData.receitaBruta;
  const ded = dreData.deducoes;
  const recLiquida = recBruta - ded;
  const cMatMed = dreData.custosMed;
  const cOpme = dreData.custosOpme;
  const cPessoal = dreData.custosPessoal;
  const cGerais = dreData.despesasGerais;
  const totalCustosDiretos = cMatMed + cOpme + cPessoal + cGerais;
  const margemContr = recLiquida - totalCustosDiretos;
  const margemContrPct = recLiquida > 0 ? (margemContr / recLiquida) * 100 : 0;
  const rateio = dreData.rateioIndireto;
  const ebitda = dreAllocationMode === "contribution" ? margemContr : margemContr - rateio;
  const ebitdaPct = recLiquida > 0 ? (ebitda / recLiquida) * 100 : 0;

  return (
    <div className="space-y-6 text-left animate-fade-in pb-20 md:pb-0 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-display font-medium text-slate-100 flex items-center gap-3">
            <Sliders className="w-6 h-6 text-teal-400" />
            Custos e Controladoria
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Planejamento Orçamentário, DRE Gerencial de 79 Centros de Custo e Ratio de Colaborador por Leito
          </p>
        </div>
      </div>

      {/* Operação Profile Alert Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-400">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Perfil da Operação HSF</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Estrutural complexo: <strong className="text-teal-400">9,28 colaboradores por leito ativo</strong> (1.300 colaboradores / 140 leitos ativos) e granularidade de <strong className="text-teal-450">79 centros de custo</strong>. Foco em margem de contribuição.
            </p>
          </div>
        </div>
      </div>

      {/* Renders for Tabs */}
      {activeSubTab === "dre" && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Selecione uma Unidade de Resultado:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {Object.entries(dreDataBySector).map(([key, sData]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDreSector(key)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      selectedDreSector === key
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
                        : "bg-slate-900/30 border-slate-800 text-slate-404 hover:text-slate-250"
                    }`}
                  >
                    {sData.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Método de Atribuição:</span>
              <div className="grid grid-cols-2 gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => setDreAllocationMode("contribution")}
                  className={`py-1 text-[10px] font-bold rounded uppercase ${
                    dreAllocationMode === "contribution" ? "bg-teal-500/20 text-teal-450 border border-teal-500/10" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  M. Contribuição
                </button>
                <button
                  onClick={() => setDreAllocationMode("absorption")}
                  className={`py-1 text-[10px] font-bold rounded uppercase ${
                    dreAllocationMode === "absorption" ? "bg-teal-500/20 text-teal-450 border border-teal-500/10" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Absorção Plena
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Stats */}
            <div className="lg:col-span-4 card-gradient border border-slate-800 rounded-2xl p-4 space-y-4">
              <h4 className="text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-500" /> Detalhes Gerais da Unidade
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60 font-sans">
                  <span className="text-slate-400">Colaboradores Alocados</span>
                  <span className="font-bold text-slate-205">{dreData.colaboradoresAlocados}</span>
                </div>
                {dreData.leitosAlocados > 0 && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">Leitos Ativos Alocados</span>
                      <span className="font-bold text-slate-205">{dreData.leitosAlocados}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400 font-sans">Fração Colab. / Leito</span>
                      <span className="font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded leading-none">
                        {(dreData.colaboradoresAlocados / dreData.leitosAlocados).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-sans">Peso no Faturamento Total</span>
                  <span className="font-bold text-teal-400">{((recBruta / 8500000) * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                <p className="text-[10px] text-slate-400 italic leading-relaxed font-sans">
                  <strong>Conselho da Controladoria:</strong> Atribuição direta evita desvios arbitrários de rateio entre os 79 Centros de Custo que prejudicam a percepção de lucro setorial.
                </p>
              </div>
            </div>

            {/* Right Box: DRE Table */}
            <div className="lg:col-span-8 card-gradient border border-slate-800 rounded-2xl p-5 glow-border">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
                <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-teal-400" /> DRE Gerencial ({dreData.name})
                </h3>
                <span className="text-[10px] font-bold text-teal-450 bg-teal-500/10 px-2 py-0.5 rounded uppercase font-mono">Maio/26</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[10px] uppercase text-slate-550">
                      <th className="pb-1.5">Conta Gerencial</th>
                      <th className="pb-1.5 text-right">Realizado (R$)</th>
                      <th className="pb-1.5 text-right">% s/ ROL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    <tr className="hover:bg-slate-900/10">
                      <td className="py-2 pl-1 font-medium text-slate-300">1. Faturamento Bruto (ROB)</td>
                      <td className="py-2 text-right font-semibold text-slate-300">{recBruta.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right text-slate-550">{((recBruta / (recBruta - ded)) * 105).toFixed(1)}%</td>
                    </tr>
                    <tr className="text-slate-400 hover:bg-slate-900/10">
                      <td className="py-1.5 pl-3">(-) Glosas Faturadas e Deduções</td>
                      <td className="py-1.5 text-right text-rose-450">- {ded.toLocaleString('pt-BR')}</td>
                      <td className="py-1.5 text-right font-mono text-[10px] text-rose-500">-{((ded / (recBruta - ded)) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className="bg-slate-900/40 font-bold border-y border-slate-800 text-teal-400">
                      <td className="py-2 pl-1 text-[12px] uppercase">(=) RECEITA OPERACIONAL LÍQUIDA (ROL)</td>
                      <td className="py-2 text-right text-[12px] font-black">{recLiquida.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right">100,0%</td>
                    </tr>
                    <tr className="hover:bg-slate-900/10 text-slate-350 font-sans">
                      <td className="py-2 pl-3">• Materiais e Medicamentos Hospitalares (Mat/Med)</td>
                      <td className="py-2 text-right">- {cMatMed.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right text-slate-500">-{((cMatMed / recLiquida) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-slate-900/10 text-slate-350">
                      <td className="py-2 pl-3">• Órteses, Próteses e Insumos Especiais (OPME)</td>
                      <td className="py-2 text-right">- {cOpme.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right text-slate-500">-{((cOpme / recLiquida) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-slate-900/10 text-slate-202">
                      <td className="py-2 pl-3 font-medium text-amber-500">• Folha de Pessoal Alocado (1300 Colab. Ativos)</td>
                      <td className="py-2 text-right font-bold text-amber-500/90">- {cPessoal.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right font-medium text-amber-500/80">-{((cPessoal / recLiquida) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-slate-900/10 text-slate-350">
                      <td className="py-2 pl-3">• Honorários Médicos e Despesas Diretas Setor</td>
                      <td className="py-2 text-right">- {cGerais.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right text-slate-500">-{((cGerais / recLiquida) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className="bg-slate-950/60 font-bold border-y border-slate-800 text-slate-100">
                      <td className="py-2 pl-1 leading-normal uppercase">(=) MARGEM DE CONTRIBUIÇÃO DIRETA</td>
                      <td className="py-2 text-right text-emerald-400 font-extrabold">{margemContr.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right text-emerald-450">{margemContrPct.toFixed(1)}%</td>
                    </tr>
                    <tr className={`hover:bg-slate-900/10 ${dreAllocationMode === "contribution" ? "opacity-30 line-through" : ""}`}>
                      <td className="py-2 pl-2 text-slate-400">• Rateio Corporativo de Apoio (TI, RH, Manutenção de CCs)</td>
                      <td className="py-2 text-right text-rose-500">- {rateio.toLocaleString('pt-BR')}</td>
                      <td className="py-2 text-right">-{((rateio / recLiquida) * 100).toFixed(1)}%</td>
                    </tr>
                    <tr className={`font-bold border-t-2 ${ebitda < 0 ? "bg-rose-500/10 border-rose-500 text-rose-455" : "bg-teal-500/10 border-teal-500 text-teal-300"}`}>
                      <td className="py-2.5 pl-2 uppercase">{dreAllocationMode === "contribution" ? "(=) EBITDA OPERACIONAL" : "(=) RESULTADO COM ASSOCIAÇÃO RATEIO"}</td>
                      <td className="py-2.5 text-right font-black">{ebitda.toLocaleString('pt-BR')}</td>
                      <td className="py-2.5 text-right">{ebitdaPct.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "kpis" && (
        <div className="space-y-6 animate-fade-in font-sans">
          {/* Dashboard 4 category grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="card-gradient border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Users className="w-3.5 h-3.5 text-teal-450" /> Pessoal (1.300 Colab)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pessoal / Rec. Líquida</span>
                  <span className="font-bold text-slate-200">58,2%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full"><div className="h-full bg-rose-500 rounded-full" style={{ width: "58%" }}></div></div>
                <div className="flex justify-between text-[11px] pt-1 pt-2">
                  <span className="text-slate-450">HE s/ Folha de Pessoal</span>
                  <span className="font-bold text-rose-400">8,4%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-450">Pessoal por Leito</span>
                  <span className="font-bold text-slate-200 font-mono">9,28 colab/leito</span>
                </div>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-[11px] uppercase font-bold text-slate-350 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Eficiência (140 Leitos)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa de Ocupação Média</span>
                  <span className="font-bold text-slate-200">82,0%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full"><div className="h-full bg-teal-500 rounded-full" style={{ width: "82%" }}></div></div>
                <div className="flex justify-between text-[11px] pt-2">
                  <span className="text-slate-450 font-sans">Custo Paciente-Dia (CPD)</span>
                  <span className="font-bold text-slate-200 font-mono">R$ 2.450/dia</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-450">Custo Ociosidade / Mês</span>
                  <span className="font-bold text-amber-500 font-mono">R$ 385.000</span>
                </div>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-[11px] uppercase font-bold text-slate-350 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Layers className="w-3.5 h-3.5 text-teal-450" /> 79 Centros de Custo
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Orçado vs Realizado</span>
                  <span className="font-bold text-teal-400">94,2%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }}></div></div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-850 pt-2">
                  <span className="text-slate-450">Custos Diretos s/ Indiretos</span>
                  <span className="font-bold text-slate-200">62% / 38%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-450">Margem Direta Global</span>
                  <span className="font-bold text-teal-400">30,4%</span>
                </div>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-[11px] uppercase font-bold text-slate-350 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <PiggyBank className="w-3.5 h-3.5 text-amber-500" /> Farmácia & Materiais
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Giro de Estoque Médio</span>
                  <span className="font-bold text-amber-400">42 dias</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full"><div className="h-full bg-amber-500 rounded-full" style={{ width: "70%" }}></div></div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-850 pt-2">
                  <span className="text-slate-450">Glosas s/ Faturamento</span>
                  <span className="font-bold text-rose-500">11,4%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-450 font-sans">Desperdício Ativo</span>
                  <span className="font-bold text-teal-400 font-mono">4,1%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recharts grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-gradient border border-slate-800 rounded-2xl p-4 glow-border">
              <h4 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-400" /> Custos Diretos vs Faturamento
              </h4>
              <div className="h-64 animate-fade-in">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={operationalCostsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} formatter={(v: any) => `R$${v/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                    <Bar dataKey="Custo" fill="#b91c1c" name="Custos Diretos" />
                    <Bar dataKey="Faturamento" fill="#047857" name="Faturamento" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-2xl p-4 glow-border">
              <h4 className="text-xs uppercase font-bold text-slate-404 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-505" /> Gasto OPME por Especialidade
              </h4>
              <div className="h-64 animate-fade-in">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={opmeCostsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} formatter={(v: any) => `R$${v/1000}k`} />
                    <YAxis dataKey="center" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                    <Bar dataKey="amount" fill="#d97706" name="OPME" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "controladoria" && (
        <div className="space-y-6">
          {/* Simulator & Alerts */}
          <div className="card-gradient border border-slate-800 rounded-3xl p-6 glow-border">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-teal-400" /> Simulador de Otimização de Custos HSF
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Configure o percentual de contenção mapeada nos leitos e farmácia</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-teal-400 font-bold flex items-center gap-1">
                <span>Setor de Referência:</span>
                <select value={selectedCostCenter} onChange={(e) => setSelectedCostCenter(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                  <option value="Pronto Socorro" className="bg-slate-950">Pronto Socorro</option>
                  <option value="UTI Adulto" className="bg-slate-950">UTI Adulto</option>
                  <option value="Centro Cirúrgico" className="bg-slate-950">Centro Cirúrgico</option>
                  <option value="SADT / Exames" className="bg-slate-950">SADT / Exames</option>
                  <option value="Internações" className="bg-slate-950">Internações</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="space-y-3 lg:col-span-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-350">
                    <span>Redução de Perdas Corporativas</span>
                    <span className="text-teal-400 font-mono font-bold">{wasteReduction}%</span>
                  </div>
                  <input type="range" min="0" max="30" step="5" value={wasteReduction} onChange={(e) => setWasteReduction(Number(e.target.value))} className="w-full accent-teal-400 h-1 bg-slate-850 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-350">
                    <span>Alvo de Ocupação de Leitos Ativos</span>
                    <span className="text-teal-400 font-mono font-bold">{occupancyAdjustment}%</span>
                  </div>
                  <input type="range" min="70" max="95" step="5" value={occupancyAdjustment} onChange={(e) => setOccupancyAdjustment(Number(e.target.value))} className="w-full accent-teal-400 h-1 bg-slate-850 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-350">
                    <span>Digitalização e Auditoria Direta</span>
                    <span className="text-teal-400 font-mono font-bold">{processDigitalization}%</span>
                  </div>
                  <input type="range" min="0" max="50" step="10" value={processDigitalization} onChange={(e) => setProcessDigitalization(Number(e.target.value))} className="w-full accent-teal-400 h-1 bg-slate-850 rounded" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Meta de Retorno Gerencial</span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <p className="text-xl font-display font-black text-teal-400 font-mono">R$ {getSimulatedSavings().toLocaleString('pt-BR')}/mês</p>
                    <span className="text-[9px] uppercase tracking-wider text-teal-500">Economia Projetada</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 italic mt-2 leading-relaxed">Simulação homologada pela controladoria assistencial Victor.</div>
              </div>

            </div>
          </div>

          {/* Procedure lists and safety Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-gradient border border-slate-800 rounded-3xl p-5">
              <h3 className="text-xs uppercase font-bold text-slate-350 mb-4">Custo Médio por Alta Assistencial</h3>
              <div className="space-y-3">
                {custosProcedimentoData.map((procedimento) => {
                  const varPct = ((procedimento.Realizado - procedimento.Previsto) / procedimento.Previsto) * 100;
                  return (
                    <div key={procedimento.procedure} className="text-xs space-y-1 font-sans">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-300">{procedimento.procedure}</span>
                        <span className={varPct > 0 ? "text-rose-450 font-mono font-bold" : "text-teal-400 font-mono font-bold"}>R$ {procedimento.Realizado.toLocaleString('pt-BR')} ({varPct > 0 ? "+" : ""}{varPct.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded"><div className={`h-full rounded ${varPct > 0 ? "bg-rose-500" : "bg-teal-500"}`} style={{ width: `${Math.min((procedimento.Realizado / procedimento.Previsto) * 50, 100)}%` }}></div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-gradient border border-slate-800 rounded-3xl p-5 font-sans">
              <h3 className="text-xs uppercase font-bold text-slate-350 mb-3">Alertas Recentes da Farmácia / OPME</h3>
              <div className="space-y-2">
                {priceAlerts.map((nAlert) => (
                  <div key={nAlert.id} className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{nAlert.item}</p>
                      <p className="text-[10px] text-slate-500">{nAlert.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-300 font-mono">R$ {nAlert.newPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <span className="text-[9px] font-bold text-rose-400">+{nAlert.variance}% inflação</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-gradient border border-slate-800 rounded-3xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-sans">
              <div>
                <h3 className="text-xs uppercase font-bold text-slate-200 tracking-wider">Controle Preventivo de Gastos Assistenciais</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Dispersão física e protocolos de dose única</p>
              </div>
              <input
                type="text"
                placeholder="Filtrar por insumo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-slate-750 text-xs rounded-xl px-3 py-1.5 outline-none text-slate-250 max-w-xs font-sans"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 uppercase text-slate-550 text-[10px]">
                    <th className="pb-2">Cód</th>
                    <th className="pb-2 pl-4">Item Monitorado</th>
                    <th className="pb-2 text-right">Unitário (R$)</th>
                    <th className="pb-2 text-right">Inconsistência</th>
                    <th className="pb-2 text-center">Status Interno</th>
                    <th className="pb-2 text-right">Detalhar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/10">
                      <td className="py-2.5 font-mono text-[10px] text-slate-400">{item.id}</td>
                      <td className="py-2.5 pl-4 font-bold text-slate-300">{item.item}<p className="text-[10px] font-normal text-slate-500">{item.category} • {item.volMonthly} un/mês</p></td>
                      <td className="py-2.5 text-right font-mono font-semibold text-slate-200">R$ {item.unitCost.toLocaleString('pt-BR')}</td>
                      <td className="py-2.5 text-right text-teal-400 font-bold font-mono">{item.wasteRate}%</td>
                      <td className="py-2.5 text-center"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-teal-500/10 bg-teal-500/5 text-teal-400">{item.status}</span></td>
                      <td className="py-2.5 text-right"><button onClick={() => setSelectedItem(item)} className="p-1 rounded bg-slate-800 hover:bg-slate-705 text-slate-300"><ChevronRight className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detailed Item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{selectedItem.item}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{selectedItem.category} • Cód {selectedItem.id}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 text-xs text-sans">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider">Custo Unitário</span>
                  <span className="text-sm font-mono font-bold text-slate-200">R$ {selectedItem.unitCost.toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider">Perda Estimada</span>
                  <span className="text-sm font-bold text-teal-400 font-mono">{selectedItem.wasteRate}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 font-sans"><AlertTriangle className="w-3 h-3 text-teal-400" /> Diretriz de Correção</span>
                <p className="text-xs text-slate-400 italic">"{selectedItem.action}"</p>
              </div>

              <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850 text-xs text-slate-400 leading-relaxed font-sans">
                A aplicação de auditoria no consumo dos <strong>{selectedItem.volMonthly} consumos/mês</strong> previne um desvio estimado em <strong className="text-teal-400 text-xs font-mono">R$ {Math.round(selectedItem.unitCost * selectedItem.volMonthly * (selectedItem.wasteRate / 100)).toLocaleString('pt-BR')}</strong> mensais de desperdício evitado.
              </div>
            </div>

            <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex justify-between gap-2.5">
              {selectedItem.wasteRate > 3 && selectedItem.status !== 'Otimizado via Fracionamento' ? (
                <button
                  onClick={() => handleApplyOptimization(selectedItem.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-450 text-slate-950 flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" /> Aplicar Fracionamento HSF
                </button>
              ) : (
                <div className="text-[11px] text-teal-400 flex items-center gap-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Metas de governança alcançadas</div>
              )}
              <button onClick={() => setSelectedItem(null)} className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-850 hover:bg-slate-800 text-slate-350 transition-colors font-sans">Fechar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

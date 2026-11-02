/**
 * EC Data Service — Importação de Excel
 * Parseia arquivos .xlsx para o formato WorkOrder
 */

import * as XLSX from 'xlsx';
import { WorkOrder, WorkOrderPriority, WorkOrderType, RawExcelData, Equipment, EquipmentStatus, LiquidGasEntry } from '../types';

const COLUMN_ALIASES: Record<keyof WorkOrder | 'equipmentTags', string[]> = {
  id: ['id', 'os', 'nº', 'numero', 'num', 'codigo', 'ordem', 'protocolo'],
  equipmentId: ['tag', 'patrimonio', 'ativo', 'inventario', 'cod. equip', 'id equip', 'cliente'],
  equipmentName: ['equipamento', 'nome', 'modelo', 'descricao equip', 'ativo nome', 'cliente', 'aparelho'],
  type: ['tipo', 'classificacao', 'classe', 'categoria', 'natureza', 'serviço', 'servico'],
  priority: ['prioridade', 'criticidade', 'urgencia', 'importancia', 'nivel'],
  status: ['status', 'estado', 'situacao', 'situação', 'fase', 'andamento'],
  createdAt: ['data', 'dt', 'abertura', 'criacao', 'solicitacao', 'emissao', 'agendamento'],
  technician: ['tecnico', 'técnico', 'responsavel', 'executor', 'funcionario', 'colaborador', 'atendente'],
  description: ['descricao', 'descrição', 'problema', 'defeito', 'solicitacao', 'falha', 'motivo', 'obs'],
  equipmentTags: [],
};

const EQ_COLUMN_ALIASES: Record<keyof Equipment, string[]> = {
  id: ['id', 'patrimonio original', 'sys id'],
  name: ['equipamento', 'nome', 'descrição', 'descricao', 'ativo', 'aparelho', 'produto'],
  tag: ['tag', 'patrimônio', 'patrimonio', 'tombamento', 'código', 'codigo'],
  sector: ['setor', 'local', 'departamento', 'centro de custo', 'cc', 'unidade', 'sala'],
  status: ['status', 'estado', 'condição', 'condicao', 'situação', 'situacao'],
  lastMaintenance: ['última manutenção', 'ultima manutencao', 'data ultima', 'dt ult'],
  nextMaintenance: ['próxima manutenção', 'proxima manutencao', 'vencimento', 'dt prox', 'validade'],
  model: ['modelo', 'mod', 'versão', 'versao'],
  manufacturer: ['fabricante', 'marca', 'fornecedor', 'empresa']
};

const GAS_COLUMN_ALIASES: Record<keyof LiquidGasEntry, string[]> = {
  id: ['id', 'código'],
  date: ['meses', 'mes', 'mês', 'data recebimento', 'dt recebimento', 'data', 'dt'],
  orderDate: ['data pedido', 'dt pedido', 'emissão pedido'],
  orderNumber: ['número pedido', 'nº pedido', 'pedido'],
  invoiceDate: ['data nota', 'dt nf', 'emissão nf'],
  invoiceNumber: ['número nota', 'nº nota', 'nf', 'nota fiscal', 'abastecimento', 'nº'],
  volume: ['volume', 'qtd', 'quantidade', 'm3', 'm³'],
  pricePerUnit: ['valor unitário', 'valor unitario', 'preço unitário', 'preco m3', 'valor unit', 'vlr unit'],
  totalValue: ['valor total', 'total nf', 'total'],
  boletoDueDate: ['vencimento boleto', 'vencimento', 'dt venc'],
  paymentStatus: ['status pag', 'pagamento', 'situação pag']
};

const findValueByHeuristic = (row: any, field: keyof typeof COLUMN_ALIASES): any => {
  const rowKeys = Object.keys(row);
  const aliases = COLUMN_ALIASES[field];
  for (const alias of aliases) {
    const exact = rowKeys.find((k) => k.toLowerCase().trim() === alias.toLowerCase());
    if (exact) return row[exact];
  }
  for (const alias of aliases) {
    const partial = rowKeys.find((k) => k.toLowerCase().includes(alias.toLowerCase()));
    if (partial) return row[partial];
  }
  return undefined;
};

const findValueByHeuristicEq = (row: any, field: keyof typeof EQ_COLUMN_ALIASES): any => {
  const rowKeys = Object.keys(row);
  const aliases = EQ_COLUMN_ALIASES[field];
  for (const alias of aliases) {
    const exact = rowKeys.find((k) => k.toLowerCase().trim() === alias.toLowerCase());
    if (exact) return row[exact];
  }
  for (const alias of aliases) {
    const partial = rowKeys.find((k) => k.toLowerCase().includes(alias.toLowerCase()));
    if (partial) return row[partial];
  }
  return undefined;
};

const findValueByHeuristicGas = (row: any, field: keyof typeof GAS_COLUMN_ALIASES): any => {
  const rowKeys = Object.keys(row);
  const aliases = GAS_COLUMN_ALIASES[field];
  for (const alias of aliases) {
    const exact = rowKeys.find((k) => k.toLowerCase().trim() === alias.toLowerCase());
    if (exact) return row[exact];
  }
  for (const alias of aliases) {
    const partial = rowKeys.find((k) => k.toLowerCase().includes(alias.toLowerCase()));
    if (partial) return row[partial];
  }
  return undefined;
};

const getPriority = (val: any): WorkOrderPriority => {
  const v = val?.toString().toLowerCase() || '';
  if (v.includes('crític') || v.includes('critic') || v.includes('urgent')) return WorkOrderPriority.CRITICAL;
  if (v.includes('alta') || v.includes('elevad')) return WorkOrderPriority.HIGH;
  if (v.includes('baixa') || v.includes('leve')) return WorkOrderPriority.LOW;
  return WorkOrderPriority.MEDIUM;
};

const getType = (val: any): WorkOrderType => {
  const v = val?.toString().toLowerCase() || '';
  if (v.includes('prevent')) return WorkOrderType.PREVENTIVE;
  if (v.includes('calibra')) return WorkOrderType.CALIBRATION;
  if (v.includes('instala')) return WorkOrderType.INSTALLATION;
  return WorkOrderType.CORRECTIVE;
};

const getStatus = (val: any): WorkOrder['status'] => {
  const v = val?.toString().toLowerCase() || '';
  if (v.includes('conclu') || v.includes('fechad') || v.includes('encerrad')) return 'Concluído';
  if (v.includes('anda') || v.includes('execu')) return 'Em Andamento';
  if (v.includes('peça') || v.includes('aguard') || v.includes('espera')) return 'Aguardando Peça';
  return 'Aberto';
};

const parseDate = (val: any): string => {
  if (!val) return new Date().toISOString();
  if (typeof val === 'number') {
    const date = new Date((val - (25567 + 2)) * 86400 * 1000);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }
  const date = new Date(val);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const normalizeWorkOrder = (row: any): WorkOrder => ({
  id: findValueByHeuristic(row, 'id') || `IMP-${Math.floor(Math.random() * 10000)}`,
  equipmentId: findValueByHeuristic(row, 'equipmentId') || 'N/A',
  equipmentName: findValueByHeuristic(row, 'equipmentName') || 'Equipamento Desconhecido',
  type: getType(findValueByHeuristic(row, 'type')),
  priority: getPriority(findValueByHeuristic(row, 'priority')),
  status: getStatus(findValueByHeuristic(row, 'status')),
  createdAt: parseDate(findValueByHeuristic(row, 'createdAt')),
  technician: findValueByHeuristic(row, 'technician'),
  description: findValueByHeuristic(row, 'description') || 'Importado via Excel',
});

const getEquipmentStatus = (val: any): EquipmentStatus => {
  const v = val?.toString().toLowerCase() || '';
  if (v.includes('manuten') || v.includes('quebrad') || v.includes('defeito')) return EquipmentStatus.MAINTENANCE;
  if (v.includes('calibr') || v.includes('aferi')) return EquipmentStatus.CALIBRATION;
  if (v.includes('inop') || v.includes('baixad') || v.includes('desativ') || v.includes('sucata')) return EquipmentStatus.DOWN;
  return EquipmentStatus.OPERATIONAL;
};

const normalizeEquipment = (row: any): Equipment => ({
  id: findValueByHeuristicEq(row, 'id') || `IMP-EQ-${Math.floor(Math.random() * 10000)}`,
  name: findValueByHeuristicEq(row, 'name') || 'Equipamento Importado',
  tag: findValueByHeuristicEq(row, 'tag') || `TAG-${Math.floor(Math.random() * 10000)}`,
  sector: findValueByHeuristicEq(row, 'sector') || 'Geral',
  status: getEquipmentStatus(findValueByHeuristicEq(row, 'status')),
  lastMaintenance: parseDate(findValueByHeuristicEq(row, 'lastMaintenance')),
  nextMaintenance: parseDate(findValueByHeuristicEq(row, 'nextMaintenance')),
  model: findValueByHeuristicEq(row, 'model') || '',
  manufacturer: findValueByHeuristicEq(row, 'manufacturer') || ''
});

const parseNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const clean = val.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  }
  return 0;
};

const getPaymentStatus = (val: any): 'OK' | 'NOK' | 'Pending' => {
  const v = val?.toString().toLowerCase() || '';
  if (v.includes('pago') || v.includes('ok') || v.includes('quitad')) return 'OK';
  if (v.includes('nok') || v.includes('atras') || v.includes('pendent')) return 'NOK';
  return 'Pending';
};

const normalizeLiquidGas = (row: any): LiquidGasEntry => {
  const vol = parseNumber(findValueByHeuristicGas(row, 'volume'));
  const unitPrice = parseNumber(findValueByHeuristicGas(row, 'pricePerUnit'));
  const total = parseNumber(findValueByHeuristicGas(row, 'totalValue')) || (vol * unitPrice);

  return {
    id: findValueByHeuristicGas(row, 'id') || `IMP-GAS-${Math.floor(Math.random() * 10000)}`,
    date: parseDate(findValueByHeuristicGas(row, 'date')),
    orderDate: parseDate(findValueByHeuristicGas(row, 'orderDate')),
    orderNumber: findValueByHeuristicGas(row, 'orderNumber') || '',
    invoiceDate: parseDate(findValueByHeuristicGas(row, 'invoiceDate')),
    invoiceNumber: findValueByHeuristicGas(row, 'invoiceNumber') || 'S/N',
    volume: vol,
    pricePerUnit: unitPrice,
    totalValue: total,
    boletoDueDate: parseDate(findValueByHeuristicGas(row, 'boletoDueDate')),
    paymentStatus: getPaymentStatus(findValueByHeuristicGas(row, 'paymentStatus'))
  };
};

const readWorkbook = (file: File): Promise<XLSX.WorkBook> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(XLSX.read(e.target?.result, { type: 'binary' }));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });

export const getExcelSheets = async (file: File): Promise<string[]> => {
  const wb = await readWorkbook(file);
  return wb.SheetNames;
};

const scanForHeaderRow = (ws: XLSX.WorkSheet): number => {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');
  const maxRows = Math.min(range.e.r, 20);
  const EXPECTED = ['id', 'equipamento', 'nome', 'tipo', 'prioridade', 'status', 'técnico', 'data', 'descrição'];
  let bestRow = 0;
  let maxMatches = 0;
  for (let r = range.s.r; r <= maxRows; r++) {
    let matches = 0;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell?.v && EXPECTED.some((col) => String(cell.v).toLowerCase().includes(col))) matches++;
    }
    if (matches > maxMatches) { maxMatches = matches; bestRow = r; }
  }
  return bestRow;
};

export const parseExcelSheet = async (file: File, sheetName: string): Promise<RawExcelData> => {
  const wb = await readWorkbook(file);
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Aba "${sheetName}" não encontrada.`);
  const headerRowIndex = scanForHeaderRow(ws);
  const jsonData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, defval: '' });
  const headerData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, header: 1 });
  const columns = (headerData[0] as string[]) || [];
  return { columns, rows: jsonData, normalized: jsonData.map(normalizeWorkOrder) };
};

export const parseExcelFile = async (file: File): Promise<RawExcelData> => {
  const sheets = await getExcelSheets(file);
  if (!sheets.length) throw new Error('O arquivo Excel não possui abas.');
  return parseExcelSheet(file, sheets[0]);
};

// Equipments Parser
const scanForEqHeaderRow = (ws: XLSX.WorkSheet): number => {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');
  const maxRows = Math.min(range.e.r, 20);
  const EXPECTED = ['patrimônio', 'patrimonio', 'equipamento', 'marca', 'modelo', 'setor', 'local', 'tombamento'];
  let bestRow = 0;
  let maxMatches = 0;
  for (let r = range.s.r; r <= maxRows; r++) {
    let matches = 0;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell?.v && EXPECTED.some((col) => String(cell.v).toLowerCase().includes(col))) matches++;
    }
    if (matches > maxMatches) { maxMatches = matches; bestRow = r; }
  }
  return bestRow;
};

export interface RawEqExcelData {
  columns: string[];
  rows: any[];
  normalized: Equipment[];
}

export const parseEquipmentExcelSheet = async (file: File, sheetName: string): Promise<RawEqExcelData> => {
  const wb = await readWorkbook(file);
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Aba "${sheetName}" não encontrada.`);
  const headerRowIndex = scanForEqHeaderRow(ws);
  const jsonData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, defval: '' });
  const headerData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, header: 1 });
  const columns = (headerData[0] as string[]) || [];
  return { columns, rows: jsonData, normalized: jsonData.map(normalizeEquipment) };
};

export const parseEquipmentExcelFile = async (file: File): Promise<RawEqExcelData> => {
  const sheets = await getExcelSheets(file);
  if (!sheets.length) throw new Error('O arquivo Excel não possui abas.');
  return parseEquipmentExcelSheet(file, sheets[0]);
};

// Liquid Gas Parser
const scanForGasHeaderRow = (ws: XLSX.WorkSheet): number => {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z100');
  const maxRows = Math.min(range.e.r, 20);
  const EXPECTED = ['nota fiscal', 'nf', 'volume', 'm3', 'm³', 'valor', 'total', 'meses', 'abastecimento'];
  let bestRow = 0;
  let maxMatches = 0;
  for (let r = range.s.r; r <= maxRows; r++) {
    let matches = 0;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell?.v && EXPECTED.some((col) => String(cell.v).toLowerCase().includes(col))) matches++;
    }
    if (matches > maxMatches) { maxMatches = matches; bestRow = r; }
  }
  return bestRow;
};

export interface RawGasExcelData {
  columns: string[];
  rows: any[];
  normalized: LiquidGasEntry[];
}

export const parseLiquidGasExcelSheet = async (file: File, sheetName: string): Promise<RawGasExcelData> => {
  const wb = await readWorkbook(file);
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Aba "${sheetName}" não encontrada.`);
  const headerRowIndex = scanForGasHeaderRow(ws);
  const jsonData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, defval: '' });
  const headerData = XLSX.utils.sheet_to_json(ws, { range: headerRowIndex, header: 1 });
  const columns = (headerData[0] as string[]) || [];
  return { columns, rows: jsonData, normalized: jsonData.map(normalizeLiquidGas) };
};

export const parseLiquidGasExcelFile = async (file: File): Promise<RawGasExcelData[]> => {
  const sheets = await getExcelSheets(file);
  if (!sheets.length) throw new Error('O arquivo Excel não possui abas.');
  
  // Modificado para retornar dados de todas as planilhas selecionadas, não apenas a primeira
  // Retorna os nomes das abas caso a UI precise perguntar.
  // Neste caso, a UI chama getExcelSheets e depois parseLiquidGasExcelSheet para cada uma.
  throw new Error("Use parseLiquidGasExcelSheet para importar abas específicas.");
};

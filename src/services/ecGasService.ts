/**
 * EC Gas Service
 * Serviço de Gestão de Gases — Engenharia Clínica
 * Usa Firebase do gestaohospitalar com coleções prefixadas `ec_`
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LiquidGasEntry, CylinderDelivery } from '../types';

export interface GasDashboardData {
  monthlyCosts: { month: string; liquido: number; cilindros: number }[];
  costDistribution: { name: string; value: number }[];
}

const LIQUID_COLLECTION = 'ec_gas_liquid_entries';
const CYLINDER_COLLECTION = 'ec_gas_cylinder_deliveries';

const safeDate = (dateStr?: string): Timestamp | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
};

const tsToStr = (val: any): string | undefined =>
  val?.toDate?.()?.toISOString().split('T')[0] ?? val ?? undefined;

export const GasService = {
  // ---------- CLEAR ----------
  clearLiquidEntries: async (): Promise<void> => {
    const snapshot = await getDocs(query(collection(db, LIQUID_COLLECTION)));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
  },

  clearCylinderDeliveries: async (): Promise<void> => {
    const snapshot = await getDocs(query(collection(db, CYLINDER_COLLECTION)));
    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
  },

  // ---------- LIQUID OXYGEN ----------
  getLiquidEntries: async (): Promise<LiquidGasEntry[]> => {
    try {
      const q = query(collection(db, LIQUID_COLLECTION), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          date: tsToStr(data.date) || data.date,
          boletoDueDate: tsToStr(data.boletoDueDate),
          orderDate: tsToStr(data.orderDate),
          invoiceDate: tsToStr(data.invoiceDate),
        } as LiquidGasEntry;
      });
    } catch (e) {
      console.error('Error fetching liquid entries:', e);
      return [];
    }
  },

  addLiquidEntry: async (entry: Omit<LiquidGasEntry, 'id' | 'totalValue'>): Promise<LiquidGasEntry> => {
    const totalValue = entry.volume * entry.pricePerUnit;
    const dateTs = safeDate(entry.date);
    if (!dateTs) throw new Error(`Data inválida: ${entry.date}`);

    const payload: any = {
      volume: entry.volume,
      pricePerUnit: entry.pricePerUnit,
      totalValue,
      invoiceNumber: entry.invoiceNumber,
      paymentStatus: entry.paymentStatus,
      date: dateTs,
      createdAt: Timestamp.now(),
    };
    if (entry.orderNumber) payload.orderNumber = entry.orderNumber;
    const od = safeDate(entry.orderDate); if (od) payload.orderDate = od;
    const id_ = safeDate(entry.invoiceDate); if (id_) payload.invoiceDate = id_;
    const bd = safeDate(entry.boletoDueDate); if (bd) payload.boletoDueDate = bd;

    const docRef = await addDoc(collection(db, LIQUID_COLLECTION), payload);
    return { id: docRef.id, ...entry, totalValue };
  },

  updateLiquidEntry: async (id: string, data: Partial<LiquidGasEntry>): Promise<void> => {
    const payload: any = { ...data };
    if (payload.date) payload.date = Timestamp.fromDate(new Date(payload.date));
    if (payload.boletoDueDate) payload.boletoDueDate = Timestamp.fromDate(new Date(payload.boletoDueDate));
    if (payload.orderDate) payload.orderDate = Timestamp.fromDate(new Date(payload.orderDate));
    if (payload.invoiceDate) payload.invoiceDate = Timestamp.fromDate(new Date(payload.invoiceDate));
    if (payload.volume !== undefined && payload.pricePerUnit !== undefined) {
      payload.totalValue = payload.volume * payload.pricePerUnit;
    }
    delete payload.id;
    await updateDoc(doc(db, LIQUID_COLLECTION, id), payload);
  },

  // ---------- CYLINDERS ----------
  getCylinderDeliveries: async (): Promise<CylinderDelivery[]> => {
    try {
      const q = query(collection(db, CYLINDER_COLLECTION), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          date: tsToStr(data.date) || data.date,
          orderDate: tsToStr(data.orderDate),
          invoiceDate: tsToStr(data.invoiceDate),
        } as CylinderDelivery;
      });
    } catch (e) {
      console.error('Error fetching cylinder deliveries:', e);
      return [];
    }
  },

  addCylinderDelivery: async (delivery: Omit<CylinderDelivery, 'id' | 'totalValue'>): Promise<CylinderDelivery> => {
    const totalValue = delivery.items.reduce((s, i) => s + i.quantity * i.priceUnit, 0);
    const dateTs = safeDate(delivery.date);
    if (!dateTs) throw new Error(`Data inválida: ${delivery.date}`);

    const payload: any = {
      invoiceNumber: delivery.invoiceNumber,
      supplier: delivery.supplier,
      items: delivery.items,
      totalValue,
      date: dateTs,
      createdAt: Timestamp.now(),
    };
    if (delivery.orderNumber) payload.orderNumber = delivery.orderNumber;
    const od = safeDate(delivery.orderDate); if (od) payload.orderDate = od;
    const id_ = safeDate(delivery.invoiceDate); if (id_) payload.invoiceDate = id_;

    const docRef = await addDoc(collection(db, CYLINDER_COLLECTION), payload);
    return { id: docRef.id, ...delivery, totalValue };
  },

  updateCylinderDelivery: async (id: string, data: Partial<CylinderDelivery>): Promise<void> => {
    const payload: any = { ...data };
    if (payload.date) payload.date = Timestamp.fromDate(new Date(payload.date));
    if (payload.orderDate) payload.orderDate = Timestamp.fromDate(new Date(payload.orderDate));
    if (payload.invoiceDate) payload.invoiceDate = Timestamp.fromDate(new Date(payload.invoiceDate));
    if (payload.items) {
      payload.totalValue = payload.items.reduce((s: number, i: any) => s + i.quantity * i.priceUnit, 0);
    }
    delete payload.id;
    await updateDoc(doc(db, CYLINDER_COLLECTION, id), payload);
  },

  // ---------- DASHBOARD METRICS ----------
  getDashboardMetrics: async (): Promise<GasDashboardData> => {
    try {
      const [liquidEntries, cylinderDeliveries] = await Promise.all([
        GasService.getLiquidEntries(),
        GasService.getCylinderDeliveries(),
      ]);

      const liquidTotal = liquidEntries.reduce((s, e) => s + e.totalValue, 0);
      let cylinderO2Total = 0;
      let otherGasesTotal = 0;

      cylinderDeliveries.forEach((d) => {
        d.items.forEach((item) => {
          if (item.gasType.toString().includes('Oxigênio')) {
            cylinderO2Total += item.total;
          } else {
            otherGasesTotal += item.total;
          }
        });
      });

      const monthsMap = new Map<string, { liquido: number; cilindros: number }>();
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const getKey = (d: string) => {
        const dt = new Date(d);
        return `${dt.getFullYear()}-${dt.getMonth()}`;
      };

      liquidEntries.forEach((e) => {
        const k = getKey(e.date);
        const cur = monthsMap.get(k) || { liquido: 0, cilindros: 0 };
        cur.liquido += e.totalValue;
        monthsMap.set(k, cur);
      });
      cylinderDeliveries.forEach((d) => {
        const k = getKey(d.date);
        const cur = monthsMap.get(k) || { liquido: 0, cilindros: 0 };
        cur.cilindros += d.totalValue;
        monthsMap.set(k, cur);
      });

      const monthlyCosts = Array.from(monthsMap.entries())
        .map(([k, v]) => {
          const [year, mi] = k.split('-');
          return { month: monthNames[parseInt(mi)], liquido: v.liquido, cilindros: v.cilindros, _y: parseInt(year), _m: parseInt(mi) };
        })
        .sort((a, b) => a._y !== b._y ? a._y - b._y : a._m - b._m)
        .map(({ month, liquido, cilindros }) => ({ month, liquido, cilindros }));

      return {
        monthlyCosts,
        costDistribution: [
          { name: 'Oxigênio Líquido', value: liquidTotal },
          { name: 'Cilindros (O₂)', value: cylinderO2Total },
          { name: 'Outros Gases', value: otherGasesTotal },
        ],
      };
    } catch (e) {
      console.error('Error calculating metrics:', e);
      return { monthlyCosts: [], costDistribution: [] };
    }
  },
};

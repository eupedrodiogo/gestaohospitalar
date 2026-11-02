/**
 * EC Work Order Service
 * Serviço de Ordens de Serviço — Engenharia Clínica
 * Usa o Firebase do gestaohospitalar com coleções prefixadas `ec_`
 */

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WorkOrder, WorkOrderType, WorkOrderPriority } from '../types';

const COLLECTION_NAME = 'ec_work_orders';

/** Mock seed — usado apenas se a coleção estiver vazia na primeira execução */
const SEED_ORDERS: Omit<WorkOrder, 'id'>[] = [
  {
    equipmentId: 'EQ-001',
    equipmentName: 'Respirador Hamilton G5',
    type: WorkOrderType.CORRECTIVE,
    priority: WorkOrderPriority.CRITICAL,
    status: 'Em Andamento',
    createdAt: new Date().toISOString(),
    technician: 'Carlos Silva',
    description: 'Falha no sensor de fluxo expiratório.',
  },
  {
    equipmentId: 'EQ-045',
    equipmentName: 'Monitor Multiparamétrico Philips',
    type: WorkOrderType.PREVENTIVE,
    priority: WorkOrderPriority.MEDIUM,
    status: 'Aberto',
    createdAt: new Date().toISOString(),
    description: 'Manutenção preventiva programada — Troca de bateria.',
  },
];

export const subscribeToWorkOrders = (callback: (orders: WorkOrder[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        equipmentName: data.equipmentName || data.equipment || 'Equipamento Geral',
      } as WorkOrder;
    });
    callback(orders);
  });
};

export const addWorkOrder = async (order: Omit<WorkOrder, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...order,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateWorkOrderStatus = async (id: string, status: string): Promise<void> => {
  const orderRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(orderRef, { status });
};

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  const q = query(collection(db, COLLECTION_NAME));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const batch = writeBatch(db);
    SEED_ORDERS.forEach((order) => {
      const newDocRef = doc(collection(db, COLLECTION_NAME));
      batch.set(newDocRef, { ...order, createdAt: new Date().toISOString() });
    });
    await batch.commit();
  }
};

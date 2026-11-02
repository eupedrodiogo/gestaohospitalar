/**
 * EC Inventory Service
 * Serviço de Gestão de Inventário (Equipamentos) — Engenharia Clínica
 */

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Equipment, EquipmentStatus } from '../types';

const COLLECTION_NAME = 'ec_equipment_inventory';

const SEED_EQUIPMENT: Omit<Equipment, 'id'>[] = [
  {
    name: 'Respirador Pulmonar',
    tag: 'EQ-001',
    sector: 'UTI Adulto',
    status: EquipmentStatus.OPERATIONAL,
    lastMaintenance: '2026-05-10',
    nextMaintenance: '2026-11-10',
    model: 'Hamilton G5',
    manufacturer: 'Hamilton Medical'
  },
  {
    name: 'Monitor Multiparamétrico',
    tag: 'EQ-045',
    sector: 'Pronto Socorro',
    status: EquipmentStatus.MAINTENANCE,
    lastMaintenance: '2026-06-01',
    nextMaintenance: '2027-06-01',
    model: 'IntelliVue MX450',
    manufacturer: 'Philips'
  },
  {
    name: 'Bomba de Infusão',
    tag: 'EQ-102',
    sector: 'Centro Cirúrgico',
    status: EquipmentStatus.CALIBRATION,
    lastMaintenance: '2026-06-15',
    nextMaintenance: '2026-12-15',
    model: 'Infusomat Space',
    manufacturer: 'B. Braun'
  }
];

export const subscribeToInventory = (callback: (equipment: Equipment[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
      } as Equipment;
    });
    callback(items);
  });
};

export const addEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), equipment);
  return docRef.id;
};

export const updateEquipment = async (id: string, equipment: Partial<Equipment>): Promise<void> => {
  const equipmentRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(equipmentRef, equipment);
};

export const deleteEquipment = async (id: string): Promise<void> => {
  const equipmentRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(equipmentRef);
};

export const seedInventoryIfEmpty = async (): Promise<void> => {
  const q = query(collection(db, COLLECTION_NAME));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const batch = writeBatch(db);
    SEED_EQUIPMENT.forEach((eq) => {
      const newDocRef = doc(collection(db, COLLECTION_NAME));
      batch.set(newDocRef, eq);
    });
    await batch.commit();
  }
};

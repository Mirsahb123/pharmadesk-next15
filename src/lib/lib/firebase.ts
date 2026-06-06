import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "dummy",
  authDomain: "dummy",
  projectId: "dummy",
  storageBucket: "dummy",
  messagingSenderId: "dummy",
  appId: "dummy"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Medicine type
export type Medicine = {
  id?: string;
  name: string;
  type: string;
  price: number;
  packetQty: number;
  tabletsPerPacket: number;
  qty: number;
  expiry: string;
  qrCode: string;
  cost_price: number;
}

// 1. Saari medicines lana
export const getInventory = async (): Promise<Medicine[]> => {
  const querySnapshot = await getDocs(collection(db, "inventory"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medicine));
}

// 2. Nayi medicine add karna
export const addMedicine = async (med: Omit<Medicine, 'id'>): Promise<Medicine> => {
  const docRef = await addDoc(collection(db, "inventory"), med);
  return { id: docRef.id, ...med };
}

// 3. Medicine update karna
export const updateMedicine = async (id: string, data: Partial<Medicine>) => {
  await updateDoc(doc(db, "inventory", id), data);
}

// 4. Medicine delete karna
export const deleteMedicine = async (id: string) => {
  await deleteDoc(doc(db, "inventory", id));
}
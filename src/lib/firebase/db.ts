import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";
import {
  MenuItem,
  Order,
  DeliveryZone,
  Notification,
  Deal,
  MenuChangeLog,
  ItemReview,
  User,
} from "@/types";

// ========== MENU ITEMS ==========
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const menuRef = collection(db, "menuItems");
  const snapshot = await getDocs(menuRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const getMenuItem = async (id: string): Promise<MenuItem | null> => {
  const docRef = doc(db, "menuItems", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as MenuItem) : null;
};

export const addMenuItem = async (item: Omit<MenuItem, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "menuItems"), {
    ...item,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  const docRef = doc(db, "menuItems", id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "menuItems", id));
};

// ========== ORDERS ==========
export const createOrder = async (order: Omit<Order, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getOrder = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, "orders", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Order) : null;
};

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("customerId", "==", customerId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  updatedBy: string,
  notes?: string
): Promise<void> => {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) throw new Error("Order not found");

  const order = orderSnap.data() as Order;
  const statusHistory = [
    ...(order.statusHistory || []),
    {
      status,
      timestamp: new Date(),
      updatedBy,
      notes,
    },
  ];

  await updateDoc(orderRef, {
    status,
    statusHistory,
    updatedAt: Timestamp.now(),
  });
};

export const assignDeliveryBoy = async (
  orderId: string,
  deliveryBoyId: string,
  deliveryBoyName: string
): Promise<void> => {
  await updateDoc(doc(db, "orders", orderId), {
    deliveryBoyId,
    deliveryBoyName,
    updatedAt: Timestamp.now(),
  });
};

// ========== DELIVERY ZONES ==========
export const getDeliveryZones = async (): Promise<DeliveryZone[]> => {
  const zonesRef = collection(db, "deliveryZones");
  const snapshot = await getDocs(zonesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DeliveryZone));
};

export const getDeliveryChargesByArea = async (area: string): Promise<number> => {
  const zones = await getDeliveryZones();
  const zone = zones.find(
    (z) => z.isActive && z.areas.some((a) => a.toLowerCase() === area.toLowerCase())
  );
  return zone?.charges || 0;
};

export const addDeliveryZone = async (zone: Omit<DeliveryZone, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "deliveryZones"), zone);
  return docRef.id;
};

export const updateDeliveryZone = async (
  id: string,
  updates: Partial<DeliveryZone>
): Promise<void> => {
  await updateDoc(doc(db, "deliveryZones", id), updates);
};

// ========== NOTIFICATIONS ==========
export const createNotification = async (
  notification: Omit<Notification, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "notifications"), {
    ...notification,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const notifRef = collection(db, "notifications");
  const q = query(
    notifRef,
    where("targetAudience", "in", ["all", "registered"]),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, "notifications", notificationId), { isRead: true });
};

// ========== DEALS ==========
export const getActiveDeals = async (): Promise<Deal[]> => {
  const dealsRef = collection(db, "deals");
  const now = Timestamp.now();
  const q = query(dealsRef, where("isActive", "==", true), where("endDate", ">", now));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Deal));
};

export const createDeal = async (deal: Omit<Deal, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "deals"), {
    ...deal,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// ========== REVIEWS ==========
export const addItemReview = async (review: Omit<ItemReview, "createdAt">): Promise<string> => {
  const docRef = await addDoc(collection(db, "reviews"), {
    ...review,
    createdAt: Timestamp.now(),
  });

  // Update menu item average rating
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("menuItemId", "==", review.menuItemId));
  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map((doc) => doc.data() as ItemReview);

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await updateDoc(doc(db, "menuItems", review.menuItemId), {
    averageRating: avgRating,
  });

  return docRef.id;
};

export const getItemReviews = async (menuItemId: string): Promise<ItemReview[]> => {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("menuItemId", "==", menuItemId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ItemReview));
};

// ========== MENU CHANGE LOGS ==========
export const logMenuChange = async (log: Omit<MenuChangeLog, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "menuChangeLogs"), {
    ...log,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
};

export const getMenuChangeLogs = async (limit = 100): Promise<MenuChangeLog[]> => {
  const logsRef = collection(db, "menuChangeLogs");
  const q = query(logsRef, orderBy("timestamp", "desc"), limit(limit));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MenuChangeLog));
};

// ========== REAL-TIME LISTENERS ==========
export const subscribeToOrders = (
  callback: (orders: Order[]) => void,
  filterFn?: (query: any) => any
) => {
  const ordersRef = collection(db, "orders");
  const q = filterFn
    ? filterFn(query(ordersRef, orderBy("createdAt", "desc")))
    : query(ordersRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
    callback(orders);
  });
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const notifRef = collection(db, "notifications");
  const q = query(
    notifRef,
    where("targetAudience", "in", ["all", "registered"]),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
    callback(notifications);
  });
};

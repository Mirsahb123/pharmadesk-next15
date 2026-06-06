// User Types
export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: "customer" | "admin" | "delivery";
  addresses?: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Office"
  fullAddress: string;
  area: string; // for delivery zone matching
  locationLink?: string; // Google Maps link
  isDefault: boolean;
}

// Guest User (session-based)
export interface GuestUser {
  name: string;
  phoneNumber: string;
  address: string;
  area: string;
  locationLink?: string;
}

// Menu Item Types
export interface WeightOption {
  weight: string; // e.g., "250gm", "500gm", "1kg"
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  images?: string[];
  temp?: "hot" | "cold";
  weightOptions: WeightOption[]; // multiple weight/price options
  discount?: Discount;
  isAvailable: boolean;
  ratings: Rating[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discount {
  type: "percentage" | "fixed";
  value: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

// Cart Types
export interface CartItem {
  menuItem: MenuItem;
  selectedWeight: WeightOption;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryCharges: number;
  discount: number;
  total: number;
}

// Order Types
export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  category: string;
  weight: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  specialInstructions?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "DRB-001234"

  // Customer Info
  customerId?: string; // null for guest orders
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  area: string;
  locationLink?: string;

  // Order Details
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  discount: number;
  total: number;

  // Payment
  paymentMethod: "cod" | "jazzcash" | "easypaisa";
  paymentStatus: "pending" | "paid" | "failed";
  transactionId?: string;

  // Status & Tracking
  status: OrderStatus;
  statusHistory: StatusUpdate[];

  // Delivery
  deliveryBoyId?: string;
  deliveryBoyName?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  updatedBy: string; // uid of admin/delivery boy
  notes?: string;
}

// Review Types
export interface Rating {
  userId?: string; // null for guest reviews
  userName: string;
  rating: number; // 1-5
  comment?: string;
  orderId: string;
  createdAt: Date;
}

export interface ItemReview {
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  rating: number;
  comment?: string;
  userName: string;
  createdAt: Date;
}

// Delivery Zone Types
export interface DeliveryZone {
  id: string;
  name: string; // e.g., "Gulberg", "DHA Phase 5"
  areas: string[]; // list of areas in this zone
  charges: number;
  isActive: boolean;
  estimatedTime: number; // in minutes
}

// Notification Types
export type NotificationType =
  | "new_item"
  | "price_change"
  | "discount"
  | "deal"
  | "order_status";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  imageUrl?: string;
  relatedItemId?: string; // menu item id if applicable
  relatedOrderId?: string; // order id if applicable
  targetAudience: "all" | "registered" | "specific";
  targetUserIds?: string[]; // if specific users
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// Deal Types
export interface Deal {
  id: string;
  title: string;
  description: string;
  discount: Discount;
  applicableItems: string[]; // menu item ids
  applicableCategories?: string[];
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

// Menu Change Log (for admin tracking)
export interface MenuChangeLog {
  id: string;
  action: "add" | "edit" | "delete" | "discount" | "price_change";
  itemId: string;
  itemName: string;
  changedBy: string; // admin uid
  changes: Record<string, any>; // what changed
  timestamp: Date;
}

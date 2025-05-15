export type OrderType = "dine-in" | "takeaway" | "delivery";
export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customerName: string;
  timestamp: string; // ISO string
  tableNumber?: string; // For dine-in
  deliveryAddress?: string; // For delivery
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  ingredients: string[]; // Simplified for now
  dataAiHint?: string;
}

export interface SalesData {
  month: string;
  sales: number;
}

export interface PeakHoursData {
  hour: string;
  orders: number;
}

export interface PopularItemData {
  name: string;
  orders: number;
}

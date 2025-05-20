
export type OrderType = "dine-in" | "takeaway" | "delivery";
export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";

export interface OrderItem {
  id: string; // Menu item ID
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
}

export interface Order {
  id: string; // Order ID
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
  ingredients: string[];
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

// --- Auth Types ---
export type UserRole = "manager";

export interface User {
  id: string; // Can be a mock ID for client-side auth
  email: string;
  name: string;
  role: UserRole;
}

// This type is for the state managed by useActionState for server actions (e.g., feedback)
export type ServerActionState = {
  type: 'success' | 'error' | '';
  message: string;
  errors?: Record<string, string[] | undefined>;
  user?: User; // Kept for server actions that might return user, but not primary for client auth context
};


export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<{ success: boolean; message: string }>; // Simplified login
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>; // Still useful for initial load from localStorage
}

// --- Feedback Types ---
export interface Feedback {
  id: string;
  fullName: string;
  address?: string;
  phoneNumber?: string;
  menuItems?: string[]; // Names or IDs of menu items
  feedbackText: string;
  submittedAt: string; // ISO string
}


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
export type UserRole = "manager"; // Only manager role for now

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// This type is for the state managed by useActionState for login
export type AuthActionState = {
  type: 'success' | 'error' | '';
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    // name?: string[]; // Removed as signup is removed
    general?: string[];
  };
  user?: User;
};


export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (formData: FormData) => Promise<AuthActionState>;
  logout: () => Promise<void>;
  // signup removed
  fetchCurrentUser: () => Promise<void>;
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

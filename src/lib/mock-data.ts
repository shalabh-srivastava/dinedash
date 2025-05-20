
import type { Order, OrderItem, MenuItem, SalesData, PeakHoursData, PopularItemData } from '@/types';

// Helper to generate simple mock IDs
export const generateMockId = () => `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export const mockMenuItems: MenuItem[] = [
  {
    id: 'MI001',
    name: 'Galawat Kebab',
    description: 'Melt-in-the-mouth minced mutton kebabs, a Lucknowi specialty.',
    price: 350,
    category: 'Appetizers',
    imageUrl: 'https://source.unsplash.com/600x400/?kebab',
    dataAiHint: 'kebab meat',
    ingredients: ['Minced Mutton', 'Spices', 'Herbs', 'Ghee'],
  },
  {
    id: 'MI002',
    name: 'Rumali Roti',
    description: 'Thin, soft, and handkerchief-like bread, perfect with kebabs and curries.',
    price: 30,
    category: 'Breads',
    imageUrl: 'https://source.unsplash.com/600x400/?indian%20bread',
    dataAiHint: 'indian bread',
    ingredients: ['Flour', 'Water', 'Milk'],
  },
  {
    id: 'MI003',
    name: 'Butter Chicken',
    description: 'Creamy and mildly spiced chicken curry, a global favorite.',
    price: 450,
    category: 'Main Course',
    imageUrl: 'https://source.unsplash.com/600x400/?butter%20chicken',
    dataAiHint: 'chicken curry',
    ingredients: ['Chicken', 'Tomato Puree', 'Cream', 'Butter', 'Spices'],
  },
  {
    id: 'MI004',
    name: 'Tandoori Roti',
    description: 'Whole wheat bread baked in a tandoor.',
    price: 25,
    category: 'Breads',
    imageUrl: 'https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2021-02/naan-3.jpg?itok=xPP3zs5s',
    dataAiHint: 'indian bread',
    ingredients: ['Whole Wheat Flour', 'Water', 'Yogurt'],
  },
  {
    id: 'MI005',
    name: 'Aloo Gobhi',
    description: 'A classic North Indian dish made with potatoes and cauliflower.',
    price: 220,
    category: 'Vegetarian Main',
    imageUrl: 'https://source.unsplash.com/600x400/?aloo%20gobi',
    dataAiHint: 'cauliflower dish',
    ingredients: ['Potatoes', 'Cauliflower', 'Onions', 'Tomatoes', 'Spices'],
  },
  {
    id: 'MI006',
    name: 'Bhindi Masala',
    description: 'Stir-fried okra cooked with onions, tomatoes, and spices.',
    price: 200,
    category: 'Vegetarian Main',
    imageUrl: 'https://source.unsplash.com/600x400/?bhindi%20masala',
    dataAiHint: 'okra dish',
    ingredients: ['Okra (Bhindi)', 'Onions', 'Tomatoes', 'Spices'],
  },
  {
    id: 'MI007',
    name: 'Rajma Chawal',
    description: 'Kidney beans curry served with steamed rice. A wholesome meal.',
    price: 250,
    category: 'Vegetarian Main',
    imageUrl: 'https://source.unsplash.com/600x400/?rajma%20chawal',
    dataAiHint: 'kidney beans',
    ingredients: ['Kidney Beans (Rajma)', 'Rice', 'Onions', 'Tomatoes', 'Spices'],
  },
  {
    id: 'MI008',
    name: 'Coke',
    description: 'A refreshing can of Coca-Cola.',
    price: 40,
    category: 'Beverages',
    imageUrl: 'https://source.unsplash.com/600x400/?coca%20cola%20can',
    dataAiHint: 'soda drink',
    ingredients: ['Carbonated Water', 'Sugar', 'Flavoring'],
  },
  {
    id: 'MI009',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea.',
    price: 50,
    category: 'Beverages',
    imageUrl: 'https://source.unsplash.com/600x400/?masala%20chai',
    dataAiHint: 'indian tea',
    ingredients: ['Tea Leaves', 'Milk', 'Sugar', 'Spices'],
  }
];

export let mockOrders: Order[] = [
  {
    id: 'ORD001',
    type: 'dine-in',
    status: 'completed',
    items: [
      { id: 'MI001', name: 'Galawat Kebab', quantity: 1, price: 350, modifiers: ['extra spicy'] },
      { id: 'MI002', name: 'Rumali Roti', quantity: 2, price: 30 },
    ],
    total: 410,
    customerName: 'Priya Sharma',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    tableNumber: '7',
  },
  {
    id: 'ORD002',
    type: 'takeaway',
    status: 'preparing',
    items: [
      { id: 'MI003', name: 'Butter Chicken', quantity: 1, price: 450 },
      { id: 'MI004', name: 'Tandoori Roti', quantity: 4, price: 25 },
    ],
    total: 550,
    customerName: 'Rohan Mehra',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'ORD003',
    type: 'delivery',
    status: 'pending',
    items: [
      { id: 'MI007', name: 'Rajma Chawal', quantity: 2, price: 250 },
    ],
    total: 500,
    customerName: 'Anjali Singh',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    deliveryAddress: '15B, Hazratganj, Lucknow, Uttar Pradesh',
  },
];

// Functions to modify mock data (will cause re-render if page state depends on a key that changes)
export const addMockMenuItem = (item: Omit<MenuItem, 'id'>) => {
  const newItem: MenuItem = { ...item, id: generateMockId() };
  mockMenuItems.unshift(newItem); // Add to the beginning of the array
  return newItem;
};

export const addMockOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'total' | 'items'>, items: OrderItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrder: Order = {
    ...orderData,
    items,
    id: generateMockId(),
    timestamp: new Date().toISOString(),
    total,
  };
  mockOrders.unshift(newOrder);
  return newOrder;
};


export const mockSalesData: SalesData[] = [
  { month: 'Jan', sales: 120000 }, // Assuming sales in INR
  { month: 'Feb', sales: 150000 },
  { month: 'Mar', sales: 135000 },
  { month: 'Apr', sales: 160000 },
  { month: 'May', sales: 180000 },
  { month: 'Jun', sales: 170000 },
];

export const mockPeakHoursData: PeakHoursData[] = [
  { hour: '12 PM', orders: 25 },
  { hour: '1 PM', orders: 40 },
  { hour: '2 PM', orders: 30 },
  { hour: '7 PM', orders: 55 },
  { hour: '8 PM', orders: 60 },
  { hour: '9 PM', orders: 50 },
];

export const mockPopularItemsData: PopularItemData[] = [
  { name: 'Butter Chicken', orders: 150 },
  { name: 'Galawat Kebab', orders: 120 },
  { name: 'Rumali Roti', orders: 200 },
  { name: 'Rajma Chawal', orders: 180 },
  { name: 'Tandoori Roti', orders: 170 },
];

export const mockOrderHistoryForAI = JSON.stringify([
    { menuItem: "Butter Chicken", modifiers: ["less spicy", "extra butter"] },
    { menuItem: "Galawat Kebab", modifiers: ["well done"] },
    { menuItem: "Rajma Chawal", modifiers: ["extra onions"] }
]);

export const mockCustomerPreferencesForAI = JSON.stringify([
    { preference: "likes spicy food" },
    { preference: "prefers less oil" },
    { preference: "enjoys North Indian cuisine" }
]);

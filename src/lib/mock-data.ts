import type { Order, MenuItem, SalesData, PeakHoursData, PopularItemData } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    type: 'dine-in',
    status: 'completed',
    items: [
      { id: 'MI001', name: 'Classic Burger', quantity: 1, price: 12.99, modifiers: ['no onions'] },
      { id: 'MI004', name: 'Fries', quantity: 1, price: 3.99 },
    ],
    total: 16.98,
    customerName: 'Alice Smith',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    tableNumber: '5A',
  },
  {
    id: 'ORD002',
    type: 'takeaway',
    status: 'preparing',
    items: [
      { id: 'MI002', name: 'Veggie Pizza', quantity: 1, price: 15.50 },
      { id: 'MI005', name: 'Coke', quantity: 2, price: 2.00 },
    ],
    total: 19.50,
    customerName: 'Bob Johnson',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'ORD003',
    type: 'delivery',
    status: 'pending',
    items: [
      { id: 'MI003', name: 'Chicken Salad', quantity: 1, price: 10.00 },
    ],
    total: 10.00,
    customerName: 'Carol Williams',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    deliveryAddress: '123 Main St, Anytown, USA',
  },
  {
    id: 'ORD004',
    type: 'dine-in',
    status: 'pending',
    items: [
      { id: 'MI006', name: 'Espresso', quantity: 2, price: 3.50 },
    ],
    total: 7.00,
    customerName: 'David Brown',
    timestamp: new Date().toISOString(),
    tableNumber: '2B',
  },
    {
    id: 'ORD005',
    type: 'delivery',
    status: 'completed',
    items: [
      { id: 'MI001', name: 'Classic Burger', quantity: 2, price: 12.99, modifiers: ['extra cheese'] },
      { id: 'MI002', name: 'Veggie Pizza', quantity: 1, price: 15.50 },
    ],
    total: 41.48,
    customerName: 'Eva Green',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    deliveryAddress: '456 Oak Ave, Anytown, USA',
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: 'MI001',
    name: 'Classic Burger',
    description: 'A juicy beef patty with lettuce, tomato, and our special sauce.',
    price: 12.99,
    category: 'Main Course',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'burger food',
    ingredients: ['Beef Patty', 'Bun', 'Lettuce', 'Tomato', 'Special Sauce'],
  },
  {
    id: 'MI002',
    name: 'Veggie Pizza',
    description: 'A delicious pizza topped with fresh seasonal vegetables.',
    price: 15.50,
    category: 'Main Course',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza food',
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Cheese', 'Mixed Vegetables'],
  },
  {
    id: 'MI003',
    name: 'Chicken Salad',
    description: 'Grilled chicken breast on a bed of mixed greens with a light vinaigrette.',
    price: 10.00,
    category: 'Salads',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'salad food',
    ingredients: ['Chicken Breast', 'Mixed Greens', 'Vinaigrette'],
  },
  {
    id: 'MI004',
    name: 'Fries',
    description: 'Crispy golden french fries.',
    price: 3.99,
    category: 'Sides',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'fries food',
    ingredients: ['Potatoes', 'Oil', 'Salt'],
  },
  {
    id: 'MI005',
    name: 'Coke',
    description: 'A refreshing can of Coca-Cola.',
    price: 2.00,
    category: 'Beverages',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'soda drink',
    ingredients: ['Carbonated Water', 'Sugar', 'Flavoring'],
  },
  {
    id: 'MI006',
    name: 'Espresso',
    description: 'A strong shot of coffee.',
    price: 3.50,
    category: 'Beverages',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'coffee drink',
    ingredients: ['Coffee Beans', 'Water'],
  },
];

export const mockSalesData: SalesData[] = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 15000 },
  { month: 'Mar', sales: 13500 },
  { month: 'Apr', sales: 16000 },
  { month: 'May', sales: 18000 },
  { month: 'Jun', sales: 17000 },
];

export const mockPeakHoursData: PeakHoursData[] = [
  { hour: '10 AM', orders: 15 },
  { hour: '11 AM', orders: 25 },
  { hour: '12 PM', orders: 40 },
  { hour: '1 PM', orders: 55 },
  { hour: '2 PM', orders: 30 },
  { hour: '6 PM', orders: 45 },
  { hour: '7 PM', orders: 60 },
  { hour: '8 PM', orders: 50 },
];

export const mockPopularItemsData: PopularItemData[] = [
  { name: 'Classic Burger', orders: 150 },
  { name: 'Veggie Pizza', orders: 120 },
  { name: 'Fries', orders: 200 },
  { name: 'Coke', orders: 180 },
  { name: 'Chicken Salad', orders: 90 },
];

export const mockOrderHistoryForAI = JSON.stringify([
    { menuItem: "Classic Burger", modifiers: ["no onions", "medium rare"] },
    { menuItem: "Veggie Pizza", modifiers: ["extra mushrooms", "thin crust"] },
    { menuItem: "Chicken Salad", modifiers: ["dressing on side"] },
    { menuItem: "Classic Burger", modifiers: ["no pickles", "well done"] }
]);

export const mockCustomerPreferencesForAI = JSON.stringify([
    { preference: "likes spicy food" },
    { preference: "allergic to nuts" },
    { preference: "prefers vegetarian options" }
]);

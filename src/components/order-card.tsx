import type { Order, OrderStatus, OrderType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Package, Truck, Clock3, ChefHat, CheckCircle2, XCircle, DollarSign, Hash, CalendarDays, User } from 'lucide-react';
import { format } from 'date-fns';

interface OrderCardProps {
  order: Order;
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return <Clock3 className="h-4 w-4 text-yellow-500" />;
    case 'preparing': return <ChefHat className="h-4 w-4 text-blue-500" />;
    case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <Clock3 className="h-4 w-4" />;
  }
};

const getTypeIcon = (type: OrderType) => {
  switch (type) {
    case 'dine-in': return <Utensils className="h-4 w-4" />;
    case 'takeaway': return <Package className="h-4 w-4" />;
    case 'delivery': return <Truck className="h-4 w-4" />;
    default: return <Utensils className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pending': return 'default';
    case 'preparing': return 'secondary';
    case 'completed': return 'outline'; // Using outline for completed to differentiate
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
}


export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">Order #{order.id.slice(-4)}</CardTitle>
          <Badge variant={getStatusVariant(order.status)} className="capitalize">
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status}</span>
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm pt-1">
          {getTypeIcon(order.type)}
          <span className="ml-1 capitalize">{order.type}</span>
          {order.type === 'dine-in' && order.tableNumber && <span className="ml-2 flex items-center"><Hash className="h-3 w-3 mr-1"/> Table {order.tableNumber}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
           {order.items.some(item => item.modifiers && item.modifiers.length > 0) && (
             <div className="mt-2">
              <p className="text-xs font-medium text-muted-foreground">Modifiers:</p>
              <ul className="list-disc list-inside pl-1">
              {order.items.flatMap(item => item.modifiers || []).map((mod, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">{mod}</li>
              ))}
              </ul>
             </div>
           )}
        </div>
         <div className="border-t pt-2 mt-2">
          <p className="text-sm flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> {order.customerName}</p>
          {order.type === 'delivery' && order.deliveryAddress && <p className="text-xs text-muted-foreground mt-1">To: {order.deliveryAddress}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
        <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-1" />
            {format(new Date(order.timestamp), "PPp")}
        </div>
        <div className="flex items-center text-lg font-bold text-primary">
            <DollarSign className="h-5 w-5 mr-1" />
            {order.total.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}

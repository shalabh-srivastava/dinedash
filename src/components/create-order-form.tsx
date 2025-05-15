
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import type { Order, OrderItem, MenuItem, OrderType, OrderStatus } from "@/types";
import { mockMenuItems } from "@/lib/mock-data"; // To populate item selection
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const orderItemSchema = z.object({
  menuItemId: z.string().min(1, "Please select an item."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  modifiers: z.string().optional(), // Comma-separated string
});

const orderServiceSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  type: z.enum(["dine-in", "takeaway", "delivery"], { required_error: "Order type is required." }),
  status: z.enum(["pending", "preparing", "completed", "cancelled"], { required_error: "Order status is required." }),
  tableNumber: z.string().optional(),
  deliveryAddress: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item."),
});

type OrderFormData = z.infer<typeof orderServiceSchema>;

interface CreateOrderFormProps {
  onAddOrder: (orderData: Omit<Order, 'id' | 'timestamp' | 'total' | 'items'>, items: OrderItem[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrderForm({ onAddOrder, open, onOpenChange }: CreateOrderFormProps) {
  const { toast } = useToast();
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderServiceSchema),
    defaultValues: {
      customerName: "",
      type: "dine-in",
      status: "pending",
      items: [{ menuItemId: "", quantity: 1, modifiers: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const orderType = form.watch("type");

  function onSubmit(data: OrderFormData) {
    const orderedItems: OrderItem[] = data.items.map(item => {
      const menuItem = mockMenuItems.find(mi => mi.id === item.menuItemId);
      if (!menuItem) throw new Error("Selected menu item not found"); // Should not happen with proper validation
      return {
        id: menuItem.id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        modifiers: item.modifiers?.split(',').map(m => m.trim()).filter(Boolean) || [],
      };
    });

    const orderDetails: Omit<Order, 'id' | 'timestamp' | 'total' | 'items'> = {
      customerName: data.customerName,
      type: data.type,
      status: data.status,
      tableNumber: data.type === "dine-in" ? data.tableNumber : undefined,
      deliveryAddress: data.type === "delivery" ? data.deliveryAddress : undefined,
    };

    onAddOrder(orderDetails, orderedItems);
    toast({ title: "Order Created", description: `New order for ${data.customerName} has been created.` });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill in the details for the new order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Priya Sharma" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="dine-in">Dine-in</SelectItem>
                        <SelectItem value="takeaway">Takeaway</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {orderType === "dine-in" && (
              <FormField
                control={form.control}
                name="tableNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Number</FormLabel>
                    <FormControl><Input placeholder="e.g., 5" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {orderType === "delivery" && (
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl><Input placeholder="e.g., 15B, Hazratganj, Lucknow" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <FormLabel className="flex items-center"><ShoppingCart className="mr-2 h-5 w-5 text-primary"/>Order Items</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="p-3 border rounded-md space-y-3 relative">
                  {fields.length > 1 && (
                     <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                     </Button>
                  )}
                  <FormField
                    control={form.control}
                    name={`items.${index}.menuItemId`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <Select onValueChange={itemField.onChange} defaultValue={itemField.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select menu item" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {mockMenuItems.map(menuItem => (
                              <SelectItem key={menuItem.id} value={menuItem.id}>{menuItem.name} - ₹{menuItem.price.toFixed(2)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl><Input type="number" placeholder="1" {...itemField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.modifiers`}
                    render={({ field: itemField }) => (
                      <FormItem>
                        <FormLabel>Modifiers (Optional, comma-separated)</FormLabel>
                        <FormControl><Input placeholder="e.g., no onions, extra cheese" {...itemField} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ menuItemId: "", quantity: 1, modifiers: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
               <FormField
                  control={form.control}
                  name="items"
                  render={() => <FormMessage />} // To show array-level errors like "min 1 item"
                />
            </div>

            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Order
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

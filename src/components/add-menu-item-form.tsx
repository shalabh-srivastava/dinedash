
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { MenuItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const menuItemSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  price: z.coerce.number().min(0.01, { message: "Price must be positive." }),
  category: z.string().min(2, { message: "Category is required." }),
  ingredients: z.string().min(3, {message: "Ingredients are required (comma-separated)."}),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface AddMenuItemFormProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMenuItemForm({ onAddItem, open, onOpenChange }: AddMenuItemFormProps) {
  const { toast } = useToast();
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      ingredients: "",
      imageUrl: "",
      dataAiHint: "",
    },
  });

  function onSubmit(data: MenuItemFormData) {
    const ingredientsArray = data.ingredients.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const newItem: Omit<MenuItem, 'id'> = {
      ...data,
      ingredients: ingredientsArray,
      imageUrl: data.imageUrl || undefined, // Set to undefined if empty string
      dataAiHint: data.dataAiHint || data.name.split(" ").slice(0,2).join(" "), // Default hint from name
    };
    onAddItem(newItem);
    toast({ title: "Menu Item Added", description: `${data.name} has been added to the menu.` });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the new menu item. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spicy Pasta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A fiery pasta dish with chili flakes." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 14.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Pasta, Tomato, Chili" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://source.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dataAiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint (Optional, 1-2 words for Unsplash)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., pasta food" {...field} />
                  </FormControl>
                   <FormDescription>If Image URL is empty, use this for placeholder generation hints.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Save Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState, useFormStatus } from "react-dom";
import { feedbackSchema, submitFeedback, type FeedbackFormData } from "@/actions/feedback";
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
import { Checkbox } from "@/components/ui/checkbox"; // For multi-select items
import { mockMenuItems } from "@/lib/mock-data"; // To populate menu item selection
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Submit Feedback
    </Button>
  );
}


export function FeedbackForm() {
  const { toast } = useToast();
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      fullName: "",
      address: "",
      phoneNumber: "",
      menuItems: [],
      feedbackText: "",
    },
  });

  const [state, formAction] = useFormState(submitFeedback, { type: "", message: "", errors: {} });

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: "Feedback Submitted", description: state.message });
      form.reset();
    } else if (state.type === 'error' && state.message) {
      toast({ title: "Submission Failed", description: state.message, variant: "destructive" });
    }
  }, [state, toast, form]);

  // Watch menuItems to correctly pass to server action
  const watchedMenuItems = form.watch("menuItems") || [];

  const handleSubmit = async () => {
    const formData = form.getValues();
    // Manually call formAction with the correct data structure
    // The formAction from useFormState expects FormData, but our server action is typed for FeedbackFormData
    // To work around this, we construct the object and pass it directly
    // This is a common pattern when useFormState is used with more complex, non-FormData submissions
    // For simple form data, `new FormData(formRef.current)` is typical.
    await formAction(formData);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rohan Mehra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Gomti Nagar, Lucknow" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="e.g., +919876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="menuItems"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Menu Items (Optional)</FormLabel>
                <FormDescription>
                  Select the menu items related to your feedback.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-1 rounded-md border">
                {mockMenuItems.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="menuItems"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-muted rounded-md"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.name)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.name])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== item.name
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedbackText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience, suggestions, or any issues..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
            <SubmitButton />
        </div>
      </form>
    </Form>
  );
}

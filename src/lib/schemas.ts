
import { z } from 'zod';

export const feedbackSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  menuItems: z.array(z.string()).optional(), // Array of menu item IDs/names
  feedbackText: z.string().min(10, { message: 'Feedback must be at least 10 characters.' }),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

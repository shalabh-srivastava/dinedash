
'use server';

import { z } from 'zod';
import { getDb } from '@/lib/db';

export const feedbackSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  menuItems: z.array(z.string()).optional(), // Array of menu item IDs/names
  feedbackText: z.string().min(10, { message: 'Feedback must be at least 10 characters.' }),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export async function submitFeedback(prevState: any, formData: FeedbackFormData) {
  const validatedFields = feedbackSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data.',
    };
  }

  const { fullName, address, phoneNumber, menuItems, feedbackText } = validatedFields.data;

  try {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO feedback (full_name, address, phone_number, menu_items, feedback_text) VALUES (?, ?, ?, ?, ?)',
      fullName,
      address || null,
      phoneNumber || null,
      menuItems ? menuItems.join(', ') : null, // Store as comma-separated string
      feedbackText
    );

    if (result.lastID) {
      return { type: 'success', message: 'Feedback submitted successfully! Thank you.' };
    } else {
      return { type: 'error', message: 'Failed to submit feedback. Please try again.' };
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    return { type: 'error', message: 'An unexpected error occurred.' };
  }
}

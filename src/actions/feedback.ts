
'use server';

import { getDb } from '@/lib/db';
import type { FeedbackFormData } from '@/lib/schemas'; // Updated import
import { feedbackSchema } from '@/lib/schemas'; // Updated import

export async function submitFeedback(prevState: any, formData: FeedbackFormData) {
  const validatedFields = feedbackSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      type: 'error' as const, // Ensure 'error' is a literal type
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
      return { type: 'success' as const, message: 'Feedback submitted successfully! Thank you.' };
    } else {
      return { type: 'error' as const, message: 'Failed to submit feedback. Please try again.' };
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    return { type: 'error' as const, message: 'An unexpected error occurred.' };
  }
}

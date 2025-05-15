'use server';

/**
 * @fileOverview AI-powered suggestions for order modifiers based on history and preferences.
 *
 * - suggestOrderModifiers - A function that suggests order modifiers.
 * - SuggestOrderModifiersInput - The input type for the suggestOrderModifiers function.
 * - SuggestOrderModifiersOutput - The return type for the suggestOrderModifiers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOrderModifiersInputSchema = z.object({
  orderHistory: z
    .string()
    .describe(
      'Order history for the customer, as a JSON array of order objects.'
    ),
  customerPreferences: z
    .string()
    .describe(
      'Customer preferences as a JSON array of preference objects.'
    ),
  menuItem: z.string().describe('The menu item being ordered.'),
});
export type SuggestOrderModifiersInput = z.infer<
  typeof SuggestOrderModifiersInputSchema
>;

const SuggestOrderModifiersOutputSchema = z.object({
  suggestedModifiers: z
    .array(z.string())
    .describe(
      'An array of suggested modifiers based on order history and customer preferences.'
    ),
});
export type SuggestOrderModifiersOutput = z.infer<
  typeof SuggestOrderModifiersOutputSchema
>;

export async function suggestOrderModifiers(
  input: SuggestOrderModifiersInput
): Promise<SuggestOrderModifiersOutput> {
  return suggestOrderModifiersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOrderModifiersPrompt',
  input: {schema: SuggestOrderModifiersInputSchema},
  output: {schema: SuggestOrderModifiersOutputSchema},
  prompt: `You are a helpful assistant that suggests modifiers for a menu item based on customer order history and preferences.

  Order History: {{{orderHistory}}}
  Customer Preferences: {{{customerPreferences}}}
  Menu Item: {{{menuItem}}}

  Suggest relevant modifiers (e.g., "no onions", "extra cheese") based on the order history and customer preferences.  Return them as an array of strings.`,
});

const suggestOrderModifiersFlow = ai.defineFlow(
  {
    name: 'suggestOrderModifiersFlow',
    inputSchema: SuggestOrderModifiersInputSchema,
    outputSchema: SuggestOrderModifiersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

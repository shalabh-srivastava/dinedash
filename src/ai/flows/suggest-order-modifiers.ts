
'use server';

/**
 * @fileOverview AI-powered suggestions for order modifiers based on history and preferences.
 * Currently uses MOCK data due to issues with AI provider integration.
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
  // Using MOCK AI suggestions
  console.log("Using MOCK AI suggestions for input:", input);
  
  const mockSuggestions: string[] = [];
  if (input.menuItem.toLowerCase().includes("burger")) {
    mockSuggestions.push("extra pickles");
    mockSuggestions.push("no onions");
    mockSuggestions.push("add bacon");
  } else if (input.menuItem.toLowerCase().includes("pizza")) {
    mockSuggestions.push("extra cheese");
    mockSuggestions.push("thin crust");
    mockSuggestions.push("add pepperoni");
  } else if (input.menuItem.toLowerCase().includes("salad")) {
    mockSuggestions.push("dressing on the side");
    mockSuggestions.push("add avocado");
  } else {
    mockSuggestions.push("add a side of fries");
    mockSuggestions.push("make it spicy");
  }
  
  // Simulate an asynchronous operation
  await new Promise(resolve => setTimeout(resolve, 50)); 
  
  return { suggestedModifiers: mockSuggestions };
}

/*
// Original AI-powered flow (commented out):
// If you configure an AI provider in src/ai/genkit.ts, you can uncomment this section
// and remove or comment out the mock implementation above.

const prompt = ai.definePrompt({
  name: 'suggestOrderModifiersPrompt',
  input: {schema: SuggestOrderModifiersInputSchema},
  output: {schema: SuggestOrderModifiersOutputSchema},
  prompt: `You are a helpful assistant that suggests modifiers for a menu item based on customer order history and preferences.

  Order History: {{{orderHistory}}}
  Customer Preferences: {{{customerPreferences}}}
  Menu Item: {{{menuItem}}}

  Suggest relevant modifiers (e.g., "no onions", "extra cheese") based on the order history and customer preferences. Return them as an array of strings.`,
});

const suggestOrderModifiersFlow = ai.defineFlow(
  {
    name: 'suggestOrderModifiersFlow',
    inputSchema: SuggestOrderModifiersInputSchema,
    outputSchema: SuggestOrderModifiersOutputSchema,
  },
  async (input): Promise<SuggestOrderModifiersOutput> => {
    const {output} = await prompt(input);

    if (!output) {
      console.error("AI prompt did not return an output for input:", input);
      return { suggestedModifiers: [] };
    }
    return output;
  }
);

// To use the original flow, you would change the export above to:
// export async function suggestOrderModifiers(
//   input: SuggestOrderModifiersInput
// ): Promise<SuggestOrderModifiersOutput> {
//   return suggestOrderModifiersFlow(input);
// }
*/

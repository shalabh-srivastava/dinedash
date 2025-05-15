
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
  async (input): Promise<SuggestOrderModifiersOutput> => {
    // MODIFICATION START: Return mocked suggestions to avoid API key requirement.
    // This makes the feature "free" by not calling a paid AI service.
    // To re-enable actual AI suggestions (if you have an API key like GOOGLE_API_KEY):
    // 1. Comment out or remove the 'mockedResponse' block below.
    // 2. Uncomment the 'Actual AI call' block further down.
    // 3. Ensure your API key is correctly set up (e.g., in a .env file).

    const mockedResponse: SuggestOrderModifiersOutput = {
      suggestedModifiers: [
        `Consider "extra cheese" for ${input.menuItem} (mocked suggestion)`,
        `How about "no onions" for ${input.menuItem}? (mocked suggestion)`,
        `Try ${input.menuItem} with "spicy sauce" (mocked suggestion)`,
      ],
    };
    // console.log(`AI Flow: Returning mocked suggestions for menuItem "${input.menuItem}"`);
    return mockedResponse;

    /*
    // == Actual AI call (Commented out for free/mocked version) ==
    // Uncomment this block and remove/comment the 'mockedResponse' block above
    // to use real AI suggestions.

    console.log(`AI Flow: Calling actual AI prompt for menuItem "${input.menuItem}"`);
    const {output} = await prompt(input);

    if (!output) {
      // This case should ideally be handled by Genkit if the prompt fails or the model doesn't comply.
      // For robustness, you might want to ensure output is always valid or throw/handle an error.
      console.error("AI prompt did not return an output for input:", input);
      // Returning empty suggestions as a fallback.
      // Consider if throwing an error or a more specific message is appropriate for your app.
      return { suggestedModifiers: [] };
    }
    return output;
    // == End of Actual AI call block ==
    */
    // MODIFICATION END
  }
);

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { suggestOrderModifiers, type SuggestOrderModifiersInput } from '@/ai/flows/suggest-order-modifiers';
import { useToast } from '@/hooks/use-toast';
import { mockOrderHistoryForAI, mockCustomerPreferencesForAI } from '@/lib/mock-data';
import { Input } from './ui/input';

export function AISuggestions() {
  const [menuItem, setMenuItem] = useState<string>("Classic Burger");
  const [orderHistory, setOrderHistory] = useState<string>(mockOrderHistoryForAI);
  const [customerPreferences, setCustomerPreferences] = useState<string>(mockCustomerPreferencesForAI);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const input: SuggestOrderModifiersInput = {
        orderHistory,
        customerPreferences,
        menuItem,
      };
      const result = await suggestOrderModifiers(input);
      if (result && result.suggestedModifiers) {
        setSuggestions(result.suggestedModifiers);
        if(result.suggestedModifiers.length === 0) {
          toast({ title: "AI Suggestions", description: "No specific suggestions found for this combination." });
        }
      } else {
        toast({ title: "Error", description: "Could not retrieve suggestions.", variant: "destructive" });
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({ title: "Error", description: "An error occurred while fetching suggestions.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Wand2 className="h-6 w-6 mr-2 text-primary" />AI Order Modifier Suggestions</CardTitle>
        <CardDescription>
          Get AI-powered suggestions for order modifiers based on (mocked) customer history and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="menuItem">Menu Item</Label>
          <Input
            id="menuItem"
            value={menuItem}
            onChange={(e) => setMenuItem(e.target.value)}
            placeholder="e.g., Classic Burger"
          />
        </div>
        <div>
          <Label htmlFor="orderHistory">Order History (JSON)</Label>
          <Textarea
            id="orderHistory"
            value={orderHistory}
            onChange={(e) => setOrderHistory(e.target.value)}
            rows={5}
            placeholder='e.g., [{ "menuItem": "Pizza", "modifiers": ["extra cheese"] }]'
          />
        </div>
        <div>
          <Label htmlFor="customerPreferences">Customer Preferences (JSON)</Label>
          <Textarea
            id="customerPreferences"
            value={customerPreferences}
            onChange={(e) => setCustomerPreferences(e.target.value)}
            rows={3}
            placeholder='e.g., [{ "preference": "likes spicy" }]'
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={handleGetSuggestions} disabled={isLoading || !menuItem.trim()}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get Suggestions
        </Button>
        {suggestions.length > 0 && (
          <div className="w-full pt-4 border-t">
            <h4 className="font-semibold mb-2">Suggested Modifiers for "{menuItem}":</h4>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

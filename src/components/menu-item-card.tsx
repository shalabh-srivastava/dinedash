import type { MenuItem } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, List } from 'lucide-react';

interface MenuItemCardProps {
  menuItem: MenuItem;
}

export function MenuItemCard({ menuItem }: MenuItemCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader>
        {menuItem.imageUrl && (
          <div className="relative h-48 w-full mb-4 rounded-t-lg overflow-hidden">
            <Image
              src={menuItem.imageUrl}
              alt={menuItem.name}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={menuItem.dataAiHint || "food item"}
            />
          </div>
        )}
        <CardTitle className="text-lg font-semibold">{menuItem.name}</CardTitle>
        <CardDescription>{menuItem.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-primary font-semibold text-lg mb-2">
          <DollarSign className="h-5 w-5 mr-1" />
          {menuItem.price.toFixed(2)}
        </div>
        <Badge variant="secondary" className="capitalize mb-3">{menuItem.category}</Badge>
        
        <div>
          <h4 className="text-sm font-medium flex items-center mb-1">
            <List className="h-4 w-4 mr-1 text-muted-foreground" />
            Ingredients:
          </h4>
          <p className="text-xs text-muted-foreground">
            {menuItem.ingredients.join(', ')}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 mt-auto">
        <Badge variant="outline">Available</Badge> 
        {/* Future: Add to order button, availability status */}
      </CardFooter>
    </Card>
  );
}

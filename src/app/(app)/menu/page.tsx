"use client";

import { useState, useMemo } from 'react';
import { MenuItemCard } from '@/components/menu-item-card';
import { mockMenuItems } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ListFilter } from 'lucide-react';

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const allCategories = mockMenuItems.map(item => item.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, []);

  const filteredMenuItems = useMemo(() => {
    return mockMenuItems.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Item
        </Button>
      </div>

      <div className="p-4 bg-card border rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Button variant="outline" className="sm:col-start-auto lg:col-start-3">
             <ListFilter className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </div>
      </div>
      
      {filteredMenuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenuItems.map((item) => (
            <MenuItemCard key={item.id} menuItem={item} />
          ))}
        </div>
      ) : (
         <p className="text-center text-muted-foreground py-8">No menu items found matching your criteria.</p>
      )}
    </div>
  );
}

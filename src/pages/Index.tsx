import React, { useState } from 'react';
import RoomCard from '@/components/RoomCard';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, SearchIcon } from 'lucide-react';

// Mock data - replace with real data later
const mockProducts = [
  { id: 1, name: "Coffee", price: 3.50, category: "Drinks" },
  { id: 2, name: "Tea", price: 2.50, category: "Drinks" },
  { id: 3, name: "Sandwich", price: 8.00, category: "Food" },
  { id: 4, name: "Salad", price: 10.00, category: "Food" },
];

const mockRooms = Array.from({ length: 7 }, (_, i) => ({
  roomNumber: i + 1,
  totalAmount: Math.random() * 100,
}));

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const filteredProducts = mockProducts.filter(product => 
    (!selectedCategory || product.category === selectedCategory) &&
    (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-hotel-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-hotel-primary">Hotel Order Management</h1>
          <Button className="bg-hotel-accent hover:bg-hotel-accent/90">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockRooms.map((room) => (
            <RoomCard
              key={room.roomNumber}
              roomNumber={room.roomNumber}
              totalAmount={room.totalAmount}
              onViewDetails={() => console.log(`View details for room ${room.roomNumber}`)}
              onPrintBill={() => console.log(`Print bill for room ${room.roomNumber}`)}
            />
          ))}
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                category={product.category}
                onAdd={() => console.log(`Add ${product.name} to order`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
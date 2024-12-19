import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { toast } from 'sonner';
import { useOrderStore } from '@/store/useOrderStore';

// Mock products data - replace with real data later
const mockProducts: Product[] = [
  { id: 1, name: "Coffee", price: 3.50, category: "Drinks" },
  { id: 2, name: "Tea", price: 2.50, category: "Drinks" },
  { id: 3, name: "Sandwich", price: 8.00, category: "Food" },
  { id: 4, name: "Salad", price: 10.00, category: "Food" },
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItemToRoom } = useOrderStore();
  
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));
  const rooms = Array.from({ length: 7 }, (_, i) => i + 1);

  const filteredProducts = mockProducts.filter(product => 
    (!selectedCategory || product.category === selectedCategory) &&
    (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToRoom = (product: Product, roomNumber: number) => {
    addItemToRoom(roomNumber, product);
    toast.success(`Added ${product.name} to Room ${roomNumber}`);
  };

  return (
    <div className="min-h-screen bg-hotel-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-hotel-primary">Products Management</h1>
        </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  onAdd={() => {
                    const roomNumber = 1;
                    handleAddToRoom(product, roomNumber);
                  }}
                />
                <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1 bg-white p-1 rounded-md shadow-lg">
                    {rooms.map((roomNumber) => (
                      <Button
                        key={roomNumber}
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToRoom(product, roomNumber)}
                      >
                        {roomNumber}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
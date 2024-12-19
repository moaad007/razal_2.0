import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrinterIcon, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

interface RoomCardProps {
  roomNumber: number;
  totalAmount: number;
  onViewDetails: () => void;
  onPrintBill: () => void;
}

const RoomCard = ({ roomNumber, totalAmount, onViewDetails, onPrintBill }: RoomCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, addItemToRoom } = useOrderStore();

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const filteredProducts = products.filter(product => 
    (!selectedCategory || product.category === selectedCategory) &&
    (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-hotel-primary">Room {roomNumber}</h3>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add Product to Room {roomNumber}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex gap-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      price={product.price}
                      category={product.category}
                      onAdd={() => {
                        addItemToRoom(roomNumber, product);
                        toast.success(`Added ${product.name} to Room ${roomNumber}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={onPrintBill}>
            <PrinterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-hotel-secondary">Total Amount:</p>
        <p className="text-2xl font-bold text-hotel-accent">${totalAmount.toFixed(2)}</p>
        <Button className="w-full bg-hotel-primary hover:bg-hotel-primary/90" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default RoomCard;
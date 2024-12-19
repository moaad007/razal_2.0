import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, Trash2, Plus } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';

const RoomDetails = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { orders, products, removeItemFromRoom, clearRoom, addItemToRoom } = useOrderStore();
  const room = orders[Number(roomNumber)];

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const filteredProducts = products.filter(product => 
    (!selectedCategory || product.category === selectedCategory) &&
    (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!room) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2" />
          Back to Rooms
        </Button>
        <div className="text-center mt-8">No orders found for this room.</div>
      </div>
    );
  }

  const handlePrint = () => {
    toast.success('Bill sent to printer');
  };

  const handleClearRoom = () => {
    clearRoom(Number(roomNumber));
    toast.success('Room bill cleared');
    navigate('/');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2" />
          Back to Rooms
        </Button>
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
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
                        addItemToRoom(Number(roomNumber), product);
                        toast.success(`Added ${product.name} to Room ${roomNumber}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2" />
            Print Bill
          </Button>
          <Button variant="destructive" onClick={handleClearRoom}>
            <Trash2 className="mr-2" />
            Clear Bill
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-hotel-primary">Room {roomNumber}</h2>
          <p className="text-hotel-secondary">Total Amount: ${room.totalAmount.toFixed(2)}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {room.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.product.price.toFixed(2)}</TableCell>
                <TableCell>${(item.quantity * item.product.price).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItemFromRoom(Number(roomNumber), item.productId)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoomDetails;
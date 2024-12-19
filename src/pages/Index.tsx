import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const rooms = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-hotel-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-hotel-primary">Hotel Order Management</h1>
          <Button onClick={() => navigate('/products')}>
            Manage Products
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((roomNumber) => (
            <RoomCard
              key={roomNumber}
              roomNumber={roomNumber}
              totalAmount={orders[roomNumber]?.totalAmount || 0}
              onViewDetails={() => navigate(`/room/${roomNumber}`)}
              onPrintBill={() => {
                toast.success(`Printing bill for Room ${roomNumber}`);
                // Implement actual printing logic here
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

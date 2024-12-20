import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from '@/components/RoomCard';
import { Button } from '@/components/ui/button';
import { useOrderStore, useInitializeStore } from '@/store/useOrderStore';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useOrderStore();
  
  // Fetch orders from Supabase
  const { isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      setOrders(data || []);
      return data;
    }
  });

  const rooms = Array.from({ length: 7 }, (_, i) => i + 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hotel-background p-6 flex items-center justify-center">
        <div className="text-xl text-hotel-primary">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-hotel-background p-6 flex items-center justify-center">
        <div className="text-xl text-red-500">Error loading orders. Please try again.</div>
      </div>
    );
  }

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
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
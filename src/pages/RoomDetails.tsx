import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, Trash2 } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from 'sonner';

const RoomDetails = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const room = useOrderStore((state) => state.orders[Number(roomNumber)]);
  const removeItem = useOrderStore((state) => state.removeItemFromRoom);
  const clearRoom = useOrderStore((state) => state.clearRoom);

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
    // Implement actual printing logic here
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
                    onClick={() => removeItem(Number(roomNumber), item.productId)}
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
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';

interface RoomCardProps {
  roomNumber: number;
  totalAmount: number;
  onViewDetails: () => void;
  onPrintBill: () => void;
}

const RoomCard = ({ roomNumber, totalAmount, onViewDetails, onPrintBill }: RoomCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-hotel-primary">Room {roomNumber}</h3>
        <Button variant="outline" size="icon" onClick={onPrintBill}>
          <PrinterIcon className="h-4 w-4" />
        </Button>
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
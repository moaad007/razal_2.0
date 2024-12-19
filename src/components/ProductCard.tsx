import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2Icon } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: number;
  category: string;
  onAdd: () => void;
  deleteMode?: boolean;
}

const ProductCard = ({ name, price, category, onAdd, deleteMode = false }: ProductCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-hotel-primary">{name}</h3>
          <p className="text-sm text-hotel-secondary">{category}</p>
        </div>
        <Button 
          size="icon" 
          variant={deleteMode ? "destructive" : "ghost"}
          onClick={onAdd}
        >
          {deleteMode ? <Trash2Icon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-lg font-semibold text-hotel-accent">${price.toFixed(2)}</p>
    </Card>
  );
};

export default ProductCard;
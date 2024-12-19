import { create } from 'zustand';
import { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';

// This is now just a wrapper around our React Query hooks
// to maintain compatibility with the existing code
export const useOrderStore = create(() => ({
  products: [] as Product[],
  orders: {},
  addItemToRoom: () => {},
  removeItemFromRoom: () => {},
  clearRoom: () => {},
  addProduct: () => {},
  deleteProduct: () => {},
}));

// Initialize the store with the hooks
export const useInitializeStore = () => {
  const { data: products } = useProducts();
  const { 
    orders, 
    addItemToRoom, 
    removeItemFromRoom, 
    clearRoom 
  } = useOrders();

  useOrderStore.setState({
    products: products || [],
    orders,
    addItemToRoom,
    removeItemFromRoom,
    clearRoom,
  });
};
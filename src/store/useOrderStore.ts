import { create } from 'zustand';
import { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';

interface OrderStore {
  products: Product[];
  orders: Record<number, any>;
  setOrders: (orders: any[]) => void;
  addItemToRoom: (roomNumber: number, product: Product) => void;
  removeItemFromRoom: (roomNumber: number, productId: number) => void;
  clearRoom: (roomNumber: number) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (productId: number) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  products: [],
  orders: {},
  setOrders: (orders) => {
    // Transform the orders array into a record indexed by room number
    const ordersRecord = orders.reduce((acc: Record<number, any>, order) => {
      acc[order.room_number] = {
        roomNumber: order.room_number,
        totalAmount: order.total_amount,
        items: [] // You might want to fetch order items separately if needed
      };
      return acc;
    }, {});
    
    set({ orders: ordersRecord });
  },
  addItemToRoom: () => {},
  removeItemFromRoom: () => {},
  clearRoom: () => {},
  addProduct: () => {},
  deleteProduct: () => {},
}));

export const useInitializeStore = () => {
  const { data: products, addProduct, deleteProduct } = useProducts();
  const { 
    orders, 
    addItemToRoom: addItem, 
    removeItemFromRoom: removeItem, 
    clearRoom: clear 
  } = useOrders();

  useOrderStore.setState({
    products: products || [],
    orders,
    addItemToRoom: (roomNumber: number, product: Product) => 
      addItem({ roomNumber, product }),
    removeItemFromRoom: (roomNumber: number, productId: number) => 
      removeItem({ roomNumber, productId }),
    clearRoom: (roomNumber: number) => clear(roomNumber),
    addProduct,
    deleteProduct,
  });
};
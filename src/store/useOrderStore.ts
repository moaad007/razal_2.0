import { create } from 'zustand';
import { Product, RoomOrder, OrderItem } from '@/types';

interface OrderStore {
  orders: Record<number, RoomOrder>;
  addItemToRoom: (roomNumber: number, product: Product) => void;
  removeItemFromRoom: (roomNumber: number, productId: number) => void;
  clearRoom: (roomNumber: number) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: {},
  addItemToRoom: (roomNumber, product) =>
    set((state) => {
      const currentOrder = state.orders[roomNumber] || { roomNumber, items: [], totalAmount: 0 };
      const existingItem = currentOrder.items.find((item) => item.productId === product.id);

      let updatedItems: OrderItem[];
      if (existingItem) {
        updatedItems = currentOrder.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...currentOrder.items, { productId: product.id, quantity: 1, product }];
      }

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        orders: {
          ...state.orders,
          [roomNumber]: { roomNumber, items: updatedItems, totalAmount },
        },
      };
    }),

  removeItemFromRoom: (roomNumber, productId) =>
    set((state) => {
      const currentOrder = state.orders[roomNumber];
      if (!currentOrder) return state;

      const updatedItems = currentOrder.items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        orders: {
          ...state.orders,
          [roomNumber]: { roomNumber, items: updatedItems, totalAmount },
        },
      };
    }),

  clearRoom: (roomNumber) =>
    set((state) => {
      const { [roomNumber]: _, ...restOrders } = state.orders;
      return { orders: restOrders };
    }),
}));
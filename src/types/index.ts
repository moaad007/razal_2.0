export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface RoomOrder {
  roomNumber: number;
  items: OrderItem[];
  totalAmount: number;
}
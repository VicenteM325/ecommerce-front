import { CartItem } from './cart-item';
export interface Cart {
  cartId: string;
  userId: string;
  dateCreate: string;
  items: CartItem[];
  total: number;
}
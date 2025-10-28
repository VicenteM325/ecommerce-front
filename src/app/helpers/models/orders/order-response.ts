import { OrderDetail } from './order-detail';

export interface OrderResponse {
  orderId: string;
  amount: number;
  address: string;
  status: string;
  details: OrderDetail[];
}
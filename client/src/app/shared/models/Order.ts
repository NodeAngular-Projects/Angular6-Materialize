import { OrderItem } from './OrderItem';

export interface Order {
  date?: Date;
  serial?: number;
  user?: string;
  list: OrderItem[];
  _id?: string;
}
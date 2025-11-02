import { Delivery } from '../models/delivery.model';

export interface DeliveryPort {
  send(delivery: Delivery): Promise<void>;
}

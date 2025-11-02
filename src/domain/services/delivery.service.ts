import { Inject, Injectable } from '@nestjs/common';
import { Delivery } from '../models/delivery.model';
import type { DeliveryPort } from '../ports/delivery.port';

export const DELIVERY_PORT = Symbol('DELIVERY_PORT');

@Injectable()
export class DeliveryService {
  constructor(@Inject(DELIVERY_PORT) private readonly deliveryPort: DeliveryPort) {}

  async createDelivery(delivery: Delivery): Promise<void> {
    // Here you can add your business logic, like validating the delivery, etc.
    await this.deliveryPort.send(delivery);
  }
}

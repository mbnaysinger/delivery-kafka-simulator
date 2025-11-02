import { CreateDeliveryDto } from '../dtos/create-delivery.dto';
import { Delivery } from '../../domain/models/delivery.model';
import { v4 as uuidv4 } from 'uuid';

export class DeliveryConverter {
  static toModel(dto: CreateDeliveryDto): Delivery {
    const delivery = new Delivery();
    delivery.id = uuidv4();
    delivery.orderId = dto.orderId;
    delivery.customerName = dto.customerName;
    delivery.address = dto.address;
    delivery.isPriority = dto.isPriority;
    return delivery;
  }
}

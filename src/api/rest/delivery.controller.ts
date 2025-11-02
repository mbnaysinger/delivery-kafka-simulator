import { Body, Controller, Post } from '@nestjs/common';
import { DeliveryService } from '../../domain/services/delivery.service';
import { CreateDeliveryDto } from '../dtos/create-delivery.dto';
import { DeliveryConverter } from '../converters/delivery.converter';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto): Promise<void> {
    const delivery = DeliveryConverter.toModel(createDeliveryDto);
    await this.deliveryService.createDelivery(delivery);
  }
}

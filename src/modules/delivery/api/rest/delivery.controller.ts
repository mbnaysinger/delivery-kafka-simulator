import { Body, Controller, Post } from '@nestjs/common';
import { DeliveryService } from '../../domain/services/delivery.service';
import { CreateDeliveryDto } from '../dtos/create-delivery.dto';
import { DeliveryConverter } from '../converters/delivery.converter';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery' })
  @ApiResponse({ status: 201, description: 'The delivery has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto): Promise<void> {
    const delivery = DeliveryConverter.toModel(createDeliveryDto);
    await this.deliveryService.createDelivery(delivery);
  }
}

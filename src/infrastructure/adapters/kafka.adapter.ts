import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Delivery } from '../../domain/models/delivery.model';
import { DeliveryPort } from '../../domain/ports/delivery.port';

@Injectable()
export class KafkaAdapter implements DeliveryPort {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async send(delivery: Delivery): Promise<void> {
    this.kafkaClient.emit('order.created', delivery);
  }
}

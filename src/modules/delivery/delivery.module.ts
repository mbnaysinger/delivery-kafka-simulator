import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeliveryService, DELIVERY_PORT } from './domain/services/delivery.service';
import { KafkaAdapter } from './infrastructure/adapters/kafka.adapter';
import { DeliveryController } from './api/rest/delivery.controller';
import { DeliveryConsumerController } from './api/rest/delivery-consumer.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'delivery-producer',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'delivery-group',
          },
        },
      },
    ]),
  ],
  controllers: [DeliveryController, DeliveryConsumerController],
  providers: [
    DeliveryService,
    {
      provide: DELIVERY_PORT,
      useClass: KafkaAdapter,
    },
  ],
  exports: [DeliveryService],
})
export class DeliveryModule {}

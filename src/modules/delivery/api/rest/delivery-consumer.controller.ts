import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Ctx, KafkaContext, Payload } from '@nestjs/microservices';
import { Delivery } from '../../domain/models/delivery.model';

@Controller()
export class DeliveryConsumerController {
  private readonly logger = new Logger(DeliveryConsumerController.name);

  @EventPattern('order.created')
  handleOrderCreated(
    @Payload() data: Delivery,
    @Ctx() context: KafkaContext,
  ) {
    const topic = context.getTopic();
    this.logger.log(`[TOPIC: ${topic}] New Order Received: ${data.orderId}`);

    let dispatchTime = 2000;
    if (data.isPriority) {
        this.logger.warn(`*** PRIORITY Order. Accelerated dispatch. ***`);
        dispatchTime = 500;
    }

    setTimeout(() => {
        this.logger.log(`✅ Order ${data.orderId} processed for customer ${data.customerName}. Ready for dispatch to: ${data.address}.`);
    }, dispatchTime);
  }
}

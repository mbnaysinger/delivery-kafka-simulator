import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'ORD-12345', description: 'The ID of the order' })
  orderId: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the customer' })
  customerName: string;

  @ApiProperty({ example: '123 Main St', description: 'The address of the customer' })
  address: string;

  @ApiProperty({ example: true, description: 'Whether the delivery is a priority' })
  isPriority: boolean;
}

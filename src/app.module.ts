import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { DeliveryModule } from './modules/delivery/delivery.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    DeliveryModule,
  ],
})
export class AppModule {}

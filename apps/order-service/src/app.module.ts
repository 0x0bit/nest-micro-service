import { ConsulModule } from '@libs/consul';
import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ORDER_SERVICE_NAME } from '../../../proto/generated/order.interface';

@Module({
  imports: [
    ConsulModule.forRoot({
      consulHost: 'http://127.0.0.1:8500',
      token: '123456',
      service: {
        ID: 'order-service-id',
        Name: ORDER_SERVICE_NAME,
        Address: '127.0.0.1',
        Port: 3002,
      },
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

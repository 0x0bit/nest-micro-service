import { ConsulModule } from '@libs/consul';
import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConsulModule.forRoot({
      consulHost: 'http://127.0.0.1:8500',
      token: '123456',
      service: {
        ID: 'order-service-id',
        Name: 'order-service',
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

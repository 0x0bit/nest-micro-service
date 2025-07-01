import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  GetOrderByUserIdRequest,
  Order,
} from '../../../../proto/generated/order.interface';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService')
  Create(@Payload() orderDto: Order) {
    const order = this.orderService.create(orderDto);
    return { order };
  }

  @GrpcMethod('OrderService')
  FindOrderByUser(@Payload() payLoad: GetOrderByUserIdRequest) {
    const { id } = payLoad;
    const order = this.orderService.FindOrderByUser(id);
    return { order };
  }
}

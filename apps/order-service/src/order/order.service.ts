import { Injectable } from '@nestjs/common';
import { Order } from '../../../../proto/generated/order.interface';

const orders: Order[] = [
  { id: 1, user: 1, payable: 10.32, status: 1 },
  { id: 2, user: 2, payable: 10.32, status: 1 },
  { id: 3, user: 1, payable: 10.32, status: 4 },
  { id: 4, user: 3, payable: 10.32, status: 2 },
  { id: 5, user: 4, payable: 10.32, status: 3 },
];

@Injectable()
export class OrderService {
  create(createOrderDto: Order) {
    orders.push(createOrderDto);
    return createOrderDto;
  }

  FindOrderByUser(user: number) {
    return orders.filter((order) => order.user === user);
  }
}

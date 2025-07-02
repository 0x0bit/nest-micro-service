import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ORDER_PACKAGE_NAME,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from '../../../../proto/generated/order.interface';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '../../../../proto/generated/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;
  private orderService: OrderServiceClient;

  constructor(
    @Inject(USER_PACKAGE_NAME) private readonly userClient: ClientGrpc,
    @Inject(ORDER_PACKAGE_NAME) private readonly orderClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return await firstValueFrom(user);
  }

  async findAll() {
    const users = this.userService.findAll({});
    return await firstValueFrom(users);
  }

  async findOne(id: number) {
    const metadata = new Metadata();
    metadata.add('key', 'w3423');
    const user = this.userService.findOne({ id: +id }, metadata);
    return await firstValueFrom(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userService.update({ id, payload: updateUserDto });
    return await firstValueFrom(user);
  }

  async remove(id: number) {
    const user = this.userService.remove({ id });
    return await firstValueFrom(user);
  }

  async getUserOrder(id: number) {
    const order = this.orderService.findOrderByUser({ id });
    return await firstValueFrom(order);
  }
}

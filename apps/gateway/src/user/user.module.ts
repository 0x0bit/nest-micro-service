import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORDER_PACKAGE_NAME } from '../../../../proto/generated/order.interface';
import { USER_PACKAGE_NAME } from '../../../../proto/generated/user.interface';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:3001',
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/user.proto'),
        },
      },
      {
        name: ORDER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:3002',
          package: ORDER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../proto/order.proto'),
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

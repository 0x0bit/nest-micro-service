import { ConsulModule } from '@libs/consul';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { GrpcModule } from '@app/grpc';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '../../../proto/generated/user.interface';
import {
  ORDER_PACKAGE_NAME,
  ORDER_SERVICE_NAME,
} from '../../../proto/generated/order.interface';
import { CronExpression } from '@nestjs/schedule';

@Module({
  imports: [
    // 初始化consul
    ConsulModule.forRoot({
      consulHost: 'http://127.0.0.1:8500',
      token: '123456',
    }),
    // 从consul中获取注册的微服务
    GrpcModule.registerClient([
      {
        injectToken: USER_PACKAGE_NAME,
        serviceName: USER_SERVICE_NAME,
        packageName: USER_PACKAGE_NAME,
        protoPath: 'proto/user.proto',
        cron: CronExpression.EVERY_10_SECONDS,
      },
      {
        injectToken: ORDER_PACKAGE_NAME,
        serviceName: ORDER_SERVICE_NAME,
        packageName: ORDER_PACKAGE_NAME,
        protoPath: 'proto/order.proto',
        cron: '*/30 * * * * *',
      },
    ]),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

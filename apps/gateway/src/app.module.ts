import { ConsulModule } from '@libs/consul';
import { Module } from '@nestjs/common';
import { MicroClientsModule } from './micro-clients.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 初始化consul
    ConsulModule.forRoot({
      consulHost: 'http://127.0.0.1:8500',
      token: '123456',
    }),
    // 从consul中获取注册的微服务
    MicroClientsModule.register(),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

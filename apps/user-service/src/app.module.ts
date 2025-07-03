import { ConsulModule } from '@libs/consul';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConsulModule.forRoot({
      consulHost: 'http://127.0.0.1:8500',
      token: '123456',
      service: {
        ID: 'user-service-id',
        Name: 'user-service',
        Address: '127.0.0.1',
        Port: 3001,
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

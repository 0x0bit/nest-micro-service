import { ReflectionService } from '@grpc/reflection';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORDER_PACKAGE_NAME } from 'proto/generated/order.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3002;
  const grpcUrl = `0.0.0.0:${port}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: grpcUrl,
        package: ORDER_PACKAGE_NAME,
        protoPath: join(__dirname, '../../../proto/order.proto'),
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );
  await app.listen();
  console.log(`Application is running on: ${grpcUrl}`);
}

bootstrap();

import { ConsulModule, ConsulService } from '@libs/consul';
import { ResolveAddress } from '@libs/consul/interfaces/consul-service.interface';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { ClientsProviderAsyncOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { join } from 'path';
import { USER_PACKAGE_NAME } from 'proto/generated/user.interface';
import { ORDER_PACKAGE_NAME } from '../../../proto/generated/order.interface';

/**
 * 获取grpc服务连接
 * @param packageName 服务包名
 * @param serviceName 服务名称
 * @param protoFile   服务所调用的proto文件名称
 */
function createGrpcClient(
  packageName: string,
  serviceName: string,
  protoFile: string,
): ClientsProviderAsyncOptions {
  return {
    name: packageName,
    inject: [ConsulService],
    useFactory: async (consul: ConsulService): Promise<GrpcOptions> => {
      // 通过 consul 的服务发现方法获取对应服务的address和port
      const svc: ResolveAddress = await consul.resolveAddress(serviceName);
      if (!svc) throw new Error(`${serviceName} 不可用`);
      return {
        transport: Transport.GRPC,
        options: {
          url: `${svc.address}:${svc.port}`,
          package: packageName,
          protoPath: join(process.cwd(), 'proto', protoFile),
        },
      };
    },
  };
}

@Module({})
export class MicroClientsModule {
  static register(): DynamicModule {
    return {
      module: MicroClientsModule,
      global: true,
      imports: [
        ConsulModule,
        // 通过 ClientsModule 对需要调用的服务进行注册
        ClientsModule.registerAsync([
          createGrpcClient(USER_PACKAGE_NAME, 'user-service', 'user.proto'),
          createGrpcClient(ORDER_PACKAGE_NAME, 'order-service', 'order.proto'),
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}

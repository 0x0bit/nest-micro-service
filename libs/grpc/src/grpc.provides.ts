import { Logger, Provider } from '@nestjs/common';
import { GrpcClientOptions } from '@app/grpc/interfaces/grpc-client-options.interface';
import { ConsulService } from '@libs/consul';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as process from 'node:process';

/**
 * 创建 gRPC 客户端提供者的工厂函数
 * @param options - 客户端配置
 * @returns Provider
 */
export function createGrpcClientProvider(options: GrpcClientOptions): Provider {
  const logger = new Logger('createGrpcClientProvider');
  const { injectToken, serviceName, packageName, protoPath } = options;
  return {
    // 提供者的注入令牌
    provide: injectToken,
    useFactory: async (consulService: ConsulService) => {
      logger.log(`[gRPC Client] Resolving address for service: ${serviceName}`);

      // 1. 动态解析服务地址
      const serviceAddress = await consulService.resolveAddress(serviceName);
      if (!serviceAddress) {
        logger.error(
          `[gRPC Client] Could not resolve address for service: ${serviceName}. Is it running and registered in Consul?`,
        );
      }
      const { address, port } = serviceAddress;
      const url = `${address}:${port}`;
      logger.log(`[gRPC Client] Service '${serviceName}' found at ${url}`);

      // 2. 使用 ClientProxyFactory 创建 gRPC 客户端
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: packageName,
          protoPath: join(process.cwd(), 'proto', protoPath),
          url,
          // 可以在这里添加其他 gRPC 选项，例如凭证、超时等
          // loader: { keepCase: true },
        },
      });
    },
    // 3. 注入 ConsulService 以便在工厂函数中使用它
    inject: [ConsulService],
  };
}

import { Logger, Provider } from '@nestjs/common';
import { GrpcClientOptions } from './interfaces/grpc-client-options.interface';
import { ConsulService } from '@libs/consul';
import {
  ClientGrpc,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import * as process from 'node:process';
import { GrpcClientManger } from './grpc-client.manger';
import { SchedulerRegistry } from '@nestjs/schedule';

/**
 * 创建 gRPC 客户端代理的辅助函数
 * @param options - 客户端配置
 * @param url - 要连接的 URL
 * @returns ClientGrpc
 */
export function createGrpcClientProxy(
  options: GrpcClientOptions,
  url: string,
): ClientGrpc {
  const { packageName, protoPath } = options;
  return ClientProxyFactory.create({
    transport: Transport.GRPC,
    options: {
      package: packageName,
      protoPath: join(process.cwd(), protoPath),
      url: url,
    },
  });
}

/**
 * 创建 gRPC 客户端提供者的工厂函数
 * @param options - 客户端配置
 * @returns Provider
 */
export function createGrpcClientProvider(options: GrpcClientOptions): Provider {
  return {
    // 提供者的注入令牌
    provide: options.injectToken,
    useFactory: async (
      consulService: ConsulService,
      schedulerRegistry: SchedulerRegistry,
    ) => {
      const logger = new Logger('createGrpcClientProvider');
      const { serviceName } = options;
      logger.log(
        `[gRPC Client] Initializing provider for service: ${serviceName}`,
      );

      // 1. 动态解析服务地址，并在失败时抛出明确错误
      const serviceAddress = await consulService.resolveAddress(serviceName);
      if (!serviceAddress) {
        throw new Error(
          `[gRPC Client] Could not resolve initial address for service: "${serviceName}". Please ensure it is running and registered in Consul.`,
        );
      }
      const { address, port } = serviceAddress;
      const initialUrl = `${address}:${port}`;
      logger.log(
        `[gRPC Client] Service '${serviceName}' initially found at ${initialUrl}`,
      );

      // 2. 使用 ClientProxyFactory 创建 gRPC 客户端，并添加类型断言
      const initialClient = createGrpcClientProxy(options, initialUrl);

      // 3. 创建客户端状态管理器
      return new GrpcClientManger(
        initialClient,
        initialUrl,
        options,
        consulService,
        schedulerRegistry,
      );
    },
    // 注入创建 Manager 所需的依赖
    inject: [ConsulService, SchedulerRegistry],
  };
}

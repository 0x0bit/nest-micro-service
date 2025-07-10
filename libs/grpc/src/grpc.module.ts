import { DynamicModule, Module, Provider } from '@nestjs/common';
import { GrpcClientOptions } from './interfaces/grpc-client-options.interface';
import { ConsulModule } from '@libs/consul';
import { createGrpcClientProvider } from './grpc.provides';
import { ScheduleModule } from '@nestjs/schedule';

@Module({})
export class GrpcModule {
  /**
   * 注册一个或多个 gRPC 客户端
   * @param options - 客户端配置数组
   * @returns DynamicModule
   */
  static registerClient(
    options: GrpcClientOptions | GrpcClientOptions[],
  ): DynamicModule {
    const clientOptions = Array.isArray(options) ? options : [options];
    // 根据配置创建所有的 gRPC 客户端提供者
    const clientProviders = clientOptions.flatMap(
      (option): Provider => createGrpcClientProvider(option),
    );

    return {
      module: GrpcModule,
      global: true,
      imports: [ConsulModule, ScheduleModule.forRoot()],
      // 注册动态创建的提供者
      providers: [...clientProviders],
      // 导出这些提供者，以便其他模块可以注入它们
      exports: [...clientProviders],
    };
  }
}

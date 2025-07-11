import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CONSUL_OPTIONS } from './consul.constants';
import { ConsulService } from './consul.service';
import { ConsulModuleOptions } from './interfaces/consul-module.interface';
import { SERVICE_DISCOVERY_TOKEN } from '@app/grpc/interfaces/service-discovery.interface';

function createConsulProviders(
  optionsOrFactory:
    | ConsulModuleOptions
    | (() => Promise<ConsulModuleOptions> | ConsulModuleOptions),
): Provider[] {
  const providers: Provider[] = [
    ConsulService,
    // 添加一个别名 Provider, 它告诉 NestJS，当有地方需要注入 SERVICE_DISCOVERY_TOKEN 时，使用已经存在的 ConsulService 实例。
    {
      provide: SERVICE_DISCOVERY_TOKEN,
      useExisting: ConsulService,
    },
  ];
  
  typeof optionsOrFactory === 'function'
    ? providers.unshift({ provide: CONSUL_OPTIONS, useFactory: optionsOrFactory })
    : providers.unshift({ provide: CONSUL_OPTIONS, useValue: optionsOrFactory });

  return providers;
}

@Global()
@Module({})
export class ConsulModule {
  /** 同步注册 */
  static forRoot(options: ConsulModuleOptions): DynamicModule {
    const providers = createConsulProviders(options);
    return {
      module: ConsulModule,
      providers,
      exports: [ConsulService, SERVICE_DISCOVERY_TOKEN],
    };
  }

  /** 异步注册（从 ConfigService、ENV 等拿配置） */
  static forRootAsync(
    optionsFactory: () => Promise<ConsulModuleOptions> | ConsulModuleOptions,
  ): DynamicModule {
    const providers = createConsulProviders(optionsFactory);
    return {
      module: ConsulModule,
      providers,
      exports: [ConsulService, SERVICE_DISCOVERY_TOKEN],
    };
  }
}

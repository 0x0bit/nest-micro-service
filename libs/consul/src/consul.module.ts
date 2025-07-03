import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CONSUL_OPTIONS } from './consul.constants';
import { ConsulService } from './consul.service';
import { ConsulModuleOptions } from './interfaces/consul-module.interface';

@Global()
@Module({})
export class ConsulModule {
  /** 同步注册 */
  static forRoot(options: ConsulModuleOptions): DynamicModule {
    return {
      module: ConsulModule,
      providers: [
        { provide: CONSUL_OPTIONS, useValue: options },
        ConsulService,
      ],
      exports: [ConsulService],
    };
  }

  /** 异步注册（从 ConfigService、ENV 等拿配置） */
  static forRootAsync(
    optionsFactory: () => Promise<ConsulModuleOptions> | ConsulModuleOptions,
  ): DynamicModule {
    const asyncOptionsProvider: Provider = {
      provide: CONSUL_OPTIONS,
      useFactory: optionsFactory,
    };

    return {
      module: ConsulModule,
      providers: [asyncOptionsProvider, ConsulService],
      exports: [ConsulService],
    };
  }
}

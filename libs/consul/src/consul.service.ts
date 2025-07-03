import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import type { Got } from 'got';
import got from 'got';
import { CONSUL_OPTIONS } from './consul.constants';
import { ConsulModuleOptions } from './interfaces/consul-module.interface';
import {
  NodeService,
  ResolveAddress,
  ServiceRegisterOptions,
} from './interfaces/consul-service.interface';

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('ConsulService');
  private readonly request: Got;
  private readonly defServiceRegisterOptions: ServiceRegisterOptions;

  constructor(@Inject(CONSUL_OPTIONS) opts: ConsulModuleOptions) {
    this.request = got.extend({
      prefixUrl: `${opts.consulHost}/v1`,
      responseType: 'json',
      resolveBodyOnly: true,
      headers: {
        'X-Consul-Token': opts.token,
      },
    });

    // ✅ 只有传了 service 配置才保存
    if (opts.service) {
      this.defServiceRegisterOptions = opts.service;
    }
  }

  /** 🟢 模块启动时自动注册 */
  async onModuleInit() {
    if (this.defServiceRegisterOptions) {
      await this.registerService();
    }
  }

  /** 🔴 应用关闭时自动注销 */
  async onModuleDestroy() {
    if (this.defServiceRegisterOptions) {
      await this.deregisterService();
    }
  }

  /**
   * 注册服务
   */
  async registerService(opts?: ServiceRegisterOptions) {
    const registerPayload = { ...this.defServiceRegisterOptions, ...opts };
    const serviceName = registerPayload.Name;
    try {
      await this.request.put('agent/service/register', {
        json: registerPayload,
      });
      this.logger.log(
        `[Consul] Service [${serviceName}] registered successfully`,
      );
    } catch (error) {
      this.logger.error(
        `[Consul] Error registering service ${serviceName}: ${error.message}`,
      );
    }
    return true;
  }

  /**
   * 服务注销：注销注册到 Consul 的服务
   * @param serviceId 服务唯一标识
   */
  async deregisterService(serviceId?: string) {
    serviceId = serviceId ? serviceId : this.defServiceRegisterOptions.ID;
    try {
      await this.request.put(`agent/service/deregister/${serviceId}`);
      this.logger.log(
        `[Consul] Service [${serviceId}] deregistered successfully`,
      );
    } catch (error) {
      this.logger.error(
        `[Consul] Error deregistering service ${serviceId}: ${error.message}`,
      );
    }
  }

  /**
   * 服务发现：通过 Consul 查找健康服务
   * @param serviceName 服务名称
   */
  async resolveAddress(serviceName: string): Promise<ResolveAddress> {
    const res = await this.request
      .get(`health/service/${serviceName}?passing=true`)
      .json<NodeService[]>();

    if (!res.length) {
      throw new Error(`No healthy instance found for ${serviceName}`);
    }
    const node = res[0].Service;
    this.logger.log(
      `[Consul] Service [${serviceName}] get resolveAddress successfully. [${node.Address}:${node.Port}]`,
    );
    return { address: node.Address, port: node.Port };
  }
}

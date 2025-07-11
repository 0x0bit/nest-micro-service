import { Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcClientOptions } from './interfaces/grpc-client-options.interface';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { createGrpcClientProxy } from './grpc.provides';
import { IServiceDiscovery } from './interfaces/service-discovery.interface';

/**
 * @class GrpcClientManger
 * @description 包装了 gRPC 客户端，允许在运行时动态更新内部的客户端实例。
 */
export class GrpcClientManger<T extends ClientGrpc> {
  private client: T;
  private currentUrl: string;
  private readonly logger: Logger;

  constructor(
    initialClient: T,
    initialUrl: string,
    private readonly options: GrpcClientOptions,
    private readonly discoveryService: IServiceDiscovery,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.client = initialClient;
    this.currentUrl = initialUrl;
    this.logger = new Logger(`${GrpcClientManger.name}-${options.serviceName}`);
    // 启动健康检查任务
    this.startHealthCheck();
  }

  /**
   * 业务代码通过此方法获取可用的 gRPC 客户端。
   * @returns T
   */
  public getClient(): T {
    return this.client;
  }

  /**
   * 获取当前连接的 URL 地址。
   * @returns string
   */
  public getCurrentUrl(): string {
    return this.currentUrl;
  }

  /**
   * 新增方法：直接获取 gRPC 服务实例。
   * @param serviceName
   */
  public getService<TService extends object>(serviceName: string): TService {
    if (!this.client) {
      const errorMessage = 'gRPC client is not initialized, cannot get service.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    return this.client.getService<TService>(serviceName);
  }

  /**
   * 更新内部的 gRPC 客户端实例和 URL。
   * @param newClient 新的 gRPC 客户端实例
   * @param newUrl 新的 URL 地址
   */
  public updateClient(newClient: T, newUrl: string): void {
    this.logger.log(`Updating client connection from ${this.currentUrl} to ${newUrl}`);
    this.client = newClient;
    this.currentUrl = newUrl;
  }

  /**
   * 启动此客户端实例独立的健康检查任务
   */
  private startHealthCheck(): void {
    const { serviceName, cron: cronExpression } = this.options;
    if (!cronExpression) {
      this.logger.log('No cron expression provided. Skipping scheduled health checks.');
      return;
    }
    const jobName = `grpc-health-check:${serviceName}`;
    try {
      const existingJob = this.schedulerRegistry.getCronJob(jobName);
      // 如果任务确实存在，则替换它
      if (existingJob) {
        this.logger.warn(`Cron job "${jobName}" already exists. It will be replaced.`);
        this.schedulerRegistry.deleteCronJob(jobName);
      }
    } catch {
      /* empty */
    }
    const job = new CronJob(cronExpression, async () => {
      await this.reconnectIfNeeded();
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
    this.logger.log(`${serviceName} Health check scheduled with cron: "${cronExpression}"`);
  }

  private async reconnectIfNeeded(): Promise<void> {
    const { serviceName } = this.options;
    this.logger.debug(`Running ${serviceName} scheduled health check...`);
    try {
      const serviceAddress = await this.discoveryService.resolveAddress(serviceName);
      if (!serviceAddress) {
        this.logger.warn(`Could not resolve address for service: ${serviceName}.`);
        return;
      }
      const { address, port } = serviceAddress;
      const newUrl = `${address}:${port}`;
      if (this.currentUrl === newUrl) {
        return; // 地址未变，无需操作
      }
      this.logger.log(`Address changed from ${this.currentUrl} to ${newUrl}. Reconnecting...`);

      const newClient = createGrpcClientProxy(this.options, newUrl) as T;
      this.updateClient(newClient, newUrl);
    } catch (error) {
      this.logger.error(`Failed to perform health check for service "${serviceName}":`, error);
    }
  }
}

import { CronExpression } from '@nestjs/schedule';

export interface GrpcClientOptions {
  // 用于注入客户端的 token
  injectToken: string | symbol;
  // 在 Consul 中注册的服务名称
  serviceName: string;
  // proto 文件的包名
  packageName: string;
  // proto 文件相对于项目根目录的路径
  protoPath: string;
  /**
   * （新）定义此客户端的重连检查频率。
   * 如果提供此参数，模块将为此客户端创建一个定时任务，
   * 监控其在 Consul 中的地址变化并自动重连。
   */
  cron?: CronExpression | string;
}

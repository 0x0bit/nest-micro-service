import { Transport } from '@nestjs/microservices';

export interface GrpcClientOptions {
  // 用于注入客户端的 token
  injectToken: string | symbol;
  // 在 Consul 中注册的服务名称
  serviceName: string;
  // proto 文件的包名
  packageName: string;
  // proto 文件相对于项目根目录的路径
  protoPath: string;
  // （可选）自定义 Transport 类型，默认为 gRPC
  transport?: Transport.GRPC;
}

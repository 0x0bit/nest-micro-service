import { ServiceRegisterOptions } from './consul-service.interface';

export interface ConsulModuleOptions {
  /** Consul 服务器地址（含协议和端口）例如 'http://127.0.0.1:8500' */
  consulHost: string;
  /** consul登录token */
  token?: string;
  /** 当前服务注册信息 */
  service?: ServiceRegisterOptions;
}

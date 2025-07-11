/**
 * 服务发现注入令牌
 */
export const SERVICE_DISCOVERY_TOKEN = 'ServiceDiscovery';

/**
 * @interface IServiceDiscovery
 * @description 服务发现的通用接口。
 * 任何服务发现机制（如 Consul, Etcd, Zookeeper）都应实现此接口。
 */

export interface IServiceDiscovery {
  /**
   * 根据服务名称解析其可访问的 URL 地址。
   * @param serviceName - 要解析的服务名称。
   * @returns Promise<{ address: string; port: string | number } | null>, 如果找不到则返回 null。
   */
  resolveAddress(serviceName: string): Promise<{ address: string; port: string | number } | null>;
}

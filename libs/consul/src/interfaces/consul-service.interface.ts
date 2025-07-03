export interface ServiceRegisterOptions {
  ID: string; // 服务唯一标识
  Name: string; // 服务名称
  Address: string; // host/ip 服务地址
  Port: number; // 服务端口
  TAgs?: string[];
  /**
   * 健康检查配置，可自行扩展更多字段
   * 这里只演示 HTTP Check
   */
  Check?: {
    path: string; // '/health'
    interval: string; // '10s'
  };
}

export interface NodeService {
  Node: {
    ID: string;
    Node: string;
    Address: string;
    Datacenter: string;
    TaggedAddresses: string | null;
    Meta: Record<string, any>;
  };
  Service: {
    ID: string;
    Service: string;
    Tags: string[];
    Address: string;
    TaggedAddresses: Record<string, any>;
    Port: number;
  };
}

export interface ResolveAddress {
  address: string;
  port: number;
}

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const protoDir = path.resolve(__dirname, '../proto');
const outputDir = path.resolve(__dirname, '../proto/generated');
const grpcMetadataParams = true; // 是否生成grpc的原始meta参数

// 自动查找 proto 目录下所有 .proto 文件
const protoFiles = fs
  .readdirSync(protoDir)
  .filter((file) => file.endsWith('.proto'))
  .map((file) => path.join(protoDir, file))
  .join(' ');

// ts-proto 插件位置
// ts-proto关于 Nest的扩展文档 https://github.com/stephenh/ts-proto/blob/main/NESTJS.markdown
const pluginPath = path.resolve(
  __dirname,
  '../node_modules/.bin/protoc-gen-ts_proto',
);

// ts-proto 的生成参数
const tsProtoOptions = [
  'nestJs=true', // 生成符合 NestJS 风格的 interface 和服务定义（如 @nestjs/microservices 用法）
  'outputClientImpl=false', // 表示使用 grpc-web 风格的 client
  'outputEncodeMethods=false', // 不生成 encode 方法（如 MyMessage.encode()）
  'outputJsonMethods=false', // 不生成 fromJSON, toJSON 方法
  'outputPartialMethods=false', // 允许从一个部分字段的对象快速构造出一个完整合法的 protobuf 消息对象，自动为缺失的字段填上默认值
  'outputTypeRegistry=false', // 不生成类型注册代码
].join(',');

// 最终命令
const cmd = [
  'protoc',
  `--plugin=${pluginPath}`,
  `--ts_proto_opt=addGrpcMetadata=${grpcMetadataParams}`, //是否生成grpc调用时设置metadata的形参
  `--ts_proto_out=${outputDir}`,
  `--ts_proto_opt=${tsProtoOptions}`,
  `--proto_path=${protoDir}`,
  protoFiles,
].join(' ');

console.log('Executing:', cmd);
execSync(cmd, { stdio: 'inherit' });

fs.readdirSync(outputDir)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.interface.ts'))
  .forEach((file) => {
    const src = path.join(outputDir, file);
    const dest = path.join(outputDir, file.replace(/\.ts$/, '.interface.ts'));
    fs.renameSync(src, dest);
    console.log(`✅ 重命名 ${file} → ${path.basename(dest)}`);
  });

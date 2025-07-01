# about

这是一个关于nestjs的微服务学习项目

对于 nestjs 的微服务项目，官方文档并不是很好理解，而且比较简单，因此想从零到一搭建一个完整的 nestjs 微服务，通过	`gRPC ` 进行服务调用， 利用 `consul`  进行微服务的注册与发现。

为了方便管理，此项目采用 `Monorepo` 的方式组织代码。

项目结构如下：

```bash
.
├── proto  # 存储proto文件
├── scripts # 存储服务脚本
├── apps
│   ├── gateway
│   │   ├── src
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   └── tsconfig.app.json
│   ├── order-service
│   │   ├── src
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   └── user
│   │   │       ├── user.controller.ts
│   │   │       ├── user.module.ts
│   │   │       └── user.service.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   └── tsconfig.app.json
│   └── user-service
│       ├── src
│       │   ├── app.module.ts
│       │   ├── main.ts
│       │   └── user
│       │       ├── user.controller.ts
│       │       ├── user.module.ts
│       │       └── user.service.ts
│       ├── test
│       │   ├── app.e2e-spec.ts
│       │   └── jest-e2e.json
│       └── tsconfig.app.json
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

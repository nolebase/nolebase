---
tags:
  - 开发/Monorepo
  - 开发/Nodejs
---
# Monorepo

> 这里可能会写一篇关于如何构建 Vite Vue 生态下的 Monorepo 的文档

参考资料：

- [汪图南博客 Monorepo](https://wangtunan.github.io/blog/vueNextAnalysis/monorepo/)
- [All in one：项目级 monorepo 策略最佳实践（淘系前端团队）](https://fed.taobao.org/blog/taofed/do71ct/uihagy/)
- [pnpm 文档：工作空间（Workspace）](https://pnpm.io/zh/workspaces)

## 命令速查

#### 创建子包

注意此处是 `npm`，不是 `pnpm`

```sh
npm init -w <path>
# 例子
npm init -w packages/core
```

### 安装依赖性

#### 工作区依赖

```sh
pnpm add -w <pkg>
# 例子
pnpm add -w vite
```

#### 子包依赖

向子包安装依赖将用到[**过滤** `--filter`](https://pnpm.io/zh/filtering)  参数，此参数功能较多，这里只是列举一种用法。

```sh
pnpm -F <package_name> add <pkg>
# 例子
pnpm -F ./packages/web add vue
```

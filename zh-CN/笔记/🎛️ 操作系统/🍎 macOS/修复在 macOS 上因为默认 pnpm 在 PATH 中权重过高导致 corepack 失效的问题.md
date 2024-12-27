---
tags:
  - 操作系统/macOS
  - 开发/Nodejs/pnpm
  - 开发/Nodejs/npm
  - 开发/Nodejs
  - 命令行
  - 开发/Nodejs/corepack
  - 命令行/corepack
  - 命令行/npm
  - 命令行/pnpm
---
# 修复在 macOS 上因为默认 `pnpm` 在 `PATH` 中权重过高导致 `corepack` 失效的问题

今天用着用着 macOS 发现 [@antfu/ni](https://github.com/antfu/ni)的 `nr` 子命令突然不工作了，然后 `pnpm` 回退到了 `8.6.12` 的系统全局 `pnpm` 版本，就算是项目的 `package.json` 已经写了 `"packageManager": "pnpm@8.5.14"`，确认了 `corepack` 存在，并且已经激活，甚至主动使用了 `corepack prepare <package> --activate` 都无法使用项目内指定的 `pnpm`。

在反复搜索之后，还是决定去阅读一下 `corepack` 的官方文档，在参考了 `corepack` 的文档后 [corepack/README.md at main · nodejs/corepack](https://github.com/nodejs/corepack/blob/main/README.md)，发现官方文档建议把全局的 pnpm 卸载删除了：

```shell
npm uninstall -g yarn pnpm
```

如果是用 `pnpm` 自己安装的 `pnpm`，可以用这个命令移除：

```shell
pnpm uninstall -g pnpm
```

接下来重新确认一下 `npm` 侧的 `corepack` 是存在的：

```shell
npm install -g corepack
```

然后激活 `corepack`：

```shell
corepack enable
```

如果希望直接用 `pnpm` 的 8.15.4 版本的话，可以直接运行下面的命令来下载和准备好：

```shell
corepack prepare pnpm@8.15.4 --activate
```


# apidoc 安装

此教程默认已安装 Node.js 环境

## 安装

```shell
pnpm install -g apidoc@0.19.0
```

## 使用

命令说明：

1. 参数 `i` 表示扫描的目录
2. 参数 `p` 表示输出 apidoc 文件的目录

```shell
apidoc -i ./ -o ../apidoc/<项目名称>/
```

## 暴露为外部可访问服务器

使用 `serve` 命令打开一个网页服务器
命令说明：

1. 参数 `l`，表示监听的端口

```shell
serve -l <端口> ../apidoc/<项目名称>/
```

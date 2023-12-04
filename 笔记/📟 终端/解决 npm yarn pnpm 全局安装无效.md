---
tags:
  - 开发/Nodejs
  - 开发/Nodejs/npm
  - 开发/Nodejs/pnpm
  - 开发/Nodejs/yarn
  - 操作系统/macOS
  - 操作系统/Linux
  - 操作系统/Windows
---
# 解决 npm yarn pnpm 全局安装无效

把 `npm` 或 `yarn` 的执行目录添加到 `PATH` 就行了。

## 查看 `bin` 文件夹所在位置

执行下面的命令可以查看目录位置, 把输出的路径信息添加到 `npm` 或 `yarn` 的执行程序目录。

```shell
npm bin -g      # npm
pnpm bin -g     # pnpm
yarn global bin # yarn
```

## 将 `bin` 添加到 `PATH` 中

### 在 Mac 和 Linux 下

> 如果使用 `zsh` 请将命令中出现的所有 `profile` 替换为 `zprofile`
> 权限不足时在命令开头添加 `sudo` 命令，使用管理员权限运行

在终端中执行下面的命令打开系统配置文件（暂且称为系统配置文件吧）

```sh
vim /etc/profile
```

在最下面加入一行

```sh
PATH="要添加到系统执行路径的路径:$PATH"
```

保存后执行下面的命令刷新系统配置就可以生效了

```sh
source /etc/profile
```

### 在 Windows 下

1. 按Win+R键打开运行窗口
2. 输入下面的命令， 回车

```shell
SystemPropertiesAdvanced
```

3. 点击“环境变量”
4. 双击 系统变量 > PATH
5. 点击“新建”
6. 输入要添加到系统的执行路径，点击“确定”就行了

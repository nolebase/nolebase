---
tags:
  - 命令行/curl
  - 开源/软件/bash
  - 开源/软件/zsh
  - 运维
  - 计算机/操作系统/Linux
  - 操作系统/Linux
  - 计算机/操作系统/Linux/命令行
---
# 获取当前 Unix 机器的公网 IP 地址

## 先决条件

- 需要安装 `curl`

## 在 `.bashrc` 或者 `.zshrc` 中配置获取 IP 时使用的 alias

```shell
# 获取海外 IP
alias globalip="curl -s http://api.myip.la | grep -E -o '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}'"
# 获取国内 IP
alias chinaip="curl -s https://myip.ipip.net | grep -E -o '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}'"
alias getip='echo "国内 IPv4: $(chinaip)" && echo "海外 IPv4: $(globalip)"'
```

## 配置更短的 alias

```shell
# 获取海外 IP
alias globalip="curl -s http://api.myip.la | grep -E -o '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}'"
# 获取海外 IP 的别名
alias gip="globalip" # [!code ++]

# 获取国内 IP
alias chinaip="curl -s https://myip.ipip.net | grep -E -o '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}'"
# 获取国内 IP 的别名
alias cip="chinaip" # [!code ++]

alias getip='echo "国内 IPv4: $(chinaip)" && echo "海外 IPv4: $(globalip)"'
# 表示 all ip
alias aip="getip" # [!code ++]
```

## 用法

### 获取海外 IP

```shell
$ globalip
54.1.1.100
```

如果你配置了 alias 的话还可以：

```shell
$ gip
54.1.1.100
```

### 获取国内 IP

```shell
$ chinaip
222.1.1.30
```

```shell
$ cip
222.1.1.30
```

### 获取全部 IP

```shell
$ getip
国内 IPv4: 222.1.1.30
海外 IPv4: 54.1.1.100
```

```shell
$ aip
国内 IPv4: 222.1.1.30
海外 IPv4: 54.1.1.100
```

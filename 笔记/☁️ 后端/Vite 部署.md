## 安装和配置

### 安装前置软件

此处需要安装 Nginx（HTTP 网页服务器），Vim（编辑器，不喜欢的话可以换成 nano），Git（命令行管理），node（Node.js 环境），pnpm（包管理器）

```shell
$ sudo yum install epel-release -y
$ sudo yum update -y
$ sudo yum install nginx vim git -y
```

#### 安装 Node.js

导入 Node14 仓库和配置（和下面的 Node16 二选一）

```shell
curl -fsSL https://rpm.nodesource.com/setup_14.x | sudo bash -
```

导入 Node16 仓库和配置

```shell
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
```

执行完之后执行安装 nodejs 本体：

```shell
$ sudo yum install nodejs gcc-c++ make -y
```

安装 pnpm：

```shell
$ sudo npm install -g pnpm
```

### 设定 Nginx 服务为开机自启，并且开始运行

```shell
$ sudo systemctl enable nginx
$ sudo systemctl start nginx
```

运行后应该可以从 http://IP:80 的访问到初始的网站
如果访问不到，可以看一下防火墙配置

### 防火墙配置

#### 检查 iptables

1. 先检查 iptables（一个老牌防火墙服务）是否在运行

```shell
$ sudo systemctl status iptables
```

如果运行命令后提示 `Unit iptables.service could not be found.` 则表示服务不存在
如果找到了服务的话会有这样的提示：

```shell
● iptables.service - iptables
   Loaded: loaded (/usr/lib/systemd/system/iptables.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
```

第三行会有一个 Active 字段，如果结尾是 dead 则表示不在运行，否则会有绿色的 `Active: active (running)` 字样

如果正在运行的话可以使用以下命令允许 80 端口流量：
以下命令的含义是： **使用 iptables 命令添加允许（ACCEPT） 80 端口的 TCP 流量**

```shell
$ sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
```


#### 检查 firewalld

2. 检查 firewalld（现在主流防火墙服务）是否在运行

```shell
$ sudo systemctl status firewalld
```

如果运行命令后提示 `Unit firewalld.service could not be found.` 则表示服务不存在
如果找到了服务的话会有这样的提示：

```shell
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
     Docs: man:firewalld(1)
```

第三行会有一个 Active 字段，如果结尾是 dead 则表示不在运行，否则会有绿色的 `Active: active (running)` 字样

如果正在运行的话可以使用以下命令允许 80 端口流量：
以下命令的含义是： **使用 firwall-cmd 在 public 域永久（permanent）添加允许 80 端口的 TCP 流量**

```shell
$ sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
```


## 准备前端

### 克隆并编译

#### 克隆

```shell
$ git clone <仓库地址>
```

#### 编译

对于 vitesse 而言，直接运行 pnpm build 就好了

```shell
$ pnpm build
```
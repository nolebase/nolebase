# WireGuard 配置服务器

## 配置

### 创建必要的配置目录

WireGuard 的配置目录一般在 `/etc/wireguard`，但是不同的系统也会有不同的路径：

#### Linux

```shell
sudo mkdir /etc/wireguard
```

#### macOS

```shell
sudo mkdir /usr/local/etc/wireguard
```

#### Windows

```ad-warning
title: 警告
🚧 施工中
```

### 创建公私密钥对

#### Linux

```shell
wg genkey | sudo tee /etc/wireguard/privatekey | wg pubkey | sudo tee /etc/wireguard/publickey
```

#### macOS

```shell
wg genkey | sudo tee /usr/local/etc/wireguard/privatekey | wg pubkey | sudo tee /usr/local/etc/wireguard/publickey
```

#### Windows

```ad-warning
title: 警告
🚧 施工中
```

### 创建一个新的 WireGuard 网络接口配置文件

#### 创建配置文件

WireGuard 的 VPN 网络都是通过自行配置网络接口并自动连接实现的，网络接口中设定了诸如我们的 IP、DNS、监听端口等等的参数，这些字段和常规的网络接口配置几乎是一致的。
一般我们把第一个 WireGuard 网络接口称之为 `wg0`，来自 WireGuard 的缩写 `wg` 和数字 `0`，表示：第 0 位 WireGuard 网络设备。
使用 [[Vim 编辑器]] 创建一个对应的 WireGuard 网络接口配置文件 `wg0.conf` 到 `/etc/wireguard`目录下：

```bash
sudo vim /etc/wireguard/wg0.conf
```

#### 填写配置文件

写入接口配置信息：

```bash
[Interface]
Address = 10.0.0.1/24
SaveConfig = true
ListenPort = 51820
PrivateKey = SERVER_PRIVATE_KEY
PostUp     = firewall-cmd --zone=public --add-port 51820/udp && firewall-cmd --zone=public --add-masquerade
PostDown   = firewall-cmd --zone=public --remove-port 51820/udp && firewall-cmd --zone=public --remove-masquerade
```

该接口可以命名为任意名称，但建议使用诸如include `wg0`或`wgvpn0`之类的名称。 网络接口 **`[Interface]`** 部分中的设置具有以下含义：

1. **Address**: `wg0`接口的 IPv4 或 IPv6 地址的逗号分隔列表。使用保留给专用网络的范围内的 IP（10.0.0.0/8（包含 10.0.0.0 到 10.255.255.255）、172.16.0.0/12（包含 172.16.0.0 到 172.15.255.255）或 192.168.0.0/16（包含 192.168.0.0 到 192.168.255.255）这样的 IP 格式是什么样的含义可以参考 [[IP 后面的斜杠是什么？]]）
2. **ListenPort**: 在其上使用的端口 WireGuard 将接受传入的连接。
3. **PrivateKey**: 由`wg genkey`命令生成的私钥。 （使用 [[cat 输出文件]] 命令获取私钥文件的内容：`sudo cat /etc/wireguard/privatekey`）
4. **SaveConfig**: 设置为 `true` 时，关闭接口时的当前状态保存到配置文件中。
5. **（可选）PostUp**: （可选，尤其是在防火墙服务不启动的时候）在启动网络接口 **`[Interface]`** 之前执行的命令或脚本。在此示例中，我们使用 `firewall-cmd`（参考 [[🚧  firewalld 防火墙配置]]）打开 WireGuard 端口并启用伪装。
6. **（可选）PostDown**: （可选，尤其是在防火墙服务不启动的时候）在关闭接口之前执行的命令或脚本，这将允许流量离开服务器，从而使VPN客户端可以访问互联网。网络接口 **`[Interface]`** 关闭后，防火墙规则（参考 [[🚧  firewalld 防火墙配置]]）将被删除。

#### 调整配置文件权限

`wg0.conf`和`privatekey`文件对普通用户不可读。
使用 `chmod` （参考 [[chmod 变更权限]]）将权限设置为`600`：

```shell
sudo chmod 600 /etc/wireguard/{privatekey,wg0.conf}
```

### 测试配置

使用 `wg-quick` 命令快速将我们刚刚配置好的 `wg0` 接口设定为「启用」：

```shell
sudo wg-quick up wg0
```

该命令将输出以下内容：

```shell
[#] ip link add wg0 type wireguard
[#] wg setconf wg0 /dev/fd/63
[#] ip -4 address add 10.0.0.1/24 dev wg0
[#] ip link set mtu 1420 up dev wg0
```

要查看接口状态和配置，请运行：

```bash
sudo wg show wg0

interface: wg0
  public key: My3uqg8LL9S3XZBo8alclOjiNkp+T6GfxS+Xhn5a40I=
  private key: (hidden)
  listening port: 51820
```

也可以使用 [[🚧  ip 网络配置]] 命令来验证接口状态：

```bash
ip a show wg0

4: wg0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none 
    inet 10.0.0.1/24 scope global wg0
       valid_lft forever preferred_lft forever
```

### 激活开机自启

要在启动时自动启用 `wg0` 网络接口 **`[Interface]`**，请运行以下命令：

```shell
sudo systemctl enable wg-quick@wg0
```

### 配置 IPv4 转发

要使NAT正常工作，我们需要启用IP转发：
该命令配置系统选项 `net.ipv4.ip_forward` 值为 1，表示开启 ipv4 协议下 IP 转发

```shell
sudo sysctl -w net.ipv4.ip_forward=1
```

## 错误排查

### `/usr/bin/wg-quick: line 32: resolvconf: command not found`

Debian 11 如果在使用 `wg-quick up <interface>` 的时候遭遇以下错误：

```shell
/usr/bin/wg-quick: line 32: resolvconf: command not found
```

可以通过下面的命令修复：

```shell
sudo apt install openresolv
```

参见：
https://superuser.com/a/1546280
https://github.com/StreisandEffect/streisand/issues/1434#issuecomment-417792239
# WireGuard VPN 多用户管理

此教程默认已安装和配置过 WireGuard 服务端，如果没有，可以前往 [WireGuard 安装](WireGuard%20%E5%AE%89%E8%A3%85.md) 进行安装和 [WireGuard 配置](WireGuard%20%E9%85%8D%E7%BD%AE.md) 进行配置。

## 概述

其实 WireGuard 的多用户配置特别简单，只需要生成一对客户端密匙（公匙+私匙），在服务端配置文件中新增一段 **`[Peer]`** 写上**新的客户端公匙 `PublicKey` 和客户端的内网 IP 地址**  `Endpoint` 即可。
当然我们可以用命令快捷添加，或者手动修改服务端配置文件也行。
而各客户端账号配置文件的区别也只是 **`[Interface]`** 中的**客户端私匙和客户端内网 IP 地址**不同罢了。

**另外我们需要明白一个对等原则：**

-   服务端配置文件中的 **`[Interface]`** 是保存自己的服务端私匙，而客户端配置文件中的 **`[Interface]`** 同样保存自己的客户端私匙。
-   服务端配置文件中的 **`[Peer]`** 是保存客户端的公匙，而客户端配置文件中的 **`[Peer]`** 是保存服务端的公匙。
-   即，服务端与客户端都是互相保存自己的私匙在 **`[Interface]`** 中，互相保存对方公匙在 **`[Peer]`** 中。

## 服务端配置文件添加用户

以下步骤是动态添加客户端配置（**以下配置前提是你已经配置过 WireGuard 配置文件并启动了**）。
你也可以手动修改配置文件 **`/etc/wireguard/wg0.conf`**，记得修改完重启一下。以下动态添加无需重启。

### 重新生成一对客户端密匙

privatekey1 为客户端私匙，publickey1 为客户端公匙

```shell
$ wg genkey | sudo tee cprivatekey1 | wg pubkey > sudo cpublickey1
```

### 服务器上执行添加客户端配置代码（新增一个 `[peer]`）：

命令说明
1. `$(cat cpublickey1)` 使用 [cat 输出文件](cat%20%E8%BE%93%E5%87%BA%E6%96%87%E4%BB%B6.md) 命令获取客户端公匙
2. `10.0.0.3/32` 这个是客户端内网IP地址，按序递增最后一位（.3）)，不要重复

```shell
$ sudo wg set wg0 peer $(cat cpublickey1) allowed-ips 10.0.0.3/32
```

### 查看 WireGuard 状态

```shell
$ sudo wg
interface: wg0
  public key: xxxxxxxxxxxxxxxxx #服务端私匙
  private key: (hidden)
  listening port: 443
 
peer: xxxxxxxxxxxxxxxxxxxx #旧客户端账号的公匙
  allowed ips: 10.0.0.2/32 #旧客户端账号的内网IP地址
 
peer: xxxxxxxxxxxxxxxxxxxx #新客户端账号的公匙
  allowed ips: 10.0.0.3/32 #新客户端账号的内网IP地址
```

以上内容仅为输出示例（仅供参考）

### 如果显示正常，那么我们就保存到配置文件

```shell
$ sudo wg-quick save wg0
```

## 生成对应客户端配置文件

新客户端配置文件，和其他客户端账号的配置文件只有 `[Interface]` 中的客户端私匙、内网IP地址参数不一样。

下面是配置文件的填写说明：

```ini 
[Interface]
# 客户端的私匙，对应服务器配置中的客户端公匙（自动读取上面刚刚生成的密匙内容）
PrivateKey = <上面创建的 privatekey1>
# 客户端监听端口，一般为 51820
ListenPort = 51820
# 客户端的内网IP地址（如果上面你添加的内网IP不是 .3 请自行修改）
Address = 10.0.0.3/24
# 解析域名用的DNS
DNS = 8.8.8.8
# 保持默认
MTU = 1420

[Peer]
# 服务器的公匙，对应服务器的私匙（自动读取上面刚刚生成的密匙内容）
PublicKey = <找管理员要>
# 服务器地址和端口，下面的 X.X.X.X 记得更换为你的服务器公网IP，端口请填写服务端配置时的监听端口
Endpoint = X.X.X.X:443
# 鉴于不同的使用场景，作为客户端有两种设定方案
# 1. 设置为全部 IP 段，可以转发所有流量，就像是以前 VPN 的工作模式
# AllowedIPs = 0.0.0.0/0, ::0/0
# 2. 设置为特定的 IP 段，可以转发特定 IP 的流量，适用于内网和子网
# 比如内网的网段是 10.10.0.0，则可以填写为 10.10.0.0/24
AllowedIPs = 10.0.0.0/24
# 保持连接，如果客户端或服务端是 NAT 网络(比如国内大多数家庭宽带没有公网IP，都是NAT)，那么就需要添加这个参数定时链接服务端(单位：秒)，如果你的服务器和你本地都不是 NAT 网络，那么建议不使用该参数（设置为0，或客户端配置文件中删除这行）
PersistentKeepalive = 25
```

填写好之后可以把上面的内容复制并粘贴到下面命令中对应的地方：
命令说明：
1. `echo` 可以把字符串输出给管道符 `|`
2. `sed '/^#/d;/^\s*$/d'` 可以过滤输出 `#` 开头的行
3. `wg0.conf` 是 WireGuard 的配置文件，根据不同的系统，可以放到不同的目录：
    - Windows: ``
    - macOS: `/usr/local/etc/wireguard/wg0.conf`
    - Linux: `/etc/wireguard/wg0.conf`

```shell
$ sudo echo "<配置文件内容>" | sed '/^#/d;/^\s*$/d' > wg0.conf
```

## 服务端配置文件删除用户


要删除呢也很简单，首先你需要知道你要删除用户的客户端公匙（例如上面刚刚生成的 `publickey1`）。
当然，你也可以手动打开配置文件删除，记得修改后重启。下面的动态删除无需重启。

1. 如果客户端公匙文件还在，那么可以执行这个命令删除：

```shell
$ sudo wg set wg0 peer $(cat cpublickey1) remove
```

**注意：该命令执行后，就可以跳过下面这段命令了，直接保存配置文件即可。**

2. 如果客户端公匙文件已删除，那么可以通过 wg 命令看到客户端的公匙：
```shell
$ sudo wg
  interface: wg0
    public key: xxxxxxxxxxxxxxxxx #服务端私匙
    private key: (hidden)
    listening port: 443

  peer: xxxxxxxxxxxxxxxxxxxx #客户端账号的公匙
    allowed ips: 10.0.0.2/32 #客户端账号的内网IP地址

  peer: xxxxxxxxxxxxxxxxxxxx #客户端账号的公匙
    allowed ips: 10.0.0.3/32 #客户端账号的内网IP地址
```

以上内容仅为输出示例（仅供参考）

复制你要删除的客户端账号的公匙（`peer` 后面的字符），替换下面命令中的 xxxxxxx 并执行即可
```shell
$ sudo wg set wg0 peer xxxxxxx remove
```

执行后，我们在用 `wg` 命令查看一下是否删除成功：

```shell
$ sudo wg-quick save wg0
```

---
tags:
  - 计算机/网络/WireGuard
  - 计算机/网络/VPN/WireGuard
  - 计算机/操作系统/Linux
  - 计算机/操作系统/Linux/命令行
  - 操作系统/Linux
  - 命令行
  - 命令行/sed
  - 计算机/网络
  - 数学/密码学/非对称加密
  - 操作系统/macOS
  - 操作系统/Windows
---
# WireGuard VPN 多用户管理

此教程默认已安装和配置过 WireGuard 服务端，如果没有，可以前往 [WireGuard 安装](WireGuard%20%E5%AE%89%E8%A3%85.md) 进行安装和 [WireGuard 配置](WireGuard%20%E6%9C%8D%E5%8A%A1%E7%AB%AF%E9%85%8D%E7%BD%AE.md) 进行配置。

## 概述

其实 WireGuard 的多用户配置特别简单，只需要生成一对客户端密匙（公钥+私钥），在服务端配置文件中新增一段 **`[Peer]`** 写上**新的客户端公钥 `PublicKey` 和客户端的内网 IP 地址**  `Endpoint` 即可。
当然我们可以用命令快捷添加，或者手动修改服务端配置文件也行。
而各客户端账号配置文件的区别也只是 **`[Interface]`** 中的**客户端私钥和客户端内网 IP 地址**不同罢了。

**另外我们需要明白一个对等原则：**

- 服务端配置文件中的 **`[Interface]`** 是保存自己的服务端私钥，而客户端配置文件中的 **`[Interface]`** 同样保存自己的客户端私钥。
- 服务端配置文件中的 **`[Peer]`** 是保存客户端的公钥，而客户端配置文件中的 **`[Peer]`** 是保存服务端的公钥。

即：服务端与客户端都是互相保存自己的私钥在 **`[Interface]`** 中，互相保存对方公钥在 **`[Peer]`** 中。

## 客户端生成新的连接用密钥

以下步骤是动态添加客户端配置（**以下配置前提是你已经配置过 WireGuard 配置文件并启动了**）。
你也可以手动修改配置文件 **`/etc/wireguard/wg0.conf`**，记得修改完重启一下。以下动态添加无需重启。

### 重新生成一对客户端密匙

你可以运行下面的命令来生成客户端用的配置文件到当前所在目录：

```shell
wg genkey | tee cprivatekey1 | wg pubkey | tee cpublickey1
```

命令说明：

1. `cprivatekey1` 为客户端私钥
2. `cpublickey1` 为客户端公钥。

如果你想放到另一个目录中也可以，只要在配置 `wg0.conf` 或者说 WireGuard 的配置文件的时候能够查看到内容即可：

::: code-group

```shell [多行]
mkdir -p $HOME/.config/wireguard
wg genkey | tee $HOME/.config/wireguard/cprivatekey1 | wg pubkey | tee $HOME/.config/wireguard/cpublickey1
```

```shell [单行]
mkdir -p $HOME/.config/wireguard && wg genkey | tee $HOME/.config/wireguard/cprivatekey1 | wg pubkey | tee $HOME/.config/wireguard/cpublickey1
```

:::

## 服务端配置文件添加用户

### 服务器上执行添加客户端配置代码（新增一个 `[peer]`）

你可以把上一步生成的 `cpublickey1` 或者 `$HOME/.config/wireguard/cpublickey1` 放到服务端存起来：

::: code-group

```shell [多行]
mkdir /etc/wireguard/clients/
echo "<之前在客户端上生成的 cpublickey1 的内容>" > /etc/wireguard/clients/cpublickey1
```

```shell [单行]
mkdir /etc/wireguard/clients/ && echo "<之前在客户端上生成的 cpublickey1 的内容>" > /etc/wireguard/clients/cpublickey1
```

:::

然后我们在服务端这边添加需要的 `[Peer]`

::: code-group

```shell [以非 root 用户执行]
sudo wg set wg0 peer $(cat /etc/wireguard/clients/cpublickey1) allowed-ips 10.0.0.3/32
```

```shell [以 root 用户执行]
wg set wg0 peer $(cat /etc/wireguard/clients/cpublickey1) allowed-ips 10.0.0.3/32
```

命令说明：

1. `$(cat /etc/wireguard/clients/cpublickey1)` 使用 [cat 输出文件](../../../%F0%9F%93%9F%20%E7%BB%88%E7%AB%AF/Linux%20%E5%91%BD%E4%BB%A4/%E6%96%87%E6%A1%A3%E8%AF%BB%E5%86%99/cat%20%E8%BE%93%E5%87%BA%E6%96%87%E4%BB%B6.md) 命令获取客户端公钥
2. `10.0.0.3/32` 这个是客户端和服务端的内网 IP 地址，请参考自己的服务端配置的 `AllowedIPs` 字段的值来进行配置，按序递增最后一位（`.3`），服务端与众客户端不能配置为重复的 IP

:::
### 配置服务端的 WireGuard 接口

你可以使用 `wg` 来查看现有的 WireGuard 的网络接口的配置和状态：

```shell
$ sudo wg
interface: wg0
  public key: ******************** # 服务端公钥
  private key: (hidden)
  listening port: 443

peer: ******************** # 旧客户端账号的公钥
  allowed ips: 10.0.0.2/32 # 旧客户端账号的内网 IP 地址

peer: ******************** # 新客户端账号的公钥
  allowed ips: 10.0.0.3/32 # 新客户端账号的内网 IP 地址
```

以上内容仅为输出示例（仅供参考）

如果服务端侧 WireGuard 配置符合预期，那么我们就保存到配置文件：

```shell
sudo wg-quick save wg0
```

## 为客户端添加用于连接到服务端的配置文件

新客户端配置文件，和其他客户端账号的配置文件只有 `[Interface]` 中的客户端私钥、内网 IP 地址参数不一样。

下面是配置文件的填写说明：

```ini
[Interface]
# 客户端的私钥，对应服务器配置中的客户端公钥（自动读取上面刚刚生成的密匙内容）
PrivateKey = <上面创建的 cprivatekey1 的内容>
# 客户端监听端口，一般为 51820
ListenPort = 51820
# 客户端的内网IP地址（如果上面你添加的内网IP不是 .3 请自行修改）
Address = 10.0.0.3/24
# 解析域名用的DNS
DNS = 8.8.8.8
# 保持默认
MTU = 1420

[Peer]
# 服务器的公钥，对应服务器的私钥（自动读取上面刚刚生成的密匙内容）
PublicKey = <服务端的公钥，可以在服务端上执行 wg 命令来获取>
# 服务器地址和端口，下面的 X.X.X.X 记得更换为你的服务器公网IP，端口请填写服务端配置时的监听端口
Endpoint = <服务端公网 IP 或者可被客户端连接的 IP>:<服务端配置的 ListenPort>
# 鉴于不同的使用场景，作为客户端有两种设定方案
# 1. 设置为全部 IP 段，可以转发所有流量，就像是以前 VPN 的工作模式
# AllowedIPs = 0.0.0.0/0, ::0/0
# 2. 设置为特定的 IP 段，可以转发特定 IP 的流量，适用于内网和子网
# 比如内网的网段是 10.10.0.0，则可以填写为 10.10.0.0/24
# 请务必保持与服务端一致
AllowedIPs = 10.0.0.0/24
# 保持连接，如果客户端或服务端是 NAT 网络(比如国内大多数家庭宽带没有公网IP，都是NAT)，
# 那么就需要添加这个参数定时链接服务端(单位：秒)，如果你的服务器和你本地都不是 NAT 网络，
# 那么建议不使用该参数（设置为0，或客户端配置文件中删除这行）
PersistentKeepalive = 25
```

> [!NOTE] 想要直接复制粘贴上面的示例配置文件？
>
> 接口配置文件中不允许出现 `#` 字符，这里我们可以把上面的内容复制并粘贴到本地的 `wg0-client.conf`，并且填写好之后，添加到到下面命令中对应的地方：
>
> ::: code-group
>
> ```shell [以非 root 用户执行]
> cat wg0-client.conf | sed '/^#/d;/^\s*$/d' | sudo tee wg0.conf
> ```
>
> ```shell [以 root 用户执行]
> cat wg0-client.conf | sed '/^#/d;/^\s*$/d' | tee wg0.conf
> ```
> :::
>
> 命令说明：
>
> 1. `cat` 可以读取预先配置好的带注释的文件作为字符串输出给管道符 `|` 并传递给下一个命令，在这里，下一个命令为 `sed`
> 2. `sed '/^#/d;/^\s*$/d'` 可以过滤输出 `#` 开头的行和空行
> 3. `wg0.conf` 是 WireGuard 的配置文件，根据不同的系统，可以放到不同的目录：
>     - Windows: ``（我还没有部署过，之后会更新到这里）
>     - macOS: `/usr/local/etc/wireguard/wg0.conf`
>     - 计算机/操作系统/Linux: `/etc/wireguard/wg0.conf`

## 服务端配置文件删除用户

要删除呢也很简单，首先你需要知道你要删除用户的客户端公钥（例如上面刚刚生成的 `cpublickey1`）。
当然，你也可以手动打开配置文件删除，记得修改后重启。下面的动态删除无需重启。

### 1. 如果客户端公钥文件还在

可以执行这个命令删除：

::: code-group

```shell [以非 root 用户执行]
sudo wg set wg0 peer $(cat cpublickey1) remove
```

```shell [以 root 用户执行]
wg set wg0 peer $(cat cpublickey1) remove
```

:::

**注意：该命令执行后，就可以跳过下面这段命令了，直接保存配置文件即可。**

### 2. 如果客户端公钥文件已删除

可以通过 `wg` 命令看到客户端的公钥：

```shell
$ sudo wg
  interface: wg0
    public key: ******************** #服务端公钥
    private key: (hidden)
    listening port: 443

  peer: ******************** #客户端账号的公钥
    allowed ips: 10.0.0.2/32 #客户端账号的内网IP地址

  peer: ******************** #客户端账号的公钥
    allowed ips: 10.0.0.3/32 #客户端账号的内网IP地址
```

以上内容仅为输出示例（仅供参考）

复制你要删除的客户端账号的公钥（`peer` 后面的字符），替换下面命令中的 `xxxxxxx` 并执行即可

::: code-group

```shell [以非 root 用户执行]
sudo wg set wg0 peer <客户端账号的公钥（peer 字样后面的字符）> remove
```

```shell [以 root 用户执行]
wg set wg0 peer <客户端账号的公钥（peer 字样后面的字符）> remove
```

:::

执行后，我们在用 `wg-quick` 命令保存和提交状态：

::: code-group

```shell [以非 root 用户执行]
sudo wg-quick save wg0
```

```shell [以 root 用户执行]
wg-quick save wg0
```

:::

然后可以用 `wg` 来查看是否配置完成。



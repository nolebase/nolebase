---
tags:
  - 开源/软件/rclone
  - 命令行/rclone
  - 命令行/ssh
  - 命令行/ssh-add
  - 命令行/op
  - 计算机/信息技术/安全/密码管理器/1Password
  - 计算机/网络/协议/SFTP
  - 计算机/网络/协议/SSH
  - 命令行/systemd
---
# 在配置 1Password 作为 SSH Agent 的环境中 `rclone` 的 SFTP 集成会提示 Too many authentication failures 错误

## TL;DR

配置 `sshd` 的 `MaxAuthTries` 选项即可：

```ssh-config
# MaxAuthTries 6 # [!code --]
MaxAuthTries 20 # [!code ++]
```

## 说明

最近在做一些 `rclone` 相关的集成开发，在尝试使用 `rclone` 的 SFTP 协议集成的时候先是遇到了太长时间之后 `rclone` 无响应的问题：

```shell
rclone ls test-ssh:
```

我的配置是这样的

```toml
[test-ssh]
type = sftp
user = <用户名>
host = <服务器 IP>
```

`rclone` 有支援通过 `-v` 和和多个 `v` 的 `-vvv` 来打印更详尽的日志输出的功能，打印和观察了之后发现它一直在遇到 Too many authentication failures 的错误问题：

```shell
❯ rclone ls test-ssh: -vvv
2023/12/11 18:07:52 DEBUG : rclone: Version "v1.65.0" starting with parameters ["rclone" "ls" "test-ssh:" "-vvv"]
2023/12/11 18:07:52 DEBUG : Creating backend with remote "test-ssh:"
2023/12/11 18:07:52 DEBUG : Using config file from "/Users/neko/.config/rclone/rclone.conf"
2023/12/11 18:07:52 DEBUG : pacer: low level retry 1/10 (error couldn't connect SSH: ssh: handshake failed: ssh: disconnect, reason 2: Too many authentication failures)
2023/12/11 18:07:52 DEBUG : pacer: Rate limited, increasing sleep to 200ms
```

## 解决

我本地使用了 1Password 的 CLI 命令行工具集成 `op` 来提供 SSH Agent 的能力，方便我在无需关心和管理本地的实体公钥和私钥的情况下自动帮忙完成公钥发送、私钥校验和显式的权限控制的功能。

1Password 通过配置 `SSH_AUTH_SOCK` 环境变量来让所有与 SSH Agent 功能相兼容的工具在读取到环境变量的时候去与 SSH Agent 背后的 SSH Agent 服务提供软件通信并获取身份验证时候需要的密钥，完成整个密钥交换的流程。

通常这样的操作是在 `.zshrc` 中通过配置环境变量实现的：

```shell
# 1Password CLI shell completion
eval "$(op completion zsh)"; compdef _op op
# 1Password CLI environment variables # [!code hl]
export SSH_AUTH_SOCK=~/.1password/agent.sock # [!code hl]
```

也会要求在 `.ssh/config` 中配置 `IdentityAgent` 字段来实现这部分的劫持行为：

```ssh-config
Host * # [!code hl]
  IdentityAgent "~/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock" # [!code hl]
```

配置了 1Password 作为 SSH Agent 的情况下所有的 `ssh` 命令都可以交给 1Password 实现，我在使用相同的 IP 和用户名与服务端通信之后也验证了 1Password 其实是在工作的。

我觉得也许是我对 `rclone` 的理解不够深入，所以根据文档和交互式的 `rclone` 配置引导进行了调试和排查，我发现我的配置已经很简洁了，而且 `rclone` 也在官方文档中声明：

> If you don't specify `pass`, `key_file`, or `key_pem` or `ask_password` then rclone will attempt to contact an ssh-agent. You can also specify `key_use_agent` to force the usage of an ssh-agent. In this case `key_file` or `key_pem` can also be specified to force the usage of a specific key in the ssh-agent.
>
> -- [SFTP](https://rclone.org/sftp/)

这意味着我现在不指定 `pass`，`key_file`，`key_pem` 和 `ask_password` 的情况下，默认就会与 SSH Agent 通信并尝试完成密钥交互的流程。

我看到有人提示说可以通过

```shell
ssh-add -l
```

来查看 SSH Agent 配置状态健康与否，是否有返回期望的密钥。

我尝试之后发现这里面有好多好多密钥：

```shell
❯ ssh-add -l
4096 SHA256:<hash> SSH Key 1 (RSA)
256 SHA256::<hash> SSH Key 2 (ED25519)
256 SHA256::<hash> SSH Key 3 (ED25519)
3072 SHA256::<hash> SSH Key 4 (RSA)
4096 SHA256::<hash> Certificate Signing Private Key 1 (RSA)
256 SHA256:::<hash> SSH Key 5 (ED25519)
256 SHA256:::<hash> SSH Signing Key 1 (ED25519)
3072 SHA256::<hash> SSH Key 6 (RSA)
256 SHA256::<hash> SSH Signing Key 2 (ED25519)
4096 SHA256::<hash> SSH Key 7 (RSA)
4096 SHA256::<hash> Certificate Signing Private Key 2 (RSA)
4096 SHA256::<hash> SSH Key 8 (RSA)
4096 SHA256::<hash> Certificate Signing Private Key 3 (RSA)
256 SHA256::<hash> SSH Key 9 (ED25519)
3072 SHA256::<hash> SSH Key 10 (RSA)
4096 SHA256::<hash> SSH Key 11 (RSA)
```

那，难道是密钥太多了导致 `Too many authentication failures` ？

我之前确实遇到过，但是 `rclone` 并没有给出足够的信息告知我有多少的密钥被发送和交换了，我只能猜测说说不定是需要像 `ssh` 命令本身那样去声明公钥才行。

但是翻了好久 `rclone` 的文档都没有找到类似的配置选项，看起来没有什么办法。

直到我再次去阅读 1Password 中关于 SSH Agent 的文档的时候我才看到有关 `Too many authentication failures` 这样的一段话：

> If your SSH client offers the SSH server a seventh key, the server will refuse the connection and you'll see this error message in your SSH client:
>
> ```shell
> Too many authentication failures
> ```
>
> Server administrators _can_ increase the limit by setting `MaxAuthTries` in the [server's `/etc/ssh/sshd_config`](https://linux.die.net/man/5/sshd_config), but in many cases you can't (or don't want to) change this.
>
> -- [Advanced use cases | 1Password Developer](https://developer.1password.com/docs/ssh/agent/advanced)

好方向，我之前还真不知道 `sshd` 可以这样配置，于是我去服务端修改了一下 `MaxAuthTries` 的数值：

```ssh-config
# MaxAuthTries 6 # [!code --]
MaxAuthTries 20 # [!code ++]
```

然后运行

```shell
sudo sshd -t
```

测试配置文件的有效性，再运行

```shell
sudo systemctl restart sshd
```

来重启 SSH 服务。

这个时候用最初的配置文件再次运行

```shell
rclone ls test-ssh:
```

就发现能运行了！

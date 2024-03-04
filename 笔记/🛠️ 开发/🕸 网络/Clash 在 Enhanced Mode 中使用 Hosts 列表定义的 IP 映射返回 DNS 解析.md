---
tags:
  - 开源/软件/Clash
  - 计算机/网络/VPN/Clash
  - 计算机/网络/代理/Clash
  - 软件/ClashX
  - 计算机/网络/路由
  - 计算机/网络/透明代理
  - 开源/软件/Clash/增强模式
  - 开发/标记语言/YAML
  - 软件/Visual-Studio-Code
  - 软件/Visual-Studio-Code/vscode
---
# Clash 在 Enhanced Mode 中使用 Hosts 列表定义的 IP 映射返回 DNS 解析

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| ClashX Pro | Version: 1.117.1.1 (1.117.1.1) Beta | [App Center](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public) |

## 说明

你可能会遇到需要在没有前置透明代理和前置 DNS 服务器的情况下通过手动配置比如 `/etc/hosts` 文件来映射域名到目标地址来开发或者访问临时 IP 下的服务的需求，这个时候我们往往需要同时打开 Clash 并且配置代理甚至是增强模式，而在增强模式的情况下，Clash 会接管我们的 DNS 请求（参见 fake-ip 模式），这个时候如果我们采用默认配置的话，那么将无法通过 `curl` ，浏览器，甚至是开发中的应用程序和 debugger 访问到我们希望访问的服务了，这个时候可以通过配置 Clash 来解决这个问题。

## 解决方案

我这里使用的是 `ClashX Pro`，可以通过 `ClashX Pro` 的菜单栏中的「配置」-「打开配置文件夹」来查看到配置文件列表，在列表中会存在一个 `config.yaml` 文件，这个时候我们可以通过在自己偏好的文件编辑器中打开该文件来进行编辑，补充我们需要的配置选项来支持 Hosts 定义 IP 的需求。此处我使用 `code`（Visutal Studio Code 的命令行指令）打开：

```shell
code '/Users/neko/.config/clash/config.yaml'
```

我们需要在配置文件中添加下面的行就可以解决：

```yaml
#---------------------------------------------------#
## 配置文件需要放置在 $HOME/.config/clash/*.yaml

## 这份文件是clashX的基础配置文件，请尽量新建配置文件进行修改。
## ！！！只有这份文件的端口设置会随ClashX启动生效

## 如果您不知道如何操作，请参阅 官方Github文档 https://github.com/Dreamacro/clash/blob/dev/README.md
#---------------------------------------------------#

# (HTTP and SOCKS5 in one port)
mixed-port: 7890
# RESTful API for clash
external-controller: 127.0.0.1:9090
allow-lan: false
mode: rule
log-level: warning

proxies:

proxy-groups:

dns: # [!code ++]
  use-hosts: true # [!code ++]

hosts: # [!code ++]
  # --- 项目域名 ---- # [!code ++]
  'service.test.com': '127.0.0.1' # [!code ++]
  # ---------------- # [!code ++]

rules:
  - DOMAIN-SUFFIX,google.com,DIRECT
  - DOMAIN-KEYWORD,google,DIRECT
  - DOMAIN,google.com,DIRECT
  - DOMAIN-SUFFIX,ad.com,REJECT
  - GEOIP,CN,DIRECT
  - MATCH,DIRECT
```

## 延伸阅读

[clash for windows 的 rule 模式没法连接公司内网怎么破 - V2EX](https://www.v2ex.com/t/865599)

---
tags:
  - 软件/Windows
  - 软件/iOS/Homekit
  - 软件/macOS/Homekit
  - 物联网/智能家居/Homekit
  - 软件/iPadOS/Homekit
  - 物联网
  - 物联网/智能家居
  - 运维/物联网
  - 开发/标记语言/YAML
  - 物联网/智能家居/Home-Assistant
  - 开源/软件/Home-Assistant/HASS
  - 物联网/智能家居/Home-Assistant/HASS
  - 开源/软件/Home-Assistant
---
# Windows 设定网络唤醒并集成到 Homekit

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.1 | 2021-12-03 | 补充未完成的文档 |
| Neko | v1.0.0 | 2021-12-02 | 创建 |

### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Windows 10 | ? |  |
| Windows 11 | ? |  |
| Airytec Switch Off | 3.5.1.950 | [http://www.airytec.com/en/switch-off/get.aspx](http://www.airytec.com/en/switch-off/get.aspx) |
| Home Assistant | ? |  |

## 说明

> 本篇不包含如何建立 Home Assistant，只讲解如何配置 Windows 10/11 的网络唤醒并接入 Homekit。

## 配置

### Windows 配置

#### 网卡允许网络唤醒

在 设置 -> 网络与 Internet -> 网络 中找到自己当前插入网线的网络适配器/网卡，点击属性就可以获取到网卡的信息，此处需要记录下 MAC 地址稍后使用。
在 设备管理器 -> 网络适配器 中找到上一步找到的网卡，点击右键，选择属性。
在新打开的窗口中：

1. 需要在『电源选项』中勾选允许网络唤醒，如果有顾虑，可以额外勾选『只允许幻数据包网络唤醒计算机』
2. 需要在『高级』中找到 Wake on LAN（网络唤醒）并且打开该项，设定为『开启』或是『Enable』

### BIOS 配置

重启电脑后进入主板的配置界面。
找到类似于『网络唤醒 Wake on LAN』、『PCIE 网络唤醒 PCIE Wake on LAN/PCIE Power on from Internet』、『板载网卡网络唤醒 Onboard Network Adapter Wake on LAN』、『远程开机 Power on from Internet』这样的设定，选择开启即可。
然后将变更的 BIOS 设定保存并退出。电脑将会重启。

### 安装适用于远程关机的程序 Airytec Switch Off

前往 Airytec Switch Off 的[下载页面](http://www.airytec.com/en/switch-off/get.aspx)下载适用于远程关机和休眠的应用程序。最后一个版本似乎是 2015 年 1 月 26 日更新的 3.5.1 版本了，不知道之后会不会有兼容性问题，如果有的话则需要另找工具。
安装完成之后可以下载额外的简体中文语言包：[下载地址](http://lsls.airytec.com/files/translations/224/zh-CN.lng)。

打开 Airytec Switch Off 之后，不会有主界面程序，需要在程序托盘中找到该程序，然后选择『选项』，在打开的选项中可以设定语言（Language），下拉菜单中选择『Chinese (Simplified)』就可以设定为简体中文；设定之后可以关闭窗口，重新从托盘图标中找到 Airytec Switch Off 并点击『选项』：

1. 在『通用』中请务必勾选『无论是否是当前登录用户都启动』，以确保开机能够自动启动
2. 在『远程管理』标签页中可以打开『启用网页界面』，如果不需要验证信息直接操纵系统关机、休眠等操作的话，可以取消勾选『启用验证（基本 Basic）』，然后点击应用

此时在浏览器中输入 `https://localhost:8000` 应该就能够访问到网页界面。
右键你想要进行的操作，选择复制链接，这样稍后就能够在 Home Assistant 中配置远程关机的操作了。

### 路由器配置

在路由器中，我们需要找到『MAC 绑定』类似的设定，在设定中将我们需要远程唤醒和关闭的计算机 IP 和计算机对应的网卡 MAC 地址填写进去。
点击保存并应用。

### Home Assistant 配置

#### Home Assistant Docker 容器安装

如果使用 Docker 容器安装，需要找到 Home Assistant 的配置文件然后手动编辑，一般在：`/config/configuration.yaml` [^5]

#### Home Assistant 核心镜像安装

如果使用镜像安装，需要手动编辑 `/config/configuration.yaml` 文件，也可以安装一个名为 File Editor 的官方 Add-on（插件）来编辑[^6]

#### Home Assistant 实际配置

在 `configuration.yaml` 中我们需要配置以下内容，使用下面的内容可以创建一个开关实体，以及一个服务脚本命令。：
其中：

- `switch` 定义了这个实体是一个开关
- `platform` 表示该实体使用的平台 API，此处为 [wake_on_lan](https://www.home-assistant.io/integrations/wake_on_lan/)
- `mac` 表示电脑网卡的硬件物理地址，MAC 地址，可以在 Windows 10/11 中的 设置 - 网络和 Internet - 适配器属性中找到
- `name` 表示该实体的人类友好名称
- `turn_off` 表示执行关闭操作时行为如何
	- `service` 表示一个服务，我们定义该服务为 `shell_command`
- `shell_command` 定义了一个脚本命令服务类型
	- `turn_off_rizumu_desktop` 表示服务的字段名，必须和上面的 service 里面填写的值一致，此处里面的值为一个脚本命令，该脚本命令使用 `curl` 并使用 HTTP GET 请求访问了我们在 Windows 配置中配置的 Airytec Switch Off 的网页地址，填写地址的时候需要把之前复制的链接中的 `localhost` 替换为计算机的实际内网 IP，比如 192.168.0.2 或是 10.0.0.2 等。

```yaml
switch:
 - platform: wake_on_lan
   mac: <电脑网卡的 MAC 硬件物理地址>
   name: <按钮的名称>
   turn_off:
     service: shell_command.turn_off_rizumu_desktop

shell_command:
  turn_off_rizumu_desktop: 'curl -X GET <Airytec Switch Off 操作连接>'
```

比如我们可以填写：

```yaml
switch:
 - platform: wake_on_lan
   mac: 00:0C:29:A5:B4:C8
   name: 小音的电脑
   turn_off:
     service: shell_command.turn_off_rizumu_desktop

shell_command:
  turn_off_rizumu_desktop: 'curl -X GET http://10.0.0.2:8000/?action=System.Hibernate'
```

这样通过 Home Assistant 进行关闭操作的时候就可以使计算机进入休眠状态。

#### 检查配置和重启 Home Assistant

前往 Home Assistant 的 配置 -> 服务控制 页面，点击检查配置来检查配置文件，以免更改错误导致 Home Assistant 实例出现重启失败的问题。检查无误后点击下面的**重启**来重启 Home Assistant 服务。

#### 集成到 Homekit

重启后应该可以在概览页面看到新增加的开关。
此时我们需要更新 Homekit 的设备，前往 配置 -> 集成 -> Homekit 桥 -> 选项，在里面选择需要包括和排除的实体，点击**更新**。之后应该就能到 Homekit 中查看到该设备了。

## 错误排查

### 关机后数分钟内可以唤醒，数分钟后无法唤醒

需要到路由器中设定**静态绑定 IP/MAC**，造成这个的主要原因是：导致找不到 MAC 地址与 IP 地址对应的记录，就无法发送魔幻数据包。[^1]

### Intel 网卡系统关机后无法网络唤醒

对于 Intel 网卡需要单独设置一个选项[^2][^3][^4]：
控制面板 -> 系统和安全 -> （电源选项的下方）选择电源按钮的功能 -> 更改当前不可用的设置 -> （取消勾选）启用快速启动

[^1]: [wake on lan 远程唤醒/远程开机中的所有设置细节（arp静态绑定解决长时间关机无法唤醒） - 程序员大本营 - 中文](https://www.pianshen.com/article/80641319681/)
[^2]: [windows8 的64位系统，选择“关机”后无法“网络唤醒”，但选择“睡眠”可以实现“网络唤醒” - 中文](https://social.technet.microsoft.com/Forums/ie/en-US/fb0212a9-e857-4dcf-9760-3286d41d0dbc/windows8?forum=w8itprozhcn)
[^3]: [电脑关机十分钟后无法远程唤醒是什么原因？ - 张绍余的回答 - 知乎 - 中文](https://www.zhihu.com/question/344623623/answer/1123840146)
[^4]: [Win10关机可以网络唤醒，睡眠无法网络唤醒？ - greader的回答 - 知乎 - 中文](https://www.zhihu.com/question/53821424/answer/463242896)
[^5]: [Raspberry Pi 树莓派 - Home Assistant - 英文](https://www.home-assistant.io/installation/raspberrypi#install-home-assistant-container)
[^6]: [高级配置 - Home Assistant - 英文](https://www.home-assistant.io/getting-started/configuration/)

# Windows 10 或 Windows 11 设定网络唤醒（Wake on LAN）

##### 文档版本

| 编辑者 | 版本 | 变更日期 |
| -- | -- | -- |
| Neko | v1.0.0 | 2021-12-02 |

##### 文档兼容性

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Windows 10 | ? |  |
| Windows 11 | ? |  |
| Home Assistant | ? |  |

## 说明

> 本篇不包含如何建立 Home Assistant，只讲解如何配置 Windows 10/11 的网络唤醒。

## 配置

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
	- `turn_off_rizumu_desktop` 表示服务的字段名，必须和上面的 service 里面填写的值一致，此处里面的值为一个脚本命令

```yaml
switch:
 - platform: wake_on_lan
   mac: <电脑网卡的 MAC 硬件物理地址>
   name: <按钮的名称>
   turn_off:
     service: shell_command.turn_off_rizumu_desktop

shell_command:
  turn_off_rizumu_desktop: 'curl -X GET <RPC 服务器>'
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
  turn_off_rizumu_desktop: 'curl -X GET http://rizumu-desktop/rpc'
```

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
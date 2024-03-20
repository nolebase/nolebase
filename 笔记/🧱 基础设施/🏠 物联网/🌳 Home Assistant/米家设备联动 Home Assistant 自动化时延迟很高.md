---
tags:
  - 软件/iOS/Homekit
  - 软件/macOS/Homekit
  - 物联网/智能家居/Homekit
  - 软件/iPadOS/Homekit
  - 开源/软件/Home-Assistant
  - 开源/软件/Home-Assistant/HASS
  - 物联网/智能家居/Home-Assistant
  - 物联网/智能家居/Home-Assistant/HASS
  - 物联网/智能家居/生态/米家
  - 物联网/智能家居/生态/Homekit
  - 物联网
  - 物联网/IoT
status: 尚未完成
---

# 米家设备联动 Home Assistant 自动化时延迟很高

> [!WARNING]
> ⚠️ 该文档尚未完成，仍在编写中...

## 说明

最近小音 @LittleSound 在 Home Assistant 和 Homekit 上给从 Home Assistant 从米家接入的[子擎的人在传感器](https://zhuanlan.zhihu.com/p/592187536)做了一些关于自动开关灯的场景的自动化，然后发现从设备的状态更新，到触发 Home Assistant 的自动化，到 Homekit 灯具开关的流程耗时非常长，可能有 5s 到 10s 不等的延迟。

## 哪里来的延迟

直到后来查资料才知道这是因为我们 Home Assistant 中通过 HACS 配置安装的 [Xiaomi Miot Auto](https://github.com/al-one/hass-xiaomi-miot) 目前主要是通过轮询的方式获取设备状态，通俗的讲就是每隔几十秒去刷新一次状态。[^1]

## 解决方法一：直接改配置来缩短轮询间隔

不过，[Xiaomi Miot Auto](https://github.com/al-one/hass-xiaomi-miot) 是提供了配置方案的，允许用户修改这个轮询间隔长度：

> 在 Token 方式集成时，这个时长是可以直接修改的(添加集成和修改集成选项均可)，目前默认是 30 秒。
> 而通过账号集成时，由于一个集成配置会对应多个设备，因此无法统一配置，需要为每个设备实体添加[自定义属性](https://github.com/al-one/hass-xiaomi-miot/issues/100#issuecomment-864678774) `interval_seconds` 来修改轮询时长：

```yaml
# customize.yaml
sensor.your_entity_id:
  interval_seconds: 10 # 轮询间隔时长(秒)
```

所以这意味着你可以在 HASS 里面的 File Editor 去修改并进行配置。不过这样的方式依然有限制：

> 一般情况下，对于开关、灯、环境传感器等设备，我们推荐使用默认轮询时长即可，过于频繁的请求状态可能会使设备负载过高，且大部分请求是无意义的。
>
> 对于人体传感器、门磁、无线开关类设备，它们的状态通常为瞬时状态(即：事件)，部分型号支持获取最后一次事件触发的时间，且默认轮询时长为 15 秒，对于无法获取最后触发事件的设备，即使修改轮询时间到 1 秒，也可能无法获取正确的状态。

[Xiaomi Miot Auto](https://github.com/al-one/hass-xiaomi-miot) 的作者也提到说：

> **此类设备通过本插件集成后不太推荐用于触发实时自动化，仅适合作为如几分钟无人移动关灯这类自动化的条件**，如果需要实时更新状态，推荐使用[多模网关](https://home.miot-spec.com/s/lumi.gateway.mgl03)配合[XiaomiGateway3](https://github.com/AlexxIT/XiaomiGateway3)集成。

那为什么是轮询呢？可以是轮询之外的别的方案吗？[Xiaomi Miot Auto](https://github.com/al-one/hass-xiaomi-miot) 的作者提到的这个多模网关可以解决这个问题吗？

## 解决方法二：多模网关搭配 Home Assistant 集成

想回答这个问题这要提到 Home Assistant 文档中科普的[物联网智能家居设备的几种类型](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/#classifiers)：

| 类型                   | 介绍                                                                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 推测状态 Assumed State | 无法获取状态，只能根据最后的指令推测、假定。                                                                                                                                            |
| 云端轮询 Cloud Polling | Home Assistant 定时向云端查询状态，所以互联网连接必须得到保证，至少要在轮询发起前建立连接。同时轮询意味着状态刷新必然会有明显的延迟（主要是轮询周期，其次通讯时延、服务器响应时延等）。 |
| 云端推送 Cloud Push    | 云端服务器在状态变化时向 Home Assistant 推送通知，这要求互联网连接必须一直保持。显然这种方式比轮询更加高效，时延也会更短。                                                              |
| 本地轮询 Local Polling | 提供与设备的直接通信。轮询状态意味着稍后可能会注意到更新。                                                                                                                              |
| 本地推送 Local Push    | 提供与设备的直接通信。一旦有新状态，Home Assistant 就会收到通知。                                                                                                                       |

如何消除这个延迟呢？
## 参考资料

- [【新手必读】入门->精通：HA安装方式、基本概念及来龙去脉 - 『HomeAssistant』新手入门区 - 『瀚思彼岸』» 智能家居技术论坛 - Powered by Discuz!](https://bbs.hassbian.com/thread-14225-1-1.html)
- [Classifying the Internet of Things - Home Assistant](https://www.home-assistant.io/blog/2016/02/12/classifying-the-internet-of-things/#classifiers)
- [FAQ - 常见问题 · Issue #100 · al-one/hass-xiaomi-miot](https://github.com/al-one/hass-xiaomi-miot/issues/100#issuecomment-909031222)

## 延伸阅读

- [AlexxIT/XiaomiGateway3: Control Zigbee, BLE and Mesh devices from Home Assistant with Xiaomi Gateway 3 on original firmware](https://github.com/AlexxIT/XiaomiGateway3#how-it-works)
- [Getting started | Zigbee2MQTT](https://www.zigbee2mqtt.io/guide/getting-started/#installation)

[^1]: 在 [为什么设备状态会有延迟？如何减小延迟？](https://github.com/al-one/hass-xiaomi-miot/issues/100#issuecomment-909031222) 中提及：延迟通常是指通过米家APP或物理按键等操作设备后，设备在HA中的实体状态要等几秒甚至十几秒后才会更新。原因是本插件目前主要是通过轮询的方式获取设备状态，通俗的讲就是每隔几十秒去刷新一次状态。现在这个时间是 30s。

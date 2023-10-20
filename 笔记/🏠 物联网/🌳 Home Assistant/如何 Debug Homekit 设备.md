---
tags:
  - 物联网/智能家居/Homekit
  - 物联网/智能家居/生态/Homekit
  - 网络/协议/mDNS
  - 操作系统/Debian
  - 命令行/apt
  - 命令行
  - 开发/故障排查
  - 物联网/IoT
  - 物联网/智能家居
  - 开源/软件/Home-Assistant
  - 开源/软件/Home-Assistant/HASS
  - 物联网/智能家居/Home-Assistant
  - 物联网/智能家居/Home-Assistant/HASS
---

# 如何 Debug Homekit 设备

::: warning
⚠️ 该文档尚未完成，仍在编写中...
:::

```shell
sudo apt update
sudo apt install avahi-utils
```

```shell
avahi-browse -a
```

```shell
$ avahi-browse -a

+   eth0 IPv4 OpenWRT                                       Microsoft Windows Network local
+   eth0 IPv4 OpenWRT                                       Device Info          local
+   eth0 IPv4 Presence-Sensor-FP2-069E                      _aqara-setup._tcp    local
```

```shell
$ avahi-browse -rv _aqara-setup._tcp

Server version: avahi 0.8; Host name: gateway.local
E Ifce Prot Name                                          Type                 Domain
+   eth0 IPv6 Presence-Sensor-FP2-069E                      _aqara-setup._tcp    local
+   eth0 IPv6 Doorbell Repeater-9911                        _aqara-setup._tcp    local
+   eth0 IPv4 Presence-Sensor-FP2-069E                      _aqara-setup._tcp    local
+   eth0 IPv4 Doorbell Repeater-9911                        _aqara-setup._tcp    local
=   eth0 IPv6 Doorbell Repeater-9911                        _aqara-setup._tcp    local
   hostname = [Doorbell\032Repeater-9911.local]
   address = [10.0.2.71]
   port = [51024]
   txt = ["id=lumi1.54ef444c9911" "pv=true" "zi=0" "ui=1752996408" "cv=1" "ver=3"]
=   eth0 IPv4 Doorbell Repeater-9911                        _aqara-setup._tcp    local
   hostname = [Doorbell\032Repeater-9911.local]
   address = [10.0.2.71]
   port = [51024]
   txt = ["id=lumi1.54ef444c9911" "pv=true" "zi=0" "ui=1752996408" "cv=1" "ver=3"]
=   eth0 IPv6 Presence-Sensor-FP2-069E                      _aqara-setup._tcp    local
   hostname = [Presence-Sensor-FP2-069E.local]
   address = [10.0.1.217]
   port = [28420]
   txt = ["ver=3" "cv=1" "pv=true" "id=lumi1.54ef444f069e" "ui=1752996408"]
=   eth0 IPv4 Presence-Sensor-FP2-069E                      _aqara-setup._tcp    local
   hostname = [Presence-Sensor-FP2-069E.local]
   address = [10.0.1.217]
   port = [28420]
   txt = ["ver=3" "cv=1" "pv=true" "id=lumi1.54ef444f069e" "ui=1752996408"]
: All for now
: Cache exhausted
```

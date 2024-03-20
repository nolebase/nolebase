---
tags:
  - 游戏
  - 游戏/主机游戏
  - 游戏/任天堂/Nintendo/塞尔达系列
  - 游戏/任天堂/Nintendo/塞尔达传说-时之笛-3D
  - 游戏/主机设备/任天堂/Nintendo/Nintendo-64
  - 游戏/主机设备/任天堂/Nintendo/Nintendo-3DS
  - 游戏/掌机设备/Valve/Steam-Deck
  - 游戏/掌机设备/Valve
status: 尚未完成
---
# 在 Steam Deck 上游玩塞尔达传说：时之笛 3D

> [!WARNING]
> ⚠️ 该文档尚未完成，仍在编写中...

## 前言

我在先前很早的时候了解到了在 Nintendo 64 上发售的《塞尔达传说：时之笛》是一款在游戏历史上举足轻重的游戏，它在 metacritic 网站上拥有着 99 分的高分评价，是 metacritic 网站上记录到的最高分，而在 3DS 上于 2011 年发售的重制版《塞尔达传说：时之笛 3D》在 metacritic 上也依然还有 95 分高分评价，依然超越了众多游戏。

我作为一个游戏玩家真的很好奇《塞尔达传说：时之笛》究竟是怎样的一款游戏，居然能赢得这么多人的喜爱，于是我想到了：Steam Deck 有着超越 Nintendo 64 和 3DS 的性能，是不是可以在它上面运行模拟器来游玩《塞尔达传说：时之笛》呢？

诚然，折腾模拟器在绝大多数时候都不是一件很顺利的事情，我也在折腾《塞尔达传说：时之笛 3D》和游戏社区为它创建的改进后的高清纹理包的过程中遇到了很多问题，但是最终还是成功了，所以我决定把这个过程记录下来，以便感兴趣的大家参考。

## TL;DR

在 Steam Deck 上使用 EmuDeck 和 Citra 模拟器来实现《塞尔达传说：时之笛 3D》的游玩。使用开源社区为 Steam Deck 编写的 [kmicki/SteamDeckGyroDSU](https://github.com/kmicki/SteamDeckGyroDSU) 提供 Citra 模拟器的陀螺仪支持，使用 Henriko Magnifico 制作的 [Zelda: Ocarina of Time 3D 4K Texture Pack](https://www.henrikomagnifico.com/zelda-ocarina-of-time-3d-4k) 实现高清贴图。

## 前置条件

1. 拥有足够存储空间和网络连接的 Steam Deck
2. 能连接到 Steam Deck 的拓展坞 USB-C Hub，并为插在 Steam Deck 上的拓展坞 USB-C Hub 供电（**可选**：有拓展坞之后可以方便的插鼠标和键盘进行操作）
3. 能连接到拓展坞 USB-C Hub 的鼠标和键盘（**可选**：有鼠标和键盘可以方便操作）
4. 在 Steam Deck 上安装和配置好 EmuDeck，**务必在 EmuDeck 安装和配置向导中安装 Citra 模拟器**。具体可以参考 [EmuDeck 官方网站](https://www.emudeck.com/)
5. 下载到《塞尔达传说：时之笛 3D》的游戏本体 ROM（`.cia`，`.cci`，`.3ds` 格式均可，操作稍有不同）
6. 在 Henriko Magnifico 的 [Patreon](https://www.patreon.com/henrikomagnifico) 主页正下方的帖子中

## 开始操作

## 参考资料

### EmuDeck 模拟器整合软件相关

[EmuDeck模拟器整合软件小白入门教程，steamdeck掌机秒变全能模拟器！PS1/2/3/PSP/XBOX/wii/wiiu/ns/街机全整合 - 哔哩哔哩 bilibili](https://www.bilibili.com/video/BV15g411C72o)

[How to install EmuDeck 2 and RetroDeck on the Steam Deck](https://overkill.wtf/emulation-nintendo-sony-steam-deck/)

### Citra 模拟器相关

[Citra(3ds)模拟器下载/使用教学+cia的转换解码 - 哔哩哔哩 bilibili](https://www.bilibili.com/video/BV15t411V7Er)

[How to Convert a .CIA file to a .3DS or .CCI file for use with the Citra 3DS Emulator? | GBAtemp.net - The Independent Video Game Community](https://gbatemp.net/threads/how-to-convert-a-cia-file-to-a-3ds-or-cci-file-for-use-with-the-citra-3ds-emulator.393086/)

### 塞尔达传说：时之笛 3D 高清纹理包相关

[我不允许有人没玩过这个版本的时之笛！！至高杰作焕发4K新生！ - 哔哩哔哩 bilibili](https://www.bilibili.com/video/BV1Jd4y1C7ur)

[Zelda: Ocarina of Time 3D 4K Texture Pack | Henriko Magnifico](https://www.henrikomagnifico.com/zelda-ocarina-of-time-3d-4k)

[How to play Ocarina of Time and Majora's Mask in 4K on Steam Deck](https://overkill.wtf/how-to-play-nintendo-zelda-ocarina-of-time-and-majoras-mask-in-4k-on-steam-deck/)

[How to install Henriko Magnifico's various 4K mods onto Steam Deck, a step-by-step tutorial. : SteamDeck](https://www.reddit.com/r/SteamDeck/comments/xl0rky/how_to_install_henriko_magnificos_various_4k_mods/)

### Steam Deck 陀螺仪配置相关

[Steam Deck - How To Get Motion Controls In 3DS Games On Citra Emulator - YouTube](https://www.youtube.com/watch?v=S8JAL-yjguI)

[kmicki/SteamDeckGyroDSU: DSU (cemuhook protocol) server for motion data running on Steam Deck.](https://github.com/kmicki/SteamDeckGyroDSU)

---
tags:
  - 游戏/街机游戏
  - 游戏/音乐游戏/音击/ONGEKI
  - 游戏/音乐游戏/中二节奏/CHUNITHM
  - 游戏/社区/1cc/街机游戏社区
---

# 再觅音游社区 1cc 社区- 小小的 ARG 解密旅程

> [!WARNING]
> 站在尊重每个社区的角度上，我不会直接给出最终社区在什么地方，我也不会直接给出答案，我想要保护这些无私分享的伙伴们，如果你还没有加入，但也想加入这个社区，不妨也开始一场属于你自己的寻觅之旅吧！但是记得哦，当你找到答案之后，不要随便传播，不要太过于声张。

> [!WARNING]
> 我强烈谴责那些在闲鱼 App 上以有偿形式兜售 1cc 邀请链接的人们，1cc 是完全公开和开放的社区，只不过链接稍微有点难找罢了，如果你有相关圈子的伙伴，应该可以找他们直接要邀请链接加入 Discord 服务器，或者跟着我的旅途自己也寻找寻找，不应该直接就去花钱从他们手中买的...只会助长他们的这种行为。


之前想玩 Sun Plus 的时候，我还是像以往那样去 Emuline 找资源：

![[once-again-the-way-to-1cc-screenshot-1.png]]

点进去之后会看到创作者会这样发布列表信息：

![[once-again-the-way-to-1cc-screenshot-2.png]]

因为我以前是主要玩的 Paradise，那时候还没有更新这么多东西，还叫 SDBT，搜索的时候踩了一些坑，直到我看到这个列表的时候才知道，原来，现在的 CHUNITHM 的 ID 改成了 SDHD，不再是以前的 SDBT 了。

> [!TIP]
>
> 作为参考，CHUNITHM 的游戏 ID 和版本号如下表格所示
>
> | 游戏稼动名               | 游戏版本名         |
> | ------------------------ | ------------------ |
> | Chunithm                 | SDBT 1.00.00       |
> | Chunithm Plus            | SDBT 1.06.00       |
> | Chunithm Air             | SDBT 1.10.00       |
> | Chunithm Air Plus        | SDBT 1.15.00       |
> | Chunithm Star            | SDBT 1.20.00       |
> | Chunithm Star Plus       | SDBT 1.25.00       |
> | Chunithm Superstar       | SDGS 1.00.00 and > |
> | Chunithm Amazon          | SDBT 1.30.00       |
> | Chunithm Amazon Plus     | SDBT 1.35.00       |
> | Chunithm Crystal         | SDBT 1.40.00       |
> | Chunithm Crystal Plus    | SDBT 1.45.00       |
> | Chunithm Paradise (Lost) | SDBT 1.50.00       |
> | Chunithm NEW!!           | SDHD 2.00.02       |
> | Chunithm NEW!! Plus      | SDHD 2.05.00                   |
> | Chunithm Sun             | SDHD 2.10.01                   |
> | Chunithm Sun Plus                         | SDHD 2.15/2.16                   |

但是可惜的是，这些链接都坏了，没有一个是可以下载的，这个时候我就跟着新的游戏名称 + 版本号 `SDHD 2.15` 再去搜索一下有没有其他的资源站点会有，会可以分享的：

![[once-again-the-way-to-1cc-screenshot-3.png]]

我会发现很多都是没有意义的信息，唯独有意义的还是 Emuline。

这个时候我感觉好难啊，就开始挨个新帖子翻着阅读。

阅读着阅读着就看到了这么一篇[帖子回复](https://www.emuline.org/topic/2600-arcade-pc-chunithm-new-int-sun-s3g-alls/?do=findComment&comment=153673)，里面提及了 `UPDATED LINK`（更新后的链接），我理解是补档吧，乍一看还是一个 `base64` 编码过的字符串：

![[once-again-the-way-to-1cc-screenshot-4.png]]

```
aHR0cHM6Ly9waXhlbGRyYWluLmNvbS91L2tjaGZ5aVpa
```

> 当时我心里会想，还挺麻烦的，分享点资源都得这么蹑手蹑脚的，真辛苦 leakers 了。

简单去大家常去的 [https://www.base64decode.org/](https://www.base64decode.org/) 解码了一下：

![[once-again-the-way-to-1cc-screenshot-5.png]]

发现还真是 `base64` 的，这个时候抱着想要试试的心态打开：

```
https://pixeldrain.com/u/kchfyiZZ
```

结果我发现还是被删掉了。

> 举报者和滥用者你们好坏啊！

然后又只能回到继续重新阅读帖子的状态，直到看到[这一条](https://www.emuline.org/topic/2600-arcade-pc-chunithm-new-int-sun-s3g-alls/?do=findComment&comment=153764)：

他分享说有坏人在帖子回复中的链接所对应的数据包中混了恶意代码，运行的时候会把系统弄坏！😠

![[once-again-the-way-to-1cc-screenshot-6.png]]

然后我就心想啊，这不行啊，都这么恶劣了，居然要闹到这个地步，我应该是不太敢继续再读帖子之后找到链接然后下下来尝试了...

转念一想，我想起来我曾经在 Nyaa 站看到过 CHUNITHM 和 maimai 的资源，抱着试一试的心态去看了看：

![[once-again-the-way-to-1cc-screenshot-7.png]]

发现好像还是不行，唯一最近的就是 New Plus 了，但那会儿真的很想要较劲，想要折腾出一个 Sun Plus 来，就又放弃了这条路。

> 不过 Torrent 和数据还是下下来了，说不定之后分享率不好了我也可以挂着分享分享。

在阅读的过程中，我发现了下面的几个以前没见过的关键词：

- `LoLK Lunatic`
- `sega downloader`
- `Data Collective`
- `Artemis`

![[once-again-the-way-to-1cc-screenshot-8.png]]

可惜的是我还是没能看到多少的信息，搜索结果里面一无所有。

这个时候我又转念一想，这位分享者 TA 一直在发帖回复，还会解答很多细心的内容，我为什么不去他的个人主页中找找他是否有发过其他的帖子提及链接和 HDD 都在哪里下载呢？

![[once-again-the-way-to-1cc-screenshot-9.png]]

当然没问题，点击去看也是看得到的。

![[once-again-the-way-to-1cc-screenshot-10.png]]

不过有趣且幸运的事情发生了，就在浏览 TA 个人主页的时候，就扫到了这样的 Profile Information，里面就直接指向了 1cc 社区的链接了！

![[once-again-the-way-to-1cc-screenshot-11.png]]

到这里就结束啦！
## 延伸阅读

[DUMPS - Dumps disponibles en miroir / Mirror: Many dumps availables! - Page 33 - ARCADE PC DUMP LOADER - Emulation PC Arcade TeknoParrot roms dumps iso emulateur 2023](https://www.emuline.org/topic/1265-dumps-dumps-disponibles-en-miroir-mirror-many-dumps-availables/page/33/)

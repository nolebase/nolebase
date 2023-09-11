---
tags:
  - 操作系统/Windows
  - 软件/串流/NVIDIA-Shield
  - 软件/串流/Moonlight
  - 软件/Windows/regedit
---
# 修复：NVidia Shield (Moonlight) 选择了错误的显示器 – Lighthouse @ theCloudiest

来源：[https://lighthouse.thecloudiest.com/2020/12/20/fix-nvidia-shield-moonlight-selecting-the-wrong-monitor/](https://lighthouse.thecloudiest.com/2020/12/20/fix-nvidia-shield-moonlight-selecting-the-wrong-monitor/)

> **Excerpt**
> A while back I stopped paying for consoles and put my efforts to a good PC rig. However I still like laying down on the couch and using a XBOX Controller. Moonlight fixed this for me (using a 4K Ap…

---
不久前，我不再为游戏机付费，而是将精力放在了一个好的 PC 设备上。不过我还是喜欢躺在沙发上使用 XBOX 控制器。Moonlight 为我解决了这个问题（使用 4K Apple TV 和完整的以太网）。全 FPS，全分辨率（我可能会添加 RTX），没有延迟，完美！

![](https://lighthouse.thecloudiest.com/wp-content/uploads/2020/12/image.png)

但是**当我升级我的电脑时出现了问题**。**Moonlight 一直使用正确的（错误的）监视器**而不是死点。这让我不得不起床，走进我的办公室，把游戏强行放到错误的显示器上（或者更糟）。

然而，经过大量的试验和错误，我想出了如何解决它。

**首先，您需要确保有问题的显示器实际上是“BIOS 默认值”**。这意味着什么？对我来说，当我打开塔式电源时，戴尔徽标会显示在该屏幕上。在这种情况发生之前，我不得不更换 DP 电缆。

**接下来，您需要您首选的显示器是 Windows 最先找到的**。注意我没有说初级？NVidia 不尊重主显示器标志（他们应该但他们不尊重）。

一些背景知识：Windows 为每对独特的显示器创建“配置文件”。它通过使用监视器序列号来做到这一点，这就是为什么交换电缆并不能真正解决问题的原因。我的假设是 NVidia 寻找 Monitor 00，这就是它使用的那个。所以真正的诀窍是让 WINDOWS 先解决你喜欢的显示器。

要让 Windows 制作您首选的显示器 `#00（我所说的首先找到）` **，您需要弄清楚它连接到哪根电缆**。**确保它是唯一附加的**，然后转到注册表的以下部分：

> HKEY\_LOCAL\_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\\Configuration

![](https://lighthouse.thecloudiest.com/wp-content/uploads/2020/12/image-1.png)

**删除 Configuration 的所有子键**。我这样做了几次，虽然知道它可能会给你带来问题，但从来没有对我造成太大伤害。系统还原点可能是个好主意，或者至少是配置 \*（右键单击 -> 导出）的导出。

**然后断开除您关心的监视器之外的所有其他监视器并重新启动**。重新启动后，插入其他显示器。您将不得不重新排序。那应该这样做。

即使在清除驱动程序和配置之后，我也意识到了这一点，我发现它很奇怪 Windows 总是知道如何将显示器订单重新收集（即使在交换电缆时）。这就是我找到这些键的方式，这些键会杀死已保存的配置文件。唯一要弄清楚的其他部分是如何确保我关心的显示器是第一位的。

希望对您有所帮助，祝您游戏愉快！
1

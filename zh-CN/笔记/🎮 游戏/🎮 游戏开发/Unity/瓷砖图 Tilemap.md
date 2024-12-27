# 瓷砖图 Tilemap

Tile Palette 编辑器是在 Unity 里面用来创建和编辑 2D 瓷砖地图的工具

新建 Palette 文件夹

然后新建 Palette（调色板）

打开 Tile Palette 编辑器

在 Window - 2D - Tile Palette 打开

导入在[[精灵图]]中处理好的图片素材，保存到 Palette 文件夹旁边

右键点击左边 Hierarchy，创建一个 2D Object，然后找到 Tilemap 选项，创建一个 Rectangler 的 Tilemap，可以命名为 Ground，Additional Settings 里面的 Sorting Layer 可以添加创建一个 Background layer（如果没有可以自己创建）

别忘了也给玩家创建「墙」

绘制好地图之后可以通过在 Inspector 中添加一个 Tilemap Collider 2D（瓷砖碰撞器 2D）

[【Unity 2D游戏开发教程】第3课：Tilemap 制作 2D 地图 - 哔哩哔哩 bilibili](https://www.bilibili.com/video/BV1T94y1N71a)


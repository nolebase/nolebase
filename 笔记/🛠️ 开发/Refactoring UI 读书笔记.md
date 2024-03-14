---
tags:
  - 开发/前端
  - 设计/UI/Refactoring UI
  - 笔记/读书笔记
  - 书籍/Refactoring UI
---

# Refactoring UI 读书笔记

## 如何从零开始

### 从功能开始，而不是布局

> Start with a feature, not a layout

先实现功能，然后再考虑布局。对于简单的功能，你甚至可能不需要导航栏、页脚或侧边栏。

### 以循环的方式工作

> Work in cycles

> Instead of designing everything up front, work in short cycles. Start by designing a simple version of the next feature you want to build.

与其事先设计好一切，不如在短周期内完成工作。从设计下一个要构建的功能的简单版本开始。

### 做一个悲观主义者

> Be a pessimist
>
> Don’t imply functionality in your designs that you aren’t ready to build.

当你在设计一个新功能时，预计它的构建会很困难。设计你能发布的最小有用版本可以大大降低这种风险。

> When you’re designing a new feature, expect it to be hard to build. Designing the smallest useful version you can ship reduces that risk considerably.
>
> If part of a feature is a “nice-to-have”, design it later. Build the simple version first and you’ll always have something to fall back on.

如果功能的一部分是“锦上添花”的，那么稍后再设计它。首先构建简单版本，这样你总会有东西可以依靠。

## 层次结构就是一切

> Hierarchy is Everything

> Not all elements are equal

并非所有元素都是平等的

### 语义是次要的

> Semantics are secondary

语义是按钮设计的重要组成部分，但这并不意味着你可以忘记层次结构。

页面上的每个操作都位于重要性金字塔中的某个位置。大多数页面只有一个真正的主要操作、几个不太重要的次要操作以及一些很少使用的第三级操作。

PRIMARY ｜SECONDARY｜TERTIARY

•主要行动应该是显而易见的。固体、高对比度的背景颜色在这里效果很好。
•次要行动应该明确，但不突出。轮廓样式或较低的对比度背景颜色是很好的选择。
•第三级按钮应该是可发现的，但不显眼的。像链接一样对这些操作进行造型通常是最好的方法。

如果破坏性操作不是页面上的主要操作，则最好使用二级或三级按钮。

### 不要在彩色背景上使用灰色文字

> Don’t use grey text on colored backgrounds
>
> A better approach is to hand-pick a new color, based on the background color.
> Choose a color with the same hue, and adjust the saturation and lightness until it looks right to you.

更好的方法是根据背景色手工挑选新的颜色。

选择相同色调的颜色，然后调整饱和度和明度，直到你觉得合适为止。

### 标签是最后的手段

> Labels are a last resort

## 布局和间距

> Layout and Spacing

使设计变清晰的最简单方法之一就是给每个元素多一点呼吸的空间。

### 应删除而不是添加空白

更好的方法是首先给一些东西太多的空间，然后将其删除，直到你对结果感到满意为止。

### 密集的用户界面有他们的位置

例如，如果您正在设计某种仪表板，其中需要同时显示大量信息。重要的是让这成为一个深思熟虑的决定，而不仅仅是默认。当您需要删除空格时，比需要添加空格时要明显得多。


### 缩小画布

如果您很难在大画布上设计一个小界面，请缩小画布！很多时候，当限制是真实的时，设计一些小东西更容易。

如果您正在构建一个响应式Web应用程序，请尝试从~400px的画布开始，并先设计移动布局。

一旦你有一个你满意的移动设计，把它带到一个更大尺寸的屏幕上，并在更小的屏幕上调整任何感觉像妥协的东西。很有可能你不必像你想象的那样改变。

### 相对尺寸不可缩放

作为一般规则，大屏幕上较大的元素需要比已经相当小的元素缩小得更快——在小屏幕尺寸下，小元素与大元素之间的差异应该不那么极端。

### 避免模糊的间距

> Avoid ambiguous spacing

每当你依靠间距来连接一组元素时，总是确保围绕这组元素的空间比其内部的空间更大——难以理解的界面看起来总是更糟糕。

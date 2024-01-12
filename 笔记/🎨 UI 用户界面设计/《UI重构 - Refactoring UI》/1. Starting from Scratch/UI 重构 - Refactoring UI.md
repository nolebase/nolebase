
## 设计从功能出发，而非布局

当你开始设计一个新的应用程序的想法时，你首先设计什么？如果是页面顶部的导航栏，你就犯了一个错误。
在你开始一项新的设计时，最容易沮丧和卡壳的地方就是试着去设计应用程序的交互页面，也就是我们常说的 UI。当大多数人想到设计应用程序时，他们往往想到的是设计外壳。以下的问题接踵而至：
它应该有一个顶部导航，还是一个侧边栏？导航栏项目应该在左边，还是在右边？页面内容应该放在一个容器中，还是应该占满整个页面宽度？Logo 应该放哪？

关键在于，事实上**一个应用程序是一些功能的集合**。在你还没来得及设计出产品的具体功能之前，你并没有获取到所需足够的信息，来决定导航应该如何工作、为谁服务。难怪这会让人感到沮丧!

与其从外壳开始，不如从一段实际功能开始。例如，假设你正在建立一个航班预订服务。你可以从 "搜索航班 "这样一个功能开始。
你的界面将需要以下元素：

- 出发城市的输入框
- 目的地城市的输入框
- 出发日期的输入框
- 返回日期的输入框
- 一个执行搜索的按钮

从以上这些开始吧。


该死，事实上你可能根本不需要其他任何东西。你看，这个组件看似简单，其实它在为 Google 服务！

## Detail comes later

In the earliest stages of designing a new feature, it’s important that you don’t get hung up making low-level decisions about things like typefaces, shadows, icons, etc.

That stuff will all matter eventually, but it doesn’t matter right now.

If you have trouble ignoring the details when working in a high fidelity environment like the browser or your favorite design tool, one trick Jason Fried of Basecamp likes to use is to design on paper using a thick Sharpie.

Obsessing over little details just isn’t possible with a Sharpie, so it can be a great way to quickly explore a bunch of different layout ideas.

### Hold the color

Even when you’re ready to refine an idea in higher fidelity, resist the temptation to introduce color right away.

By designing in grayscale, you’re forced to use spacing, contrast, and size to do all of the heavy lifting.

It’s a little more challenging, but you’ll end up with a clearer interface with a strong hierarchy that’s easy to enhance with color later.

### Don’t over-invest

The whole point of designing in low-fidelity is to be able to move fast, so you can start building the real thing as soon as possible.

Sketches and wireframes are disposable — users can’t do anything with static mockups. Use them to explore your ideas, and leave them behind when you’ve made a decision.

## Don’t design too much

You don’t need to design every single feature in an app before you move on to implementation; in fact, it’s better if you don’t.

Figuring out how every feature in a product should interact and how every edge case should look is really hard, especially in the abstract.

How should this screen look if the user has 2000 contacts?

Where should the error message go in this form?

How should this calendar look when there are two events scheduled at the same time?

You’re setting yourself up for frustration by trying to figure this stuff out using only a design tool and your imagination.

Work in cycles

Instead of designing everything up front, work in short cycles. Start by designing a simple version of the next feature you want to build.

Once you’re happy with the basic design, make it real.

You’ll probably run into some unexpected complexity along the way, but that’s the point — it’s a lot easier to fix design problems in an interface you can actually use than it is to imagine every edge case in advance.

Iterate on the working design until there are no more problems left to solve, then jump back into design mode and start working on the next feature.

Don’t get overwhelmed working in the abstract. Build the real thing as early as possible so your imagination doesn’t have to do all the heavy lifting.

### Be a pessimist

Don’t imply functionality in your designs that you aren’t ready to build.

For example, say you’re working on a comment system for a project management tool. You know that one day, you’d like users to be able to attach files to their comments, so you include an attachments section in your design.

You get deep into implementation only to discover that supporting attachments is going to be a lot more work than you anticipated. There’s no way you have time to finish it right now, so the whole commenting system sits on the backburner while you take care of other priorities.

The thing is, a comment system with no attachments would still have been better than no comment system at all, but because you planned to include it from day one you’ve got nothing you can ship.

When you’re designing a new feature, expect it to be hard to build. Designing the smallest useful version you can ship reduces that risk considerably.

If part of a feature is a “nice-to-have”, design it later. Build the simple version first and you’ll always have something to fall back on.
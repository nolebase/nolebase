# MVVM

MVVM 是 通过`数据劫持 + 发布订阅模式`实现的
MVVM 由 界面View 、 数据模型Model 和 ViewModel 组成。
Vue 内部使⽤了 Object.defineProperty() 来实现双向绑定。

- 在 JQuery 时期，如果需要刷新 UI 时，需要先取到对应的 DOM 再更新 UI，这样数据和业务的逻辑就和⻚⾯有强耦合。
- 在 MVVM 中，UI 是通过数据驱动的，数据⼀旦改变就会相应的刷新对应的 UI，UI 如果改变，也会改变对应的数据。这种⽅式就可以在业务处理中只关⼼数据的流转，⽽⽆需直接和⻚⾯打交道。ViewModel 只关⼼数据和业务的处理，不关⼼ View 如何处理数据，在这种情况下，View 和 Model 都可以独⽴出来，任何⼀⽅改变了也不⼀定需要改变另⼀⽅，并且可以将⼀些可复⽤的逻辑放在⼀个 ViewModel 中，让多个 View 复⽤这个 ViewModel。 在 MVVM 中，最核⼼的也就是数据双向绑定，例如 Angluar 的脏数据检测，Vue 中的数据劫持。

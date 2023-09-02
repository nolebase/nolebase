---
tags:
  - 软件/Obsidian
  - 软件/Obsidian/插件
  - 开发/前端
---

# Obsidian 官方文档参考

## 关于 `main.ts`

1. 使用 `require('obsidian')` 导入任何黑曜石 API。
2. 使用 `require('fs')` 或 `require('electron')` 导入 NodeJS 或 Electron API。
3. 必须使用 `export default class` 导出一个扩展 `Plugin` 的默认类
4. 必须使用诸如 `Rollup`、`Webpack` 或其他 JavaScript/TypeScript 打包工具，将所有的外部依赖关系捆绑到这个文件中。

## 黑曜石 App 架构

该应用程序被组织成几个主要模块。

1. App，全局对象，拥有其他一切。你可以在你的插件中通过 `this.app` 访问它。App 接口提供了以下接口的访问器。
2. Vault，让你与保险库中的文件和文件夹互动的接口。
3. Workspace，让你与屏幕上的面板互动的接口。
4. MetadataCache，包含每个markdown文件的缓存元数据的界面，包括标题、链接、嵌入、标签和块。

同时，继承了 Plugin 类之后，可以使用下面的函数：

1. 使用 `this.addRibbonIcon` 添加一个侧边栏图标。
2. 使用 `this.addStatusBarItem` 添加一个状态栏（底部）元素。
3. 使用 `this.addCommand` 添加一个全局命令，可以选择一个默认的热键。
4. 使用 `this.addSettingTab` 添加一个插件设置标签。
5. 使用 `this.registerView` 注册一种新的视图。
6. 使用 `this.loadData` 和 `this.saveData` 来保存和加载插件数据。

对于从任何事件接口注册事件，如 `App` 和 `Workspace`，请使用 `this.registerEvent`，它将在你的插件卸载时自动分离你的事件处理程序。:

```
this.registerEvent(app.on('event-name', callback));
```

如果需要为那些在插件卸载后依然需要存在于页面上的元素注册 DOM 事件，如`window`或`document`事件，请使用`this.registerDomEvent`：

```
this.registerDomEvent(element, 'click', callback);
```

如果需要使用`setInterval`，请使用`this.registerInterval`。

```
this.registerInterval(setInterval(callback, 1000));
```

[obsidianmd/obsidian-api](https://github.com/obsidianmd/obsidian-api)

[obsidianmd/obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)

[第三方插件 - Obsidian 中文帮助 - Obsidian Publish](https://publish.obsidian.md/help-zh/%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95/%E7%AC%AC%E4%B8%89%E6%96%B9%E6%8F%92%E4%BB%B6)

[Obsidian Plugin Development - Alexis Rondeau - Obsidian Publish](https://publish.obsidian.md/alexisrondeau/Obsidian+Plugin+Development)

[Embed files - Obsidian Help](https://help.obsidian.md/How+to/Embed+files)

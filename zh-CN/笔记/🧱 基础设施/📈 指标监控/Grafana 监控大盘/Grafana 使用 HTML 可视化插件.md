---
tags:
  - 开发/云原生/可观测
  - 开发/云原生/可观测/监控
  - 开源/软件/Grafana
  - 运维/云原生/可观测/Grafana
---

# Grafana 使用 HTML 可视化插件

## 概述

Grafana 展示数据时，如果只有简单的状态和字符串信息，Table（表格）可视化就已经足够使用了，但是对于有多种媒体资源或是更复杂的逻辑需求，Table 亦或是别的模版可视化都无法恰当处理。不过，HTML 可视化提供了更多的选项和自由编辑能力。

#### HTML 可视化的优势

- Grafana 提供原有数据结构的自动化处理
- 完全自由的排版和编辑能力
- 更好的交互以及展示体验
- 多媒体资源的处理

#### HTML 可视化的劣势

- Grafana 提供的 API 无法支持动态加载内容
- 无法加载和使用外部 JavaScript 库
- 编写和管理 HTML/CSS/JavaScript 代码会有一定困难
- 需要优化资源加载，防止出现性能问题

## 选择 HTML 可视化

![](./assets/image_20211015122147.png)

在可视化中选择 HTML 即可。

## Grafana API

### 回调函数

在 HTML 可视化选项的下方，有两种 JavaScript 回调函数用于输入和更新 HTML 面板。

1. `onInit(ctrl, htmlnode)` 只会执行一次
2. `onHandleMetric(ctrl, htmlnode)` 这段代码在每次刷新时都会执行

传入参数都是完全一致的：

1. 第一个参数：`ctrl {MetricsPanelCtrl}` 当前 Grafana 面板的实例
2. 第二个参数：`htmlnode {HTMLElement}` HTML 面板内容的 HTML DOM 节点

我们可以通过 ctrl 对象获取数据和 Grafana 面板的设定（比如：全局变量），htmlnode 来编辑和更新 HTML 节点。

### 查询后的数据对象

在 `ctrl.data` 就存放着我们从数据源查询的数据（同样的数据也可以取用 `ctrl.table`，文档缺失，没办法确定具体区别）。
`data` 对象是一个数组，对应的是 Query 页面的不同查询（顺序排列），每一个 `data` 中存放的元素则对应了查询获取的列名（columnNames），以及行数据（rows），行数据的属性顺序也对应了列名的顺序，如果有需要进行遍历，也可以直接映射关系。

## 编写面板

为了方便我们编辑和管理 HTML DOM 节点，我们需要在 HTML 一栏创建对应的子节点（如同 React 或是 Vue 那样）。比如：

```html
<div id="data">
</div>
```

这样我们就可以在 JavaScript 中直接索引到这个节点：

```javascript
const div = htmlnode.getElementById("data")
// 如果需要在每次刷新时移除上一次的节点，可以使用下面的代码来更新：
div.innerHTML = ""
```

在获取到节点后就可以编辑和管理了。

## 提示

### Grafana 8 已失效 刷新整个面板

常规的直接刷新：**`window.location.reload()`** 会刷新整个页面。体验并不好，而且状态不易于存储，甚至可能需要借助于 SessionStorage 或是 LocalStorage。

Grafana 的 JavaScript 调用文档并不是很清晰明了，而且由于各个版本使用的 Angular/React 版本和 API 接口并不相同，查询文档会显得十分困难。

**如果有需要调用到 Grafana 自己的整个调用钩子的话，可以尝试使用 this，或者 ctrl.$injector 的内联函数来完成功能调用。**

此处如果需要刷新整个面板（Dashboard，不是一个一个的面板（Panel））可以直接调用：

```javascript
this.refresh()
```

如果有自己的事件管理，也可以直接绑定事件：

```javascript
loadDatasource(param).then(r => {
    data = r
    console.log('data', r);

    // Wait till data exists has loaded before we handle any data
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('panel-size-changed', this.onResize.bind(this));
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));

    // Refresh after data is loaded
    this.refresh();
});
```

详细引用：[Javascript/jQuery event on regular refresh intervals? - Grafana Community](https://community.grafana.com/t/javascript-jquery-event-on-regular-refresh-intervals/16856)

### Grafana 8 已失效 动态更新变量（Variable）值

如果需要联动查询，可以先设定一个变量（variable）为 Text Box（其他类型未测试，如果有支持，可以补充进来），按需设定是否需要隐藏该变量。

想要直接获取所有变量的引用对象的话可以调用：

```javascript
ctrl.dashboard.getVariables()
```

设定之后直接调用下面封装好的函数即可：

**获取变量为数组**：

```javascript
/**
 * getEnvVariables
 * 通过名称获取环境变量的值
 *
 * @param {String} name - 环境变量名
 * @returns {String}
 */
function getEnvVariables(name) {
    const envVariables = ctrl.dashboard.getVariables()
    let value = ""
    for (let i = 0; i < envVariables.length; i++) {
        const envItem = envVariables[i]
        if (envItem.name === name) {
            value = envItem.current.value
            break
        }
    }

    if (value !== "" && value.indexOf(",") !== -1) {
        const valueArr = value.split(",")
        const resArr = []
        for (let i = 0; i < valueArr.length; i++) {
            let res = parseInt(valueArr[i])
            if (isNaN(res)) {
                continue
            }

            resArr.push(res)
        }
        return resArr
    }
    return []
}
```

**设定字符串为变量**：

```javascript
/**
 * setEnvVariable
 * 设定环境变量
 *
 * @param {String} name - 环境变量名
 * @param {String} value - 环境变量的新值
 */
function setEnvVariable(name, value) {
    const envVariables = ctrl.dashboard.getVariables()
    for (let i = 0; i < envVariables.length; i++) {
        const envItem = envVariables[i]
        if (envItem.name === name) {
            envItem.current.value = value
            envItem.current.text = value
        }
    }
}
```

### 支持长度过长时在面板内滚动

Grafana 的面板现在已经不支持自动延展了，我们可以在 CSS 中添加以下的代码来支持滚动：

```css
#data {
    max-height: 85vh;
    overflow: scroll;
}
```

这样的话就可以限制面板内容渲染在 85% 的可视高度内（如果有别的大小需求可以按需调整），超出的内容则滚动展示。

如果需要动态调整，就像原生 Grafana 那样支持的拖动大小的话，可以获取 ctrl.height，然后使用字符串拼接 cssText：

```javascript
const data = document.getElementById("data")
const maxHeight = ctrl.height - 20 // 预留的空间
data.style.cssText += ` max-height: ${maxHeight}px;"
```

### 调用接口并返回数据

在 Datasource 中选择 --Grafana–（置空）。

然后在 JavaScript 中直接请求数据：

```javascript
async function get() {
    // 获取数据
    const resp = await fetch("https://example.com/api/[path]")
    // 解析为 JSON
    const res = await resp.json()
    console.log(res)
}

get()
```

如果需要维护一个需要更新状态的 HTML，可能需要创建对象、类。

### 兼容 Windows 及其他系统的滚动条样式

类似 Grafana 原生的滚动条样式可以直接复制这个 css：

```css
#data::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

#data::-webkit-scrollbar-thumb {
  background-color: #0d0d0d;
  border-radius: 999px;
}


#data::-webkit-scrollbar-corner {
  background-color: transparent;
}
```

最后一个用于修复滚动条非默认情况下，背景颜色为白色的问题。

### 格式化日期时间为 YYYY-MM-DD HH:MM:SS

可以参考下面的代码

```javascript
// 工具函数
/**
 * getTwoDigitFormat
 * 格式化为两位数
 *
 * @param {Number} 不超过两位数的整数
 * @returns {String}
 */
function getTwoDigitFormat(number) {
    return String(number).slice(-2).padStart(2, "0")
}

// 用法示例
const d = new Date()
const generalFormat = `${d.getFullYear()}-${getTwoDigitFormat(d.getMonth() + 1)}-${getTwoDigitFormat(d.getDate())} ${getTwoDigitFormat(d.getHours())}:${getTwoDigitFormat(d.getMinutes())}:${getTwoDigitFormat(d.getSeconds())}`
console.log(generalFormat)
```

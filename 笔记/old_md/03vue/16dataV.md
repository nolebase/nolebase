---
title: canvas和svg
---

## canvas

`canvas`是h5的新特性，允许使用canvas元素在网页上通过js绘制图像

### 1.canvas标签

`<canvas>`标签只是图像容器，相当于画布，本身没有绘图的能力，所有的绘制工作必须在js内部完成

**必须指定宽高**

```html
<canvas width='800' height='400'></canvas>
```

### 2.getContext()



[https://www.runoob.com/html/html5-canvas.html](https://www.runoob.com/html/html5-canvas.html)

### 3.Canvas - 路径

在Canvas上画线，我们将使用以下两种方法：

- moveTo(*x,y*) 定义线条开始坐标
- lineTo(*x,y*) 定义线条结束坐标

```js
    // canvas 通过js的 '笔(上下文)' 操作
    let canvas = document.querySelector('canvas')
    // 获取上下文
    var ctx = canvas.getContext('2d');
    console.log(ctx)

    // 绘制线
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.lineTo(100, 200);

    ctx.fillStyle = "#FF0000";  // 设置颜图形填充色
    ctx.fill()

    // 设置线段的颜色
    ctx.strokeStyle = 'purple'
    ctx.lineWidth = '20'

    ctx.closePath()
    ctx.stroke();
```

### 4.绘制矩形

- `fillRect(x: number, y: number, w: number, h: number):` 绘制填充颜色的矩形
- `strokeRect(x: number, y: number, w: number, h: number):` 绘制线条矩形

```javascript
    // 绘制矩形
    // 方式一 (描边,没有办法设置颜色) : x,y,w,h
    ctx.strokeRect(100, 30, 100, 200)

    // 方式二（带有填充颜色）
    ctx.fillStyle = 'red'
    ctx.fillRect(200, 30, 100, 150)
```

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220117194813canvas.png" style="zoom:50%;" />

### 5绘制圆形

- `arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean):`
  - x y 圆心的坐标
  - radius 半径
  - startAngle 开始角度
  - endAngle结束角度
  - anticlockwise： 是否逆时针 true：逆时针 false：顺时针

```js
    ctx.beginPath()
    ctx.arc(100, 100, 50, 0, Math.PI * 2, true)
    ctx.stroke()
    ctx.closePath()
    ctx.fillStyle = 'red'
    ctx.fill()


    //
    ctx.beginPath()
    ctx.arc(200,200,50,0,1,true)
    ctx.stroke()
```

### 清除画布

```
clearRect(x: number, y: number, w: number, h: number):
```

### 绘制文字

```
ctx.font = '20px 微软雅黑'
ctx.fillStyle = 'red'
ctx.fillText("数据可视化", 50, 20)
```

### 案例，绘制柱状图



## 2svg

svg（Scalable Vector Graphics）是一种基于xml的图像文件格式，用于网络的基于矢量的图形

### 1.基本的svg元素

不兼容ie8以下

- `<svg>` 包裹并定义整个矢量图。
- `<line>` 直线
- `<polyline>` 折线
- `<rect>` 矩形
- `<circle>` 圆
- `<ellipse>` 圆和椭圆
- `<ploygon>` 多边形
- `<path>` 通过指定点以及点和点之间来创建任意图像

### 2.简单实用

[https://www.runoob.com/svg/svg-path.html](https://www.runoob.com/svg/svg-path.html)

### 3.echarts的基本概念：系列

系列（series） 是指：一组数值映射成对应的图

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220119202033.png)

```js
<script>
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.querySelector('div'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例',
            left: 'center'
        },

        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
            // 柱状图
            {
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }
            ,
            // 这些图
            {
                type: 'line',
                data: [5, 20, 36, 10, 10, 20],
                color: 'pink'

            }
            ,
            //饼图
            {
                type: 'pie',
                data: [{name: 'x', value: 10}, {name: 'x1', value: 90}, {name: 'x3', value: 90}],
                width: 150,
                height: 150,
                left: 150,
                top: 100,
                radius: 20
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

</script>
```

### 4.4charts 4.0 新特性：dataset

dataset（数据集）组件用于单独的数据集声明，从而数据可以单独管理，被多个组件复用，并且可以自由指定数据到视觉的映射。折一特性能将逻辑和数据分离，带来更好的复用。

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220119203455echarts.png)

```js
<script>
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.querySelector('div'));

    let data = [
        ["衬衫", 5, 9, 'x1', 30],
        ["羊毛衫", 20, 19, 'x2', 50],
        ["雪纺衫", 36, 29, 'x3', 40],
        ["裤子", 10, 39, 'x4', 70],
    ]

    // 指定图表的配置项和数据
    var option = {
        dataset: {
            source: data
        },
        title: {
            text: 'ECharts 入门示例',
            left: 'center'
        },

        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子']
        },
        yAxis: {},
        series: [

            // 柱状图
            {
                name: '销量',
                type: 'bar',
                // data: [5, 20, 36, 10, 10, 20]
                encode: {
                    y: 1
                }
            }
            ,
            // 这些图
            {
                type: 'line',
                // data: [5, 20, 36, 10, 10, 20],
                color: 'pink',
                encode: {
                    y: 2
                }

            }
            ,
            //饼图
            {
                type: 'pie',
                // data: [{name: 'x', value: 10}, {name: 'x1', value: 90}, {name: 'x3', value: 90}],
                width: 150,
                height: 150,
                left: 150,
                top: 100,
                radius: 20,
                encode: {
                    itemName: 3,
                    value: 4
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

</script>
```

### 5.echarts基本概念： 组件

echarts中除了其他部分。都可以抽象为`组件`。如xAxis（x轴），yAxis(y轴) , grid(直角坐标系底板) ，angleAxis（极坐标系角度轴）等等

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220119210820echarts.png)

### 6.echarts的基本概念：坐标系

很多系列，如 line，bar，pie等都需要运行在“坐标系”上，坐标系用于布局这些图，以及显示数据的刻度等等。

一个坐标系，可以由多个组件协作而成。如直角坐标系，包括xAxis，yAxis，grid三种组件。

单坐标系：

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220120200713echarts.png)

```js
<script>
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.querySelector('div'));
    // 指定图表的配置项和数据
    // 单坐标系
    var option = {
        title: {
            text: 'ECharts 单坐标系'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {},
        series: [
            {

                type: 'scatter',
                data: [
                    [10, 30],
                    [123, 50],
                    [50, 60],
                    [70, 10],
                    [1, 90],
                ]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

</script>
```



**双坐标系：**

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220120200900echarts.png" style="zoom:50%;" />

```html
<script>
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.querySelector('div'));
    // 指定图表的配置项和数据
    // 双坐标系
    var option = {
        title: {
            text: 'ECharts 双坐标系'
        },
        xAxis: {
            type: 'category',
            data: ['游戏', '音乐', '电影', '动漫']
        },
        yAxis: [
            {
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: true
                }
            }, {
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: true
                }
            },
        ],
        series: [
            {
                type: 'line',
                data: [3, 4, 17, 2],
                yAxisIndex: 0
            },
            {
                type: 'bar',
                data: [30, 4, 1, 21],
                yAxisIndex: 1
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

</script>
```

**多坐标系：**

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202112/20220120201020echarts.png" style="zoom:50%;" />
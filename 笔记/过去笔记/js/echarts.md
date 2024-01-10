# Echarts option 的基础配置

## xAxis x轴

``` ts
const xAxis = {
  type: 'category',
  axisLabel: { showMaxLabel: true }, 
};

const xAxis = {
  type: 'category',
  axisLabel: { 
    showMaxLabel: true, // 显示x轴最大值或最右列对应的标签名字
    interval: 3 // 隔多少个坐标刻度展示一个标签，默认会采用标签不重叠的策略间隔显示标签。
    // 可以设置成 0 强制显示所有标签。
    // 如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
  }, 
  axisTick: { 
    alignWithLabel: true, // 刻度线和标签对齐
    interval: 3 // 隔多少个坐标刻度展示一个刻度
  },
  axisLine: { 
    symbol: ['none', 'arrow'], // 尾端添加箭头
    symbolOffset: 8, // 箭头偏移
    symbolSize: [10, 15] // 箭头的：[高度, 宽度]
  },
  splitLine: { show: false }, // 不显示分割线
  boundaryGap: ['20%', '20%'],
};
```

## yAxis y轴

```ts
const yAxis = {
  type: 'value',
  axisLine: { show: true, symbol: ['none', 'arrow'], symbolOffset: 8, symbolSize: [10, 15] },
  splitLine: { show: false },
  boundaryGap: ['20%', '20%'],
};
```

## grid 绘图网格

`grid` 用实际数字比用百分比好些，可以避免在屏幕宽度大的时候，图边距过大的问题。

```ts
const grid = { left: 50, right: 50, top: 100, bottom: 50 };
```

## tooltip 提示框

默认的提示框如下：
如果有在悬浮框要显示数据，图上`series`中不需要展示数据的情况，则需要第二个方法。并对series中的encode进行指定。我会写另一篇文章进行解释。

``` ts
const tooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'shadow',
  },
  formatter: (params: any[]) => {
    let html = '';
    html += `${params[0].axisValueLabel}<br>`;
    params.forEach((val) => {
      const { marker, seriesName } = val;
      const value = val.value[val.encode.y[0]];
      if (value === '') {
        html += '';
      } else {
        html += `${marker} ${seriesName}: ${transformNum(value, {
          isThousand: true,
          decimal: 2,
        })} <br>`;
      }
    });
    return html;
  },
};
```

``` ts
const tooltip = {
  trigger: 'axis',
  axisPointer: { type: 'shadow' },
  formatter: (params: any[]) => {
    let html = '';
    // 整理marker
    const markers: string[] = [];
    const labelNames: string[] = [];
    params.forEach((param) => {
      const { marker, seriesName } = param;
      markers.push(marker);
      labelNames.push(seriesName);
    });

    const { dimensionNames: names, data: seriesData } = params[0];
    html += `${params[0].axisValueLabel} <br>`;
    for (let i = 1; i < names.length; i += 1) {
      html += `${
        labelNames.includes(names[i]) ? markers[labelNames.indexOf(names[i])] : Marker
      } ${names[i]}: ${transformNum(seriesData[i], {
        isPercentage: true,
      })}<br>`;
    }
    return html;
  },
}
```

## legend 图例

``` ts
const legend = { right: 40, top: 40 };
```

# Vite 配置 SVG 雪碧图和 SVG 压缩

需要用到如下工具

| [vite-plugin-svg-icons ](https://github.com/anncwb/vite-plugin-svg-icons) | 用于生成 SVG 雪碧图 |
| ------------------------------------------------------------ | ------------------- |
| [svgo](https://github.com/svg/svgo)                          | 用于压缩 SVG        |

## 安装依赖
```
pnpm install -D vite-plugin-svg-icons svgo
```

## 配置 SVGO
1 - 在 `src/icons/` 文件夹下创建 `svgo.js` 配置文件（注意，新版 svgo 已经不支持 YAML 格式的配置文件了）

`src/icons/svgo.js`:

```javascript
// src/icon/svgo.js
// svg 压缩配置文件
module.exports = {
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|fill-rule)',
      },
    },
  ],
}

```

2 - 在 `src/icons/` 目录下新建 `filler` 文件夹用来存放需要压缩的 SVG，然后创建一个 `.gitkeep` 文件（这样可以避免它里面没有文件的时候被 git 删除），

3 - 在 `package.json` 的 `"scripts: {}"` 中添加这两个脚本

`package.json`:

```json
{
  "svgo": "svgo -f src/icons/filter --config=src/icons/svgo.js",
  "svgo-color": "svgo -f src/icons/filter"
}
```

**svgo**：用于纯色 svg，会去除 fill 和 fill-rule 色彩标签，保证程序中可以直接控制图标的颜色。

**sego-color**：用于彩色 svg，会保留 fill 和 full-rule 色彩标签。



## 配置 SVG 雪碧图

##### 1. 在 vite.config.ts 中配置插件

找到 plugins 项，导入并添加 `viteSvgIcons`，具体代码如下

`vite.config.ts`:

```typescript
import viteSvgIcons from 'vite-plugin-svg-icons';
import path from 'path';

export default () => {
  return {
    plugins: [
      // SvgIcon 用于生成 svg 雪碧图
      viteSvgIcons({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  };
};
```

##### 2. 在 main.ts 中引入注册脚本

`scr/main.ts`:

```typescript
import 'virtual:svg-icons-register';
```

到这里 svg 雪碧图已经生成，可以在 `src/icons/svg` 目录下放置需要使用的 svg 文件

##### 3. 创建一个组件来使用 SVG 雪碧图

`/src/components/SvgIcon.vue`:

```vue
<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
// ===================================================
// === 使用方法请查阅: 'doc/如何使用 svg-icon 图标.md' ===
// ===================================================
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    /** 前缀 */
    prefix: {
      type: String,
      default: 'icon',
    },
    /** 图标名称 */
    name: {
      type: String,
      required: true,
    },
    /** 图标颜色，也可也通过 css color 属性设置 */
    color: {
      type: String,
      default: 'inherit',
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  },
})
</script>

<style scoped>
svg {
  width: 1.2em;
  height: 1.2em;
  fill: currentColor;
}
</style>

```



**完成后**，通过导入 `<svg-icon name="fileName" />` 组件就可以使用了，如果需要**还可以设置全局导入**。



#### 我还在 doc 文件夹下面创建了使用文档：

`doc/如何使用 svg-icon 图标组件.md`:

```markdown
# svg-icon - SVG 图标使用说明
1. 需要使用的 SVG ICON 放入 `src/icons/filter` 文件夹进行压缩
2. 执行压缩命令命令
    ```shell
    # 适用于单色 svg：
    pnpm run svgo

    # 适用于彩色 svg：
    pnpm run svgo-color
    ```
3. 复制压缩好的 ICON 到 `svg` 文件夹内使用
4. 使用 ⬇️⬇️⬇️⬇️ 方法
    ```html
    <svg-icon name="fileName" />
    ```
5. 详细内容可查阅：https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md

```


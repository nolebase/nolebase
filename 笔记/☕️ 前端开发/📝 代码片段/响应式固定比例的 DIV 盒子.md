---
tags:
  - 开发/前端/Vue
  - 开发/前端/Vue/Vue3
---

# 响应式 DIV 盒子，根据输入的宽高比自动变化大小

| 主体 | 版本号 | 文档地址（如果有） |
| -- | -- | -- |
| Vue | 3.2 |  |

```vue
<!-- 响应式 DIV 盒子，根据输入的宽高比自动变化大小 -->

<script lang="ts" setup>
const props = defineProps({
  /**
    # 两种方案选其一填写
    1. 直接填写宽度/高度
    2. 或者填写计算后的宽高比
   */

  // 宽度
  w: {
    required: true,
    type: Number,
  },
  // 高度
  h: {
    required: true,
    type: Number,
  },

  // 宽高比
  aspectRatio: {
    default: 0,
    type: Number,
  },
})

const aspectRatio = computed(() => `${props.aspectRatio || (props.h / props.w * 100).toFixed(4) || 100}%`)
</script>

<template>
  <div class="reactive-box-frame">
    <div class="reactive-box-frame-pillar" />
    <div class="reactive-box">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.reactive-box-frame {
  width: 100%;
  position: relative;
  display: block;
}
.reactive-box-frame-pillar {
  padding-bottom: v-bind(aspectRatio);
  display: block;
}
.reactive-box {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  overflow: hidden;
}
</style>
```

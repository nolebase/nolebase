---
title: vue项目day05
---

## 1 element ui +按需引入

[https://element.eleme.cn/#/zh-CN/component/installation](https://element.eleme.cn/#/zh-CN/component/installation)

```
npm i element-ui -S

npm install babel-plugin-component -D

```



2.二维码插件

```
npm i qrcode
```



## 2 图片懒加载

[https://www.npmjs.com/package/vue-lazyload](https://www.npmjs.com/package/vue-lazyload)

```
npm i vue-lazyload
```



### 3. 自定义插件

[https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6](https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6)



### 4. 验证插件

[https://www.npmjs.com/package/vee-validate](https://www.npmjs.com/package/vee-validate)

```
npm i vee-validate
```

## 5.路由懒加载

[https://next.router.vuejs.org/zh/guide/advanced/lazy-loading.html](https://next.router.vuejs.org/zh/guide/advanced/lazy-loading.html)



## 6.项目打包优化

npm run build

项目打包后，代码经过压缩加密，如果有报错，就会输出代码在哪里报错，

如果不需，可以通过配制去除

Vue.config.js

```js
module.exports = {
    //  去掉打包后的map文件
    productionSourceMap:false,
    // 关闭 es校验
    lintOnSave: false,
    //配置代理跨域
    devServer: {
        proxy: {
            "/api": {
                target: "http://39.98.123.211",
                // pathRewrite: {'^/api':''}
            },
        },
    },
}

```

## 7 组件通信



### 1.组件通信方式1：props

使用场景:[父子通信]



传递数据类型：

1:可能是函数  -----------实质子组件想给父亲传递数据

2:可能不是函数-----------实质就是父亲给子组件传递数据

\<TodoList :todos="123"  updateChecked="hander">

特殊情况：路由传递props

1:布尔值类型，把路由中params参数映射为组件props数据

2:对象，静态数据，很少用

3:函数，可以把路由中params|query参数映射为组件props数据



### 2.组件通信方式2:自定义事件  

 $emit  $on[简写@]

事件:原生DOM事件----【click|mouseenter........】

事件：自定义事件-----[子给父传递数据]



### 3.组件通信方式3：$bus 全局事件总线----【万能】

组件实例的原型的原型指向的Vue.prototype

### 4组件通信方式4：pubsub-js【发布订阅消息】  在vue中根本不用【React】 ----万能



### 5.组件通信方式5:Vuex[仓库]  -----数据非持久化----万能的

```

核心概念：5
state 
mutations
actions 
getters 
modules
```

### 6.组件通信方式6：插槽-----父子通信【结构】

slot

默认插槽

具名插槽

作用域插槽:子组件的数据来源于父组件，但是子组件的自己的结构有父亲决定。

```
watch|computed|method区别?
{
    name:'王二麻子',
    eat:function(){

    }
}
```



## 8 事件

1:事件相关的深入学习



事件:事件已经学习过两种，第一种原生DOM事件，第二种自定义事件。

\<Event1 @click="handler1">\</Event1>

组件绑定原生DOM事件，并非原生DOM事件，而是所谓的自定义事件。

如果你想把自定义事件变为原生DOM事件，需要加上修饰符.native修饰

这个修饰符，可以把自定义事件【名字：原生DOM类型的】变为原生DOM事件，



## 8 sync 属性修饰符 组件通信方式之一

```
<Child1 :money="money" @update:money="money = $event"></Child1>
<template>
  <div style="background: #ccc; height: 50px;">
    <span>小明每次花100元</span>
    <button @click="$emit('update:money',money - 100)">花钱</button>
    爸爸还剩 {{money}} 元

  </div>
</template>

<script>
export default {
  name: "Child1",
  props: ['money']
}
</script>
```



async

```
<Child2 :money.sync="money"></Child2>

<template>
  <div style="background: #ccc; height: 50px;">
    <span>小明每次花100元</span>
    <button @click="$emit('update:money',money-100)">花钱</button>
    爸爸还剩 {{ money }} 元

  </div>
</template>

<script>
export default {
  name: "Child2",
  props: ['money']
}
```

:money.sync 代表父组件给子组件传递props【money】，同时给当前子组件绑定一个自定义事件 （update:money）



## 9.$attrs 和$listeners 组件通信方式的一种

两者都是组件实例的属性，可以获取到父组件传递给子组件的props和自定义事件

```vue
<template>
  <div>
    <h2>自定义带hover提示的按钮</h2>
    <!--    <el-button type="primary" icon="el-icon-plus" size="mini">add</el-button>-->
    <!--
        @click 是自定义事件
      -->
    <HinButton type="success" icon="el-icon-plus" size="mini" title="提示信息"
               @click="handle"
    >add
    </HinButton>
  </div>

</template>

<script>
import HinButton from '@/pages/communication/AttrsListenersTest/HintButton'

export default {
  name: "AttrslistenersTest",
  components: {
    HinButton
  },
  methods: {
    handle() {
      console.log(666)
    }
  },
}
</script>
```



```vue
<template>
  <div>
    <a :title="title" t>
      <!--      <el-button :type="$attrs.type"></el-button>-->
      <!--
          v-bind 在这里不能用 ：替换
          v-on 在这里不能用 @ 替换
       -->
      <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>


  </div>
</template>

<script>
export default {
  name: "HintButton",
  props: ['title'],
  mounted() {
    // $attrs 组件的一个属性，获取父组件传递过来的props数据,
    // 对于子组件而言，如果子组件用props接收了父组件传递的属性，$attrs就不会再接收该属性了
    console.log(this.$attrs)

    // 获取父组件给子组件传递的自定义
    console.log(this.$listeners)
  }
}
</script>
```




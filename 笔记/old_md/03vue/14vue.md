---
title: vue项目14
---

## 1.$children 和$parent

ref 可以获取某一个组件，子组件

- $children 组件的实例属性，可以获取到当前组件全部的子组件，【数组】
- $parent 组件的实例属性，可以获取到当前组件的父组件，进而操作父组件的数据和方法

**代码**

```vue
<template>
  <div>
    <h2>BABA有存款: {{ money }}</h2>
    <button @click="jieQianXm(100)">找小明借钱100</button>
    <br>
    <button @click="jieQianXh(150)">找小红借钱150</button>
    <br>
    <button @click="jieQianAll(200)">找所有孩子借钱200</button>
    <br>
    <button>我是baba</button>
    <br>
    <Son ref="xm"/>

    <br>
    <Daughter ref="xh"/>
  </div>
</template>

<script>
import Son from "@/pages/communication/ChildrenParentTest/Son"
import Daughter from "@/pages/communication/ChildrenParentTest/Daughter"

export default {
  name: "ChildrenParentTest",
  data() {
    return {
      money: 1000
    }
  },
  methods: {
    jieQianXm(money) {
      //  父组件累加
      this.money += money
      // 子组件要减少
      this.$refs.xm.money -= money
    },
    jieQianXh(money) {
      this.money += money
      this.$refs.xh.money -= money
    },
    jieQianAll(money) {
      this.money += 2 * money
      console.log(this.$children)
      // $children 组件的实例属性，可以获取到当前组件全部的子组件，【数组】
      this.$children.forEach(item => {
        item.money -= money
      })
      //不建议用枚举获取子组件：因为没办法确定到底是那个子组件
      // this.$children[0].money -=money;
    }
  },
  components: {
    Son, Daughter
  }
}
</script>
```



```vue
<template>
  <div style="background: #ccc; height: 50px;">
    <h3>儿子小明: 有存款: {{ money }}</h3>
    <button @click="geiQian(50)">给BABA钱: 50</button>
  </div>
</template>

<script>
export default {
  name: "Son",
  data() {
    return {
      money: 30000
    }
  },
  methods: {
    geiQian(money) {
      // 给父组件数据处理，修改父组件数据
      this.money -= money
      // 父组件数据修改添加
      console.log(this.$parent)
      this.$parent.money += money

    }
  },
}
</script>
```



```vue
<template>
  <div style="background: #ccc; height: 50px;">
    <h3>女儿小红: 有存款: {{ money }}</h3>
    <button @click="geiQian(100)">给BABA钱: 100</button>
  </div>
</template>

<script>
export default {
  name: "Daughter",
  data() {
    return {
      money: 1000
    }
  },
  methods: {
    geiQian(money) {
      // 给父组件数据处理，修改父组件数据
      this.money -= money
      // 父组件数据修改添加
      // $parent 可以获取到当前组件的父组件，进而操作父组件的数据和方法
      console.log(this.$parent)
      this.$parent.money += money

    }
  },
}
</script>
```



## 2.混入 mixin

项目当中很多结构类似的功能，组件复用



MyMixin.js

```js
export default {
    methods: {
        // 对外暴露的对象，放置组件重复的js业务逻辑
        geiQian(money) {
            // 给父组件数据处理，修改父组件数据
            this.money -= money
            // 父组件数据修改添加
            // $parent 可以获取到当前组件的父组件，进而操作父组件的数据和方法
            console.log(this.$parent)
            this.$parent.money += money

        },
    },
    mounted() {
    },
    computed: {

    },
    // 等等等

}

```

```vue
<template>
  <div style="background: #ccc; height: 50px;">
    <h3>女儿小红: 有存款: {{ money }}</h3>
    <button @click="geiQian(100)">给BABA钱: 100</button>
  </div>
</template>

<script>
import MyMixin from "@/pages/communication/ChildrenParentTest/myMixin/MyMixin";
export default {
  name: "Daughter",
  mixins: [MyMixin],
  data() {
    return {
      money: 1000
    }
  },
  methods: {
    // geiQian(money) {
    //   // 给父组件数据处理，修改父组件数据
    //   this.money -= money
    //   // 父组件数据修改添加
    //   // $parent 可以获取到当前组件的父组件，进而操作父组件的数据和方法
    //   console.log(this.$parent)
    //   this.$parent.money += money
    //
    // }
  },
}
</script>
```

## 3.插槽

插槽：可以实现父子组件通信（通信的结构）

- 默认插槽
- 具名插槽
- 作用域插槽： 子组件的数据来源于父组件，但子组件决定不了它的外观 

```vue
<template>
  <div>
    <h2>效果一：显示todo列表时，已完成的为绿色</h2>
    <List :todos="todos">
      <!-- 书写template -->
      <!--
        子组件决定不了结构与外观
       -->
      <template slot-scope="todo">
        <span :style="{color:todo.todo.isComplete?'green':''}">
          {{ todo.todo.text }}
        </span>
      </template>
    </List>
    <hr>
    <h2>效果二：显示todo列表时，带序号 为蓝绿搭配</h2>
    <list1 :todos="todos">
      <template slot-scope="todo">
<!--        {{ todo }}-->
        <span :style="{color:todo.todo.isComplete?'green':'purple'}">
            {{todo.$index}} {{ todo.todo.text}}
        </span>
      </template>
    </list1>

  </div>
</template>

<script>
import List from "@/pages/communication/ScopeSlotTest/List";
import List1 from "@/pages/communication/ScopeSlotTest/List1";

export default {
  name: "ScopeSlotTest",
  data() {
    return {
      todos: [
        {id: 1, text: 'AAA', isComplete: false},
        {id: 2, text: 'BBB', isComplete: true},
        {id: 3, text: 'CCC', isComplete: false},
        {id: 4, text: 'DDD', isComplete: false},
      ]
    }
  },
  components: {
    List, List1
  }
}
</script>
```

```vue
<template>
  <div>
    <ul>
      <li v-for="(todo,index) in todos" :key="index">
        <!-- 坑：熊孩子挖到坑，父亲填坑 -->
        <!-- 数据来源于父亲：但是子组件决定不了结构与外网-->
        <slot :todo="todo"></slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "List",
  props: ['todos']
}
</script>
```



```vue
<template>
  <div>
    <ul>
      <li v-for="(todo,index) in todos" :key="index">
        <!-- 坑：熊孩子挖到坑，父亲填坑 -->
        <!-- 数据来源于父亲：但是子组件决定不了结构与外网-->
        <slot :todo="todo" :$index="index"></slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "List1",
  props: ['todos']
}
</script>
```


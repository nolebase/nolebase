---
title: 03 vue 介绍
---

## 1、vue的生命周期

### 1、mounted函数

**Vue完成模板的解析并把初始的真实DOM元素放入页面后（挂载完毕）调用mounted**

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>

    <h2 :style="{opacity}">hello</h2>
</div>


<script type="text/javascript">
    // const vm
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            opacity: 1
        },
        //Vue完成模板的解析并把初始的真实DOM元素放入页面后（挂载完毕）调用mounted
        mounted() {
            console.log('mounted', this)  // vue 的this
            setInterval(() => {
                this.opacity -= 0.01
                if (this.opacity <= 0) this.opacity = 1
            }, 16)
        },
        methods: {}
    })
    //通过外部的定时器实现（不推荐）
    /*setInterval(() => {
        vm.opacity -= 0.01
        if (vm.opacity <= 0) vm.opacity = 1
    }, 16)*/
</script>

</body>
```

### 2、生命周期原理图

[官网原理图](https://cn.vuejs.org/v2/guide/instance.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%BE%E7%A4%BA)

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210814173248.png" style="zoom:150%;" />

**初始化显示**

- beforeCreate()
- created()
- beforeMount()
- mounted()

**更新状态: this.xxx = value**

- beforeUpdate()
- updated()

**销毁 vue 实例: vm.$destory()**

- beforeDestory()
- destoryed()

### 3、常用的生命周期钩子：

1.mounted: 发送ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】。

2.beforeDestroy: 清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】。

**关于销毁Vue实例**

1.销毁后借助Vue开发者工具看不到任何信息。

2.销毁后自定义事件会失效，但原生DOM事件依然有效。

3.一般不会在beforeDestroy操作数据，因为即便操作数据，也不会再触发更新流程了。

​	

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>

    <h2 :style="{opacity}">hello</h2>

    <button @click="opacity = 1">透明度设置为1</button>

    <button @click="stop">点我停止变换</button>

</div>


<script type="text/javascript">
    // const vm
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            opacity: 1
        },
        //Vue完成模板的解析并把初始的真实DOM元素放入页面后（挂载完毕）调用mounted
        mounted() {
            console.log('mounted', this)  // vue 的this
            console.log('mounted', this)
            this.timer = setInterval(() => {
                console.log('setInterval')
                this.opacity -= 0.01
                if (this.opacity <= 0) this.opacity = 1
            }, 16)
        },
        methods: {
            stop() {
                this.$destroy()
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
            console.log('vm即将驾鹤西游了')
        },
    })

</script>

</body>
```



```html
<body>
<div id="root">

    <h2 id="hh">hello {{name}}</h2>
    <h2 :style="{opacity}">hello</h2>

    <button @click="add">点我n+1</button>
    <button @click="bye">点我销毁vm</button>

</div>


<script type="text/javascript">
    // const vm
    Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

    new Vue({
        el: '#root',
        // template: `
        //   <div>
        //   <h2>当前的n值是：{{ n }}</h2>
        //   <button @click="add">点我n+1</button>
        //   </div>
        // `,
        data: {
            name: 'clxmm',
            opacity: 1,
            n: 1
        },

        methods: {
            add() {
                this.n++
            },
            bye() {
                console.log('bye')
                this.$destroy()
            }
        },
        beforeCreate() {
            console.log('beforeCreate')
            // console.log(this)
            // debugger
        },
        created() {
            console.log('created')
            // console.log(this)
            // debugger
        },
        beforeMount() {
            console.log('beforeMount')
            console.log(this)
            // debugger
        },
        mounted() {
            console.log('mounted')
            // console.log(this.$el instanceof HTMLElement)
            // 在挂在完成后可以对dom的操作有效，不推荐
            // document.getElementById("hh").innerText = 'hello world'
        },
        beforeUpdate() {
            console.log('beforeUpdate')
            // 页面和数据尚未保持同步，
            console.log(this.n)
            // debugger
        },
        updated() {
            console.log('updated')
            // 页面和数据保持同步了
        },
        destroyed() {
            console.log('destroyed')
        },

    })
    //通过外部的定时器实现（不推荐）
    /*setInterval(() => {
        vm.opacity -= 0.01
        if (vm.opacity <= 0) vm.opacity = 1
    }, 16)*/
</script>

</body>
```



## 2、vue组件化编程

Vue中使用组件的三大步骤：

一、定义组件(创建组件)

二、注册组件

三、使用组件(写组件标签)

**一、如何定义一个组件？**

使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options几乎一样，但也有点区别；

区别如下：

	- 1.el不要写，为什么？ ——— 最终所有的组件都要经过一个vm的管理，由vm中的el决定服务哪个容器。
	- 2.data必须写成函数，为什么？ ———— 避免组件被复用时，数据存在引用关系。

备注：使用template可以配置组件结构。

**二、如何注册组件？**

1.局部注册：靠new Vue的时候传入components选项

2.全局注册：靠Vue.component('组件名',组件)

**三、编写组件标签：**

```
<school></school>
```

### 1、简单实用（单文件组件）

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <hello></hello>
    <hr>
    <!-- 第三步：编写组件标签 -->
    <school></school>
    <hr>
    <!-- 第三步：编写组件标签 -->
    <student></student>
</div>


<div id="root2">
    <hello></hello>
</div>


<script type="text/javascript">


    //第一步：创建school组件
    const school = Vue.extend({
        template: `
          <div class="demo">
          <h2>学校名称：{{ schoolName }}</h2>
          <h2>学校地址：{{ address }}</h2>
          <button @click="showName">点我提示学校名</button>
          </div>
        `,
        // el:'#root', //组件定义时，一定不要写el配置项，因为最终所有的组件都要被一个vm管理，由vm决定服务于哪个容器。
        data() {
            return {
                schoolName: 'clxmm',
                address: '北京昌平'
            }
        },
        methods: {
            showName() {
                alert(this.schoolName)
            }
        },
    })


    //第一步：创建student组件
    const student = Vue.extend({
        template: `
          <div>
          <h2>学生姓名：{{ studentName }}</h2>
          <h2>学生年龄：{{ age }}</h2>
          </div>
        `,
        data() {
            return {
                studentName: '张三',
                age: 18
            }
        }
    })


    //第一步：创建hello组件
    const hello = Vue.extend({
        template: `
          <div>
          <h2>你好啊！{{ name }}</h2>
          </div>
        `,
        data() {
            return {
                name: 'Tom'
            }
        }
    })

    //第二步：全局注册组件
    Vue.component('hello', hello)

    new Vue({
        el: '#root',
        data: {
            name: 'clxmm'
        },
        //第二步：注册组件（局部注册）
        components: {
            school,
            student
        },
        methods: {}
    })

    new Vue({
        el: '#root2',
    })
</script>

</body>
```

### 2、几个注意事项

**1.关于组件名:**

- 一个单词组成：
    - 第一种写法(首字母小写)：school
    - 第二种写法(首字母大写)：School
- 多个单词组成：
    - 第一种写法(kebab-case命名)：my-school
    - 第二种写法(CamelCase命名)：MySchool (需要Vue脚手架支持)
- 备注：
    - (1).组件名尽可能回避HTML中已有的元素名称，例如：h2、H2都不行。
    - (2).可以使用name配置项指定组件在开发者工具中呈现的名字。

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <hr>
    <!-- 第三步：编写组件标签 -->
    <my-school></my-school>
    <hr>
    <my-school/>
</div>
<script type="text/javascript">


    //第一步：创建school组件
    const school = Vue.extend({
        // 自定义组件名，在开发者工具中显示的名字
        name: 'myname',
        template: `
          <div class="demo">
          <h2>学校名称：{{ schoolName }}</h2>
          <h2>学校地址：{{ address }}</h2>
          <button @click="showName">点我提示学校名</button>
          </div>
        `,
        // el:'#root', //组件定义时，一定不要写el配置项，因为最终所有的组件都要被一个vm管理，由vm决定服务于哪个容器。
        data() {
            return {
                schoolName: 'clxmm',
                address: '北京昌平'
            }
        },
        methods: {
            showName() {
                alert(this.schoolName)
            }
        },
    })


    new Vue({
        el: '#root',
        data: {
            name: 'clxmm'
        },
        //第二步：注册组件（局部注册）
        components: {
            // 如果传入的school只是一个对象，vue会自动调用extend
            'my-school': school
        },
        methods: {}
    })

</script>
</body>
```

### 3、组件的嵌套

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210815142229.png)

```html
<div id="root">

    <!--    <app></app>-->
    <hr>
</div>
<script type="text/javascript">

    const student = Vue.extend({
        // 自定义组件名，在开发者工具中显示的名字
        name: 'myname',
        template: `
          <div class="demo">
          <h2>学生名称：{{ name }}</h2>
          <h2>age：{{ age }}</h2>
          <button @click="showName">点我学生姓名</button>
          </div>
        `,
        // el:'#root', //组件定义时，一定不要写el配置项，因为最终所有的组件都要被一个vm管理，由vm决定服务于哪个容器。
        data() {
            return {
                name: 'clxmm',
                age: 18
            }
        },
        methods: {
            showName() {
                alert(this.name)
            }
        },
    })

    //第一步：创建school组件
    const school = Vue.extend({
        // 自定义组件名，在开发者工具中显示的名字
        // name: 'school',
        template: `
          <div class="demo">
          <h2>学校名称：{{ schoolName }}</h2>
          <h2>学校地址：{{ address }}</h2>
          <button @click="showName">点我提示学校名</button>

          <student></student>
          </div>
        `,
        // el:'#root', //组件定义时，一定不要写el配置项，因为最终所有的组件都要被一个vm管理，由vm决定服务于哪个容器。
        data() {
            return {
                schoolName: 'clxmm',
                address: '北京昌平'
            }
        },
        methods: {
            showName() {
                alert(this.schoolName)
            }
        },
        components: {
            student
        }
    })


    //定义hello组件
    const hello = Vue.extend({
        template: `<h1>{{ msg }}</h1>`,
        data() {
            return {
                msg: 'hello 组件！'
            }
        }
    })


    //定义app组件
    const app = Vue.extend({
        template: `
          <div>
          <hello></hello>
          <school></school>
          </div>
        `,
        components: {
            school,
            hello
        }
    })


    new Vue({
        el: '#root',
        template: '<app></app>',
        data: {
            name: 'clxmm'
        },
        //第二步：注册组件（局部注册）
        components: {
            // 如果传入的school只是一个对象，vue会自动调用extend
            'my-school': school,
            // student
            app
        },
        methods: {}
    })

</script>

</body>
```

### 4、VueComponent

- 1.school组件本质是一个名为VueComponent的构造函数，且不是程序员定义的，是Vue.extend生成的。
- 2.我们只需要写\<school/>或\<school>\</school>，Vue解析时会帮我们创建school组件的实例对象，即Vue帮我们执行的：new VueComponent(options)。
- 3.特别注意：每次调用Vue.extend，返回的都是一个全新的VueComponent！！！！
- 4.关于this指向：
  - (1).组件配置中：data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【VueComponent实例对象】。
  - (2).new Vue(options)配置中：data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【Vue实例对象】。
- 5.VueComponent的实例对象，以后简称vc（也可称之为：组件实例对象）。Vue的实例对象，以后简称vm。

### 5、一个重要的内置关系

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210815160127.png)

- 1.一个重要的内置关系：VueComponent.prototype.__proto__ === Vue.prototype
- 2.为什么要有这个关系：让组件实例对象（vc）可以访问到 Vue原型上的属性、方法。

```html
<body>
<div id="root">
</div>
<script type="text/javascript">


    //定义school组件
    const school = Vue.extend({
        name: 'school',
        template: `
          <div>
          <h2>学校名称：{{ name }}</h2>
          <h2>学校地址：{{ address }}</h2>
          <button @click="showX">点我输出x</button>
          </div>
        `,
        data() {
            return {
                name: '尚硅谷',
                address: '北京'
            }
        },
        methods: {
            showX() {
                console.log(this.x)
            }
        },
    })

    //创建一个vm
    const vm = new Vue({
        el: '#root',
        data: {
            msg: '你好'
        },
        components: {school}
    })


    console.log(school.prototype.__proto__ === Vue.prototype)   //true

    //定义一个构造函数
    /* function Demo(){
        this.a = 1
        this.b = 2
    }
    //创建一个Demo的实例对象
    const d = new Demo()

    console.log(Demo.prototype) //显示原型属性

    console.log(d.__proto__) //隐式原型属性

    console.log(Demo.prototype === d.__proto__)

    //程序员通过显示原型属性操作原型对象，追加一个x属性，值为99
    Demo.prototype.x = 99

    console.log('@',d) */
</script>

</body>
```

## 3、vue单文件组件

School.vue

```vue
<template>
  <div class="demo">
    <h2>学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
    <button @click="showName">点我提示学校名</button>
  </div>
</template>

<script>

export default {
  name: 'School',
  data() {
    return {
      name: 'clxmm',
      address: '北京昌平'
    }
  },
  methods: {
    showName() {
      alert(this.name)
    }
  },
}

</script>


<style>
.demo {
  background-color: orange;
}
</style>
```

App.vue

```vue
<template>
  <div>
    <School></School>
    <Student></Student>
  </div>
</template>

<script>
//引入组件
import School from './School.vue'
import Student from './Student.vue'


export default {
  name: 'app',
  components: {
    School,
    Student
  }
}
</script>
```

Main.js

```vue
import App from './App'


new Vue({
    el: '#root',
    template: `<App></App>`,
    comments: {App}
})
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<!-- 准备一个容器 -->
<div id="root"></div>
<!-- <script type="text/javascript" src="../js/vue.js"></script> -->
 <script type="text/javascript" src="./main.js"></script>

</body>
</html>
```

## 4、vue脚手架使用

[vue cli](https://cli.vuejs.org/zh/guide/)

### 1、 脚手架文件结构

	├── node_modules 
	├── public
	│   ├── favicon.ico: 页签图标
	│   └── index.html: 主页面
	├── src
	│   ├── assets: 存放静态资源
	│   │   └── logo.png
	│   │── component: 存放组件
	│   │   └── HelloWorld.vue
	│   │── App.vue: 汇总所有组件
	│   │── main.js: 入口文件
	├── .gitignore: git版本管制忽略的配置
	├── babel.config.js: babel的配置文件
	├── package.json: 应用包配置文件 
	├── README.md: 应用描述文件
	├── package-lock.json：包版本控制文件
 ### 2、关于不同版本的Vue

1. vue.js与vue.runtime.xxx.js的区别：
    1. vue.js是完整版的Vue，包含：核心功能 + 模板解析器。
    2. vue.runtime.xxx.js是运行版的Vue，只包含：核心功能；没有模板解析器。
2. 因为vue.runtime.xxx.js没有模板解析器，所以不能使用template这个配置项，需要使用render函数接收到的createElement函数去指定具体内容。

### 3、**vue.config.js配置文件**

1. 使用vue inspect > output.js可以查看到Vue脚手架的默认配置。

2. 使用vue.config.js可以对脚手架进行个性化定制，详情见：https://cli.vuejs.org/zh

### 4、**ref属性**

1. 被用来给元素或子组件注册引用信息（id的替代者）
2. 应用在html标签上获取的是真实DOM元素，应用在组件标签上是组件实例对象（vc）
3. 使用方式：
    1. 打标识：```<h1 ref="xxx">.....</h1>``` 或 ```<School ref="xxx"></School>```
    2. 获取：```this.$refs.xxx```

### 5、**props配置项**

1. 功能：让组件接收外部传过来的数据

2. 传递数据：```<Demo name="xxx"/>```

3. 接收数据：

    1. 第一种方式（只接收）：```props:['name'] ```

    2. 第二种方式（限制类型）：```props:{name:String}```

    3. 第三种方式（限制类型、限制必要性、指定默认值）：

        ```js
        props:{
        	name:{
        	type:String, //类型
        	required:true, //必要性
        	default:'老王' //默认值
        	}
        }
        ```

    > 备注：props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制props的内容到data中一份，然后去修改data中的数据。

### 6、**## mixin(混入)**

1. 功能：可以把多个组件共用的配置提取成一个混入对象

2. 使用方式：

    第一步定义混合：

    ```
    {
        data(){....},
        methods:{....}
        ....
    }
    ```

    第二步使用混入：

    	全局混入：```Vue.mixin(xxx)```
    	局部混入：```mixins:['xxx']	```

### 7、**插件**

1. 功能：用于增强Vue

2. 本质：包含install方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据。

3. 定义插件：

    ```js
    对象.install = function (Vue, options) {
        // 1. 添加全局过滤器
        Vue.filter(....)
    
        // 2. 添加全局指令
        Vue.directive(....)
    
        // 3. 配置全局混入(合)
        Vue.mixin(....)
    
        // 4. 添加实例方法
        Vue.prototype.$myMethod = function () {...}
        Vue.prototype.$myProperty = xxxx
    }
    ```

4. 使用插件：```Vue.use()```

```js
import plugins from './plugins'

Vue.use(plugins,1,2)
```

### 8、scoped

1. 作用：让样式在局部生效，防止冲突。
2. 写法：```<style scoped>```

## 5、**总结TodoList案例**

### nanoid 

npm i nanoid

```
import {nanoid} from 'nanoid'
var id = nanoid()
```



1. 组件化编码流程：

    	(1).拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突。
	
    	(2).实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：
	
    			1).一个组件在用：放在组件自身即可。
	
    			2). 一些组件在用：放在他们共同的父组件上（<span style="color:red">状态提升</span>）。
	
    	(3).实现交互：从绑定事件开始。

2. props适用于：

    	(1).父组件 ==> 子组件 通信
	
    	(2).子组件 ==> 父组件 通信（要求父先给子一个函数）

3. 使用v-model时要切记：v-model绑定的值不能是props传过来的值，因为props是不可以修改的！

4. props传过来的若是对象类型的值，修改对象中的属性时Vue不会报错，但不推荐这样做。


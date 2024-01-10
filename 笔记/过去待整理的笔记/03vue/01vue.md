---
title: 01 vue 介绍
---

## 1、Vue 简介

### 1 官网

1. 英文官网: https://vuejs.org/
2. 中文官网: https://cn.vuejs.org/



动态构建用户界面的**渐进式** JavaScript 框架

### 2  Vue 的特点

- 遵循 MVVM 模式
- 编码简洁, 体积小, 运行效率高, 适合移动/PC 端开发
- 它本身只关注 UI, 也可以引入其它第三方库开发项目

1、**组件化**模式

2、**声明式**编码

3、虚拟dom

### 3与其它 JS 框架的关联

1. 借鉴 Angular 的模板和数据绑定技术
2. 借鉴 React 的组件化和虚拟 DOM 技术

## 2、开始学习vue

### 1 初始vue

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>初识Vue</title>
		<!-- 引入Vue -->
		<script type="text/javascript" src="../js/vue.js"></script>
	</head>
	<body>
		<!-- 
			初识Vue：
				1.想让Vue工作，就必须创建一个Vue实例，且要传入一个配置对象；
				2.root容器里的代码依然符合html规范，只不过混入了一些特殊的Vue语法；
				3.root容器里的代码被称为【Vue模板】；
				4.Vue实例和容器是一一对应的；
				5.真实开发中只有一个Vue实例，并且会配合着组件一起使用；
				6.{{xxx}}中的xxx要写js表达式，且xxx可以自动读取到data中的所有属性；
				7.一旦data中的数据发生改变，那么页面中用到该数据的地方也会自动更新；

				注意区分：js表达式 和 js代码(语句)
						1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方：
									(1). a
									(2). a+b
									(3). demo(1) 函数调用表达式
									(4). x === y ? 'a' : 'b'

						2.js代码(语句)
									(1). if(){}
									(2). for(){}
		-->

		<!-- 准备好一个容器 -->
		<div id="demo">
			<h1>Hello，{{name.toUpperCase()}}，{{address}}</h1>
		</div>

		<script type="text/javascript" >
			Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。

			//创建Vue实例
			new Vue({
				el:'#demo', //el用于指定当前Vue实例为哪个容器服务，值通常为css选择器字符串。
				data:{ //data中用于存储数据，数据供el所指定的容器去使用，值我们暂时先写成一个对象。
					name:'atguigu',
					address:'北京'
				}
			})

		</script>
	</body>
</html>
```

### 2、模版语法

```html
<body>

<!--
        Vue模板语法有2大类：
            1.插值语法：
                    功能：用于解析标签体内容。
                    写法：{{xxx}}，xxx是js表达式，且可以直接读取到data中的所有属性。
            2.指令语法：
                    功能：用于解析标签（包括：标签属性、标签体内容、绑定事件.....）。
                    举例：v-bind:href="xxx" 或  简写为 :href="xxx"，xxx同样要写js表达式，
                             且可以直接读取到data中的所有属性。
                    备注：Vue中有很多的指令，且形式都是：v-????，此处我们只是拿v-bind举个例子。

 -->
<div id="root">
    <h1>插值语法</h1>
    <h1>{{name}}</h1>
    <hr>
    <h1>指令语法</h1>
    <a v-bind:href="url">baidu</a>
    <a :href="url.toUpperCase()">baidu</a>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: "hello world",
            url: 'http://www.baidu.com'
        }
    })
</script>

</body>
```

### 3、数据绑定

```html
<body>

<div id="root">
    单向数据绑定：<input type="text" v-bind:value="name"> <br>
    双向数据绑定：<input type="text" v-model:value="name"> <br>

    <h1>简写 </h1>
    单向数据绑定：<input type="text" :value="name"> <br>
    双向数据绑定：<input type="text" v-model="name">

    <!-- 如下代码是错误的，因为v-model只能应用在表单类元素（输入类元素）上 -->
    <!-- <h2 v-model:x="name">你好啊</h2> -->
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm'
        }
    })
</script>

</body>
```

### 4、el与data的两种写法

```
data与el的2种写法
   1.el有2种写法
        (1).new Vue时候配置el属性。
        (2).先创建Vue实例，随后再通过vm.$mount('#root')指定el的值。
    2.data有2种写法
        (1).对象式
        (2).函数式
        如何选择：目前哪种写法都可以，以后学习到组件时，data必须使用函数式，否则会报错。
     3.一个重要的原则：
        由Vue管理的函数，一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例了。
```



```html
<body>
<div id="root">
    <h1>hello {{name}}</h1>
</div>


<script type="text/javascript">
    /*    // el的两种写法
        const v = new Vue({
            // el: '#root',  //第一种写法
            data: {
                name: 'world'
            }
        })

        console.log(v)
        v.$mount('#root')  //第二种写法*/

    //data的两种写法
    new Vue({
        el: '#root',
        //data的第一种写法：对象式
        /* data:{
            name:'clxmm'
        } */
        //data的第二种写法：函数式,组件的时候要用函数式写法
        // data:function (){
        data() {
            console.log('@@@', this) //此处的this是Vue实例对象
            return {
                name: '尚硅谷'
            }
        }

    })
</script>

</body>
```

### 5 mvvm模型

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210806221312.png)

[https://cn.vuejs.org/v2/guide/instance.html](https://cn.vuejs.org/v2/guide/instance.html)

1. M:模型(Model) :对应 data 中的数据

2. V:视图(View) :模板

3. VM:视图模型(ViewModel) : Vue 实例对象

![](https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210806221516.png)

```
			MVVM模型
						1. M：模型(Model) ：data中的数据
						2. V：视图(View) ：模板代码
						3. VM：视图模型(ViewModel)：Vue实例
			观察发现：
						1.data中所有的属性，最后都出现在了vm身上。
						2.vm身上所有的属性 及 Vue原型上所有属性，在Vue模板中都可以直接使用。
```



```html
<body>
<div id="root">
    <div>{{name}}</div>
    <div>{{address}}</div>
    <div>测试1 {{1+1}}</div>

    <div>测试2 {{$options}}</div>
    <div>测试4 {{$emit}}</div>
    <div>测试3 {{_c}}</div>
</div>


<script type="text/javascript">
    const  vm = new Vue({
        el: '#root',
        data: {
            name:'clxmm',
            address: '山寨'
        }
    })

    console.log(vm)
</script>

</body>
```

### 6、数据代理

> 回顾Object.defineproperty方法

```html
<script type="text/javascript">

    let number = 18
    let person = {
        name:'张三',
        sex:'男',
    }

    Object.defineProperty(person,'age',{
        value:18,
        enumerable:true, //控制属性是否可以枚举，默认值是false
        writable:true,//控制属性是否可以被修改，默认值是false
        configurable:true,//控制属性是否可以被删除，默认值是false
        get(){
            console.log('有人读取age属性了')
            return number
        },

        //当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
        set(value){
            console.log('有人修改了age属性，且值是',value)
            number = value
        }
    })


    console.log(Object.keys(person))
    for (let key in person) {
        console.log(person[key])
    }


    console.log(person)
</script>
```

> 何为数据代理

```html
<!-- 数据代理：通过一个对象代理对另一个对象中属性的操作（读/写）-->
<script type="text/javascript" >
    let obj = {x:100}
    let obj2 = {y:200}

    Object.defineProperty(obj2,'x',{
        get(){
            return obj.x
        },
        set(value){
            obj.x = value
        }
    })
</script>
```

> vue中的数据代理

```
1.Vue中的数据代理：
	通过vm对象来代理data对象中属性的操作（读/写）
2.Vue中数据代理的好处：
	更加方便的操作data中的数据
3.基本原理：
	通过Object.defineProperty()把data对象中所有属性添加到vm上。
	为每一个添加到vm上的属性，都指定一个getter/setter。
	在getter/setter内部去操作（读/写）data中对应的属性。
```

### 7 、事件处理

> 事件的基本使用：

1.使用v-on:xxx 或 @xxx 绑定事件，其中xxx是事件名；

2.事件的回调需要配置在methods对象中，最终会在vm上；

3.methods中配置的函数，不要用箭头函数！否则this就不是vm了；

4.methods中配置的函数，都是被Vue所管理的函数，this的指向是vm 或 组件实例对象；

5.@click="demo" 和 @click="demo($event)" 效果一致，但后者可以传参；

```html
<div id="root">
    <h2>hello {{name}}</h2>
    <button v-on:click="showInfo">点击（不传参）</button>
    <button @click="showInfo2($event,66)">点我提示信息2（传参）</button>

</div>

<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name:'clxmm',
        },
        methods: {
            showInfo(event) {
                // console.log(event.target.innerText)
                // console.log(this) //此处的this是vm
                alert('同学你好！')
            },
            showInfo2(event,number){
                console.log(event,number)
                // console.log(event.target.innerText)
                // console.log(this) //此处的this是vm
                alert('同学你好！！')
            }
        }
    })
</script>
```

> 事件修饰符

Vue中的事件修饰符：

1.prevent：阻止默认事件（常用）；

2.stop：阻止事件冒泡（常用）；

3.once：事件只触发一次（常用）；

4.capture：使用事件的捕获模式；

5.self：只有event.target是当前操作的元素时才触发事件；

6.passive：事件的默认行为立即执行，无需等待事件回调执行完毕；

```html
<style>
    * {
        margin-top: 20px;
    }

    .demo1 {
        height: 50px;
        background-color: skyblue;
    }

    .box1 {
        padding: 5px;
        background-color: skyblue;
    }

    .box2 {
        padding: 5px;
        background-color: orange;
    }

    .list {
        width: 200px;
        height: 200px;
        background-color: peru;
        overflow: auto;
    }

    li {
        height: 100px;
    }
</style>
<body>
<div id="root">
    <h2>hello,{{name}}</h2>
    <!-- 阻止默认事件（常用） -->
    <a href="http://www.baidu.com" @click.prevent="showInfo">点击</a>

    <!-- 阻止事件冒泡（常用） -->
    <div class="demo1" @click="showInfo">
        <button @click.stop="showInfo">点我提示信息</button>
        <!-- 修饰符可以连续写 -->
        <!-- <a href="http://www.atguigu.com" @click.prevent.stop="showInfo">点我提示信息</a> -->
    </div>

    <!-- 事件只触发一次（常用） -->
    <button @click.once="showInfo">点我提示信息</button>


    <!-- 使用事件的捕获模式 -->
    <div class="box1" @click.capture="showMsg(1)">
        div1
        <div class="box2" @click="showMsg(2)">
            div2
        </div>
    </div>


    <!-- 只有event.target是当前操作的元素时才触发事件； -->
    <div class="demo1" @click.self="showInfo">
        <button @click="showInfo">点我提示信息</button>
    </div>

    <!-- 事件的默认行为立即执行，无需等待事件回调执行完毕； -->
    <ul @wheel.passive="demo" class="list">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
    </ul>


</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm'
        },
        methods: {
            showInfo(e) {
                // e.preventDefault()
                alert("hello world")
                // console.log(e.target)
            },
            showMsg(msg) {
                console.log(msg)
            },
            demo() {
                for (let i = 0; i < 100000; i++) {
                    console.log('#')
                }
                console.log('累坏了')
            }
        }
    })
</script>

</body>
```

> 按键修饰

1.Vue中常用的按键别名：

- 回车 => enter
- 删除 => delete (捕获“删除”和“退格”键)
- 退出 => esc
- 空格 => space
- 换行 => tab (特殊，必须配合keydown去使用)
- 上 => up
- 下 => down
- 左 => left
- 右 => right

2.Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）

3.系统修饰键（用法特殊）：ctrl、alt、shift、meta

	- (1).配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
	- (2).配合keydown使用：正常触发事件。

4.也可以使用keyCode去指定具体的按键（不推荐）

5.Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <input type="text" @keyup.enter="showInfo">
   <input type="text" @keyup.ctrl.y="showInfo">
</div>


<script type="text/javascript">

    // 回车
    Vue.config.keyCodes.huiche = 13 //定义了一个别名按键

    new Vue({
        el: '#root',
        data: {
            name: 'clxmm'
        },
        methods: {
            showInfo(e) {
                // if (e.keyCode !== 13)  return
                console.log(e.target.value)

            }
        }
    })
</script>

</body>
```



### 8、计算属性

> 姓名案例_插值语法实现

```html
<div id="root">
    <h2>hello {{name}}</h2>
    姓：<input type="text" v-model="firstName"> <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    全名：<span>{{firstName}}-{{lastName}}</span>
    
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            firstName:'c',
            lastName:'lx'
        },
        methods: {

        }
    })
</script>
```



[https://cn.vuejs.org/v2/style-guide/#%E6%A8%A1%E6%9D%BF%E4%B8%AD%E7%AE%80%E5%8D%95%E7%9A%84%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90](https://cn.vuejs.org/v2/style-guide/#%E6%A8%A1%E6%9D%BF%E4%B8%AD%E7%AE%80%E5%8D%95%E7%9A%84%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90)

> 姓名案例_methods

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    姓：<input type="text" v-model="firstName"> <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    全名：<span>{{fullName()}}</span>

</div>
 

<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            firstName: 'c',
            lastName: 'lx'
        },
        methods: {
            fullName() {
                console.log('@---fullName')
                return this.firstName + '-' + this.lastName
            }
        }
    })
</script>
```

> 姓名案例_计算属性

1.定义：要用的属性不存在，要通过已有属性计算得来。

2.原理：底层借助了Objcet.defineproperty方法提供的getter和setter。

3.get函数什么时候执行？

​	(1).初次读取时会执行一次。

​	(2).当依赖的数据发生改变时会被再次调用。

4.优势：与methods实现相比，内部有缓存机制（复用），效率更高，调试方便。

5.备注：

​	1.计算属性最终会出现在vm上，直接读取使用即可。

​	2.如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变。

```html
<div id="root">
    <h2>hello {{name}}</h2>
    姓：<input type="text" v-model="firstName"> <br/><br/>
    名：<input type="text" v-model="lastName"> <br/><br/>
    测试：<input type="text" v-model="x"> <br/><br/>
    全名：<span>{{fullName}}</span> <br/><br/>
    全名：<span>{{fullName}}</span> <br/><br/>
    全名：<span>{{fullName}}</span> <br/><br/>

</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            firstName: 'c',
            lastName: 'lx',
            x: '你好'
        },
        computed: {
            fullName: {
                //get有什么作用？当有人读取fullName时，get就会被调用，且返回值就作为fullName的值
                //get什么时候调用？1.初次读取fullName时。2.所依赖的数据发生变化时。
                get() {
                    console.log('get被调用了')
                    // console.log(this) //此处的this是vm
                    return this.firstName + '-' + this.lastName
                },
                //set什么时候调用? 当fullName被修改时。
                set(value) {
                    console.log('set', value)
                    const arr = value.split('-')
                    this.firstName = arr[0]
                    this.lastName = arr[1]
                }
            }
        },
        methods: {}
    })
</script>

</body>
```

> 计算属性简写

当不需要setter方法时，可以简写

```html
<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            firstName: 'c',
            lastName: 'lx',
            x: '你好'
        },
        computed: {
/*            fullName: {
                get() {
                    console.log('get被调用了')
                    // console.log(this) //此处的this是vm
                    return this.firstName + '-' + this.lastName
                },
                //set什么时候调用? 当fullName被修改时。
                set(value) {
                    console.log('set', value)
                    const arr = value.split('-')
                    this.firstName = arr[0]
                    this.lastName = arr[1]
                }

            },*/
            // 简写
            fullName(){
                console.log('get被调用了')
                return this.firstName + '-' + this.lastName
            }
        },
        methods: {}
    })
</script>
```


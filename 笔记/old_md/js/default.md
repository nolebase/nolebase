# 原型和原型链

## 概念

- 每个函数都有 prototype 属性，除了 Function.prototype.bind() ，该属性指向原型。
- 每个对象都有 __proto__ 属性，指向了创建该对象的构造函数的原型。其实这个属性指向了 [[prototype]] ，但是 [[prototype]] 是内部属性，我们并不能访问到，所以使⽤ _proto_ 来访问。
- 对象可以通过 __proto__ 来寻找不属于该对象的属性， __proto__ 将对象连接起来组成了
原型链。

JavaScript只有一种结构：对象。每个实例对象都有一个私有属性 `_proto_`，指向它的构造函数的原型对象`prototype`。该原型对象也有自己的原型对象`_proto_`。层层向上，知道一个对象的原型对象为`null`。`null`没有原型，并作为原型链的最后一个节点。

[继承与原型链 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

# indexOf 和 findIndex

## indexOf

> Array.prototype.indexOf()
>
> indexOf() 方法返回在数组中可以找到的第一个给定元素的第一个索引，如果不存在，则返回 -1.



例如：

```typescript
const sister = ['a', 'b', 'c']
console.log(sister.indexOf('b')) // -1
```



请注意：`indexOf()` 使用严格等号来比较元素。所以，`indexOf` 更多的是用于查找基本类型，如果是对象类型，则是判断是否是同一对象的引用。



## findIndex

> Array.prototype.findIndex()
>
> findIndex() 方法返回数组中满足提供测试函数的第一个元素的索引。若没有找到对应的元素，则返回 -1

[Array.prototype.findIndex() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

```javascript
const sisters = [10, 9, 12, 15]
const isLargerNumber = (element) => element > 13
console.log(sisters.findIndex(isLargerNumber)) // 3
```

`findIndex()`期望回调函数作为第一个参数，如果你需要非基本类型数组（例如对象的索引），或者你的查找条件更复杂，可以使用这个方法



# 闭包

## 什么是闭包

闭包是能够读取其他函数作用域变量的函数。

[闭包 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

```javascript
function A() {
  var a = 1;
  function B() {
    console.log(a);
  }
  return B();
}
```

### 闭包的特征

- 函数内再嵌套函数
- 内部函数可以引用外层的参数和变量
- 参数和变量不会被垃圾回收制回收

# 继承

## ES5 继承

```typescript
function SuperType () {
	// 属性
	this. name = 'SuperType';
}
// 原型方法
SuperType.prototype.sayName = function () {
  return this.name;
}
```

# ES6

## 数组解构

```
let [a, b, c] = [1, 2, 3] // a: 1, b: 2, c: 3
let [d, [e], f] = [1, [2], 3] // 嵌套数组解构 d: 1, e: 2, f: 3
let [g, ...h] = [1, 2, 3] // 数组拆分 g: 1, h: [ 2, 3]
let [i, , j] = [ 1, 2, 3] // 跳跃解构 i: 1, j: 3
let [k, l] = [1, 2, 3] // 局部解构 k: 1, l: 2
```







# 网络协议

 网络分层分为两种： OSI模型和 TCP/IP模型

OSI模型： 应用层 Application、表示层 Presentation 、会话层 Session 、传输层 Transport 、网络层 Network 、数据链路层 Data Link、物理层 Physical

TCP/IP模型：应用层 Application 、传输层Host-to-Host Transport、互联网层 Internet、网络接口层 Network Interface







# 函数的防抖和节流

## 防抖`debounce`

- 多次触发，只在最后一次触发时，执行目标函数。





## 节流 `throttle`

限制目标函数调用的频率，比如1秒不能调用2次。

## 箭头函数与普通函数的区别

- 语法更加简洁、清晰
- 箭头函数不会创建自己的this，所以它没有自己的this，它只会从自己的作用域链的上一层继承this。
- 不能作为构造函数使用
- 没有自己的arguments对象
- 没有原型prototype
- 不能用作Generator函数，不能使用yield关键字

## new 实例化对象的过程

- 创建一个新的空对象
- 将新对象的 `__proto__` 指向构造函数的prototype
- 将构造函数中this指向新对象（借助 call/apply）
- 判断构造函数的返回值
- 设置了返回值：
- 若返回值为引用值，则返回引用值；若返回值为原始数据，则返回新对象；未设置返回值：返回新对象。

```js
function newFn (Fn, params) {
    // 创建一个新的空对象 instance
    const instance = {}

    // 将 instance 的 __proto__ 属性指向构造函数的原型（Fn.prototype）
    instance.__proto__ = Fn.prototype
    
    const instance = Object.create(Fn.prototype)
    // 以 instance 来调用执行构造函数（借助 call/apply）
    const result = Fn.apply(instance, params)

    // 判断构造函数的返回值，返回 instance 或函数返回值（当构造函数返回值为 object 时）
    return (result && (typeof result === 'object' || typeof result === 'function')) ? result : instance
}

```


## 重排和重绘

- https://juejin.cn/post/6844904083212468238
- https://imweb.io/topic/5c2206a7611a25cc7bf1d848
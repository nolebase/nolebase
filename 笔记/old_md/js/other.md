# 其他

```js
Number(null);
```

上面的代码将返回：

::: details
undefined

Number() = 0
Number(null) = 0
Number(undefined) = NaN
:::

参考：
![W3CSchool js_ref_number](https://www.w3schools.com/jsref/jsref_number.asp)

执行以下程序，输出结果为（）

```js
let flag1 = null || undefined;
let flag2 = null && undefined;
if (flag1 === true) console.log('flag1');
if (flag2 === false) console.log('flag2');
```

::: details
什么都不会输出
:::

```js
var str = 'stiabsstringapbs';
var obj = {};
for (var i = 0; i < str.length; i++) {
  var key = str[i];
  if (!obj[key]) {
    obj[key] = 1;
  } else {
    obj[key]++;
  }
}
var max = -1;
var max_key = '';
var key;
for (key in obj) {
  if (max < obj[key]) {
    max = obj[key];
    max_key = key;
  }
}
alert('max:' + max + ' max_key:' + max_key);
```

关于上述代码说法错误的是（ ）。
A. obj 是用来统计字符数量的
B. 代码所实现的功能是：统计字符串中，所有字符的数量
C. max 表示最大字符，key 表示字符
D. 代码实现功能是：判断一个字符串中出现次数最多的字符，统计这个次数

::: details
BC
:::

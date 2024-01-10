---
title: 函数 Function
author: mophia
---

# 函数 Function

# 函数参数的使用

函数分为两大类，分别是内置函数和自定义函数。内置函数使用前无需定义，而自定义函数需要。

## 一、 形参与实参介绍

**形参：在定义函数阶段所定义的变量名是形式参数，简称形参.**

```py
def func(x, y): # 形参
    print(x, y)
```

**实参：在调用函数阶段传入的变量值称之为实际参数，简称实参.**

```py
# 形式一：
func(1, 2)

# 形式二：
a = 1
b = 2
func(a,b)

# 形式三：只要函数返回值是值就行
func(int(1), 2)
```

形参与实参的关系：

- 1、在调用阶段，实参（变量值的内存地址）会绑定给给形参（变量名）
- 2、这种绑定关系只能在函数体内使用，在函数外访问不到。
- 3、实参与形参的绑定关系在函数调用时生效，函数调用结束后解除绑定关系

## 二、 形参与实参的具体使用

### 2.1 位置参数 positional arguments

按照从左到右的顺序依次定义的参数是位置参数。

**位置形参**

特点：在函数定义阶段，必须被传值，多一个不行，少一个也不行

```py
def func(x, y):  # 调用函数时，必须被传值
    print(x, y)

# func(1)  # func() missing 1 required positional argument: 'y'
# func(1, 2, 3)  # TypeError: func() takes 2 positional arguments but 3 were given
```

**位置实参**

在函数调用阶段，按照顺序与形参一一对应

```py
def func(x, y):
    print(x, y)

# 位置实参
func(1, 2)  # 1 2
func(2, 1)  # 2 1
```

### 2.2 关键字参数

**特点：指名道姓地给形参传值，可以不按照顺序传值. 在函数调用阶段，按照 `key = value` 的形式传入的值.**

```py
func(x=1, y=2)
```

### 2.3 混合使用

**1. 位置实参必须放在关键字实参前**

```py
def func(x, y):
    print(x, y)

func(1, y=2)  # 1 2

# func(y=2, 1)  # SyntaxError: positional argument follows keyword argument
```

**2. 不能为同一个形参重复传值**

```py
def func(x, y):
    print(x, y)

# func(1, y=1, x=2)  # TypeError: func() got multiple values for argument 'x'
```

### 2.4 默认形参

在定义函数阶段，就已经为被赋值的形参是默认形参.

**特点：在定义阶段已经被赋值，意味着在调用阶段可以不用为其赋值.**

```py
def func(x, y=3):  # y不传值也行
    print(x, y)

func(1)
```

位置形参与默认形参混用，强调：
**1. 位置形参必须在默认形参左边**

```py
def func(y=2, x):  # SyntaxError: non-default argument follows default argument
    pass
```

**2. 默认参数的值是在函数定义阶段被赋值的，被赋予的是内存地址**

```py
def func(x, y=2):
    print(x, y)
```

- 示范一：
  
```py
m = 2
def func(x, y=m):  # y => 2的内存地址
    print(x, y)
m = 3
func(1)  # 1 2
```

- 示范二：
  
```py
m = [1]
def func(x, y=m): # y 指向列表 m 的内存地址
    print(x, y)
m.append(2)
func(1)  # 1 [1, 2]
```

**3. 虽然默认值可以被指定为任意数据类型，但是不推荐使用可变类型。会导致逻辑紊乱。（可以定义成 None， 在函数内部赋值）**

函数的调用只和函数本身有关系，不受外界代码的影响

推荐写法：

```py
def func(x, l=None):
    if l is None:
        l = []
    l.append(x)
    print(l)

func(1, [2, 3, 4])
```

### 2.4 可变长度的参数（ * 与 ** 的用法）

可变长度是在调用函数时，传入的值（实参）的个数不固定. 而实参是用来为形参赋值的，所以对于溢出的实参，必须有对应的形参来接收.

可变长度的位置参数

**I: `*args`：用来接收溢出的位置实参。约定俗成，args 和 * 搭配使用，**

```py
def func(x, *args):
    print(*args)

func(1, 2, 3, 4)  # 2 3 4
```

#### 例子：求和功能

```py
def my_sum(*args):
    re = 0
    for item in args:
        re += item
    return re

print(my_sum(1, 2, 3, 4))  # 10
```

**II: `*` 可以用在实参中，表示展开列表中的元素**

```py
def func(x, y, z):
    print(x, y, z)

func(*[1, 2, 3])  # 1 2 3
```

**III: 形参与实参中都带 `*`**

```py
def func(x, y, *args):
    print(args)

func(1, 2, *[3, 4])  # (3, 4)
```

#### 可变长度的关键字参数

**约定俗成，kwargs 和 ** 搭配使用**

**I: `**args`：用来接收溢出的关键字实参， `**` 会将溢出的关键字实参保存成字典格式.**

** 后可以跟任意名字，但是约定俗成是kwargs

```py
def func(x, **kwargs):
    print(kwargs)

func(x=1, y=2, z=3)  # {'y': 2, 'z': 3}
```

** II. `**`可以用在实参中（`**`后面只能是字典）。

实参中，变量带`**`，则`**`后的值展开成关键字实参

```py
def func(x, y, z):
    print(x, y, z)

func(*{'x': 1, 'y': 2, 'z': 3})  # x y z
func(**{'x': 1, 'y': 2, 'z': 3})  # 1 2 3
```

**III：形参和实参中都带 `**`**

```py
def func(x, y, **kwargs):
    print(x, y, kwargs)


func(**{'y': 2, 'x': 1, 'z': 3, 'a': 4})  # 1 2 {'z': 3, 'a': 4}
```

### 混用 `*` 与 `**`

-`*args` 必须在 `**args` 之前

```py
def func(a, *args, **kwargs):
    print("a", a)
    print("args", args)
    print("kwargs", kwargs)

func(1, 2, 3, 4, 5, x=1, y=2, z=3)

# a 1
# args (2, 3, 4, 5)
# kwargs {'x': 1, 'y': 2, 'z': 3}
```

```py
def index(x, y, z):
    print("index ==> ", x, y, z)

def wrapper(a, b, c):
    index(x, y, z)


```

例子：

```py
# 为 wrapper 参数是给 index 用的

def index(x, y, z):
    print("index ==> ", x, y, z)

def wrapper(a, b, c):
    index(a, b, c)

wrapper(1, 2, 3)  # index ==>  1 2 3  

```

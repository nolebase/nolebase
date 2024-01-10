---
title: 装饰器 Decorator
author: mophia
---

# 装饰器

## 1. 什么是装饰器？

    器指的是工具，可以定义成函数
    装饰指的是为其他食物添加额外的东西点缀

    合到一起的解释：
        装饰器指的是定义一个函数，该函数是用来为其他函数增加功能的。

## 2. 为何要用装饰器

    开放封闭原则
        开放：对拓展功能是开放的
        封闭：对修改源代码是封闭的

    装饰器就是在不修改被装饰器对象源代码，以及调用方式的前提下，为被装饰对象添加新功能

## 无参装饰器

```py
from functools import wraps

def outer(func):
    @wraps(func)  # 将原函数的属性赋值给 wrapper，可加可不加
    def wrapper(*args, **kwargs):
        # 添加新功能
        res = func(*args, **kwargs)  # 调用原函数
        # 添加新功能
        return res
    return wrapper
```

### 无参装饰器的案例

```py
# 需求：在不修改 index 函数的源代码以及调用方式的前提下，为其添加统计运行时间的功能

import time

def timmer(func):
    # func = index
    def wrapper(*args, **kwargs):
        start = time.time()
        func(*args, **kwargs)
        stop = time.time()
        print(stop - start)
    return wrapper

@timmer
def index(x, y):
    time.sleep(3)
    print('index %s %s' % (x, y))

# f = outter(index)  # f= wrapper 函数的内存地址， index 是index 函数的内存地址
# f(x=1, y=2)
# =>

# index = outter(index)
index(x=1, y=2)
```

## 有参装饰器

```py
def decorator(x, y, z):
  def outer(func):
      # @wraps(func)  # 将原函数的属性赋值给 wrapper，可加可不加
      def wrapper(*args, **kwargs):
          # 添加新功能
          res = func(*args, **kwargs)  # 调用原函数
          # 添加新功能
          return res
      return wrapper
  return outer

@decorator(1, y=2, z=3)
def index():
  pass
```

### 有参装饰器的案例

```py
def auth(db_type):
    def deco(func):
        def wrapper(*args, **kwargs):
            name = input('your name >>>:').strip()
            pwd = input('your password>>>:').strip()
            # 从文件中取账号和密码
            if db_type == "file":
                if name == "mophia" and pwd == '123':
                    print('login successful!')
                    res = func(*args, **kwargs)
                else:
                    print('user or password error')
                return res
            elif  db_type == "MySQL":
                print("MySQL")
            elif  db_type == "ldap":
                print("ldap")
            else:
                print("不支持该类型")

        return wrapper
    return deco

@auth(db_type="file")
def index(x, y):
    print('index->>%s:%s' % (x, y))
```

### 原理

```py
deco = auth(db_type="file")
@deco  # index = deco(index) = wrapper
def index(x, y):
    print('index->>%s:%s' % (x, y))
```

## 叠加多个装饰器

```py
def deco1(func1):  # func1 = 被装饰对象 wrapper2 的内存地址
    def wrapper1(*args, **kwargs):
        print('正在运行：deco1.wrapper1')
        res1 = func1(*args, **kwargs)
        return res1
    return wrapper1


def deco2(func2):  # func2 = 被装饰对象 wrapper3 的内存地址
    def wrapper2(*args, **kwargs):
        print('正在运行：deco2.wrapper2')
        res2 = func2(*args, **kwargs)
        return res2
    return wrapper2


def deco3(x):
    def outer(func3):  # func3 = 被装饰对象 index 函数的内存地址
        def wrapper3(*args, **kwargs):
            print('正在运行：deco3.outer.wrapper3')
            res3 = func3(*args, **kwargs)
            return res3
        return wrapper3
    return outer


@deco1       # (3) index = deco1(wrapper2 的内存地址) => index = wrapper1 的内存地址
@deco2       # (2) index = deco2(wrapper3 的内存地址) => index = wrapper2 的内存地址
@deco3('1')  # (1) @outer3 => index = outer3(index) => index = wrapper3 的内存地址
def index(x, y):
    print('from index %s:%s' % (x, y))
```

加载顺序：自下而上

```py
print(index)  # <function deco1.<locals>.wrapper1 at 0x102f39700>  （运行顺序：wrapper3 => wrapper2 => wrapper1）
```

执行顺序：自下而上

```py
index(1, 2)

'''
正在运行：deco1.wrapper1
正在运行：deco2.wrapper2
正在运行：deco3.outer.wrapper3
from index 1:2
'''
```

原理图：
![多层装饰器](/python/multi-decorator.png)
 
::: slot footer
版权所有，禁止转载 | Copyright © 2022-present [Eabc](https://github.com/mophia)
:::

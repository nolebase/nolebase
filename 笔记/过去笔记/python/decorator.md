# 装饰器

```py
def outter(func):
  def wrapper(*args, **kwargs):
    # 1、调用原函数
    res = func(*args, **kwargs)
    # 2、为其增加新功能
    return res

@outter
index()

```

## 事例

```py
import time

# time_calculator 是装饰器
def time_calculator(func):
    # func 是 index 方法 的内存地址
    def wrapper(*args, **kwargs):
        start = time.time()
        func(*args, **kwargs) # 写死了index
        stop = time.time()
        print(stop - start)
    return wrapper

@time_calculator # index = time_calculator(index)
def index(x, y):
    time.sleep(3)
    print("index %s %s" % (x, y))

if __name__ == '__main__':
    index(1, 2)

```

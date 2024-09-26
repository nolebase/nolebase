# JS Framework Benchmark 命令速查

[JS Framework Benchmark](https://github.com/krausest/js-framework-benchmark) 是一个 JavaScript 框架基准测试项目。基准测试创建一个包含随机条目的大表，并测量各种操作的时间，包括渲染持续时间。

它的的[文档](https://github.com/krausest/js-framework-benchmark)中提供了如何运行的详细说明，但是因为比较冗长，我长时间不用忘记的时候希望有一个简单的速查表，所以写了这个文档。


## 初始化服务器

这一步是必须的，因为我们需要一个服务器来运行测试

```bash
npm ci
nr start
```

## 构建单一框架

这里以 `vanillajs` 为例

```bash
cd framework/keyed/vanillajs
npm ci
nr build-prod
```

完成后记得回到根目录

```bash
cd ../../..
```

## 运行性能测试

```bash
cd webdriver-ts
npm ci

# 建基准驱动程序
npm run compile

# 运行测试
npm run bench keyed/vanillajs

# 可以填写多个框架名
npm run bench keyed/vue keyed/react
```

## 构建结果表格

```bash
cd webdriver-ts-results
npm ci
```

## 生成结果表格

```bash
cd webdriver-ts
npm run results
```

在 http://localhost:8080/webdriver-ts-results/dist/index.html 上查看结果表格。

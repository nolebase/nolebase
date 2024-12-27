---
tags:
  - 开发/语言/Golang
  - 开发/并发
  - 开发/并发/协程
  - 开发/语言/Golang/Goroutine
---

# 如何判断当前调用是否是 Goroutine

## TL;DR

关键在于使用 Golang 提供的 `runtime` 包的 `runtime.NumGoroutine()` 函数。

## 代码示例

创建一个工具包，该文件命名为 `util.go`

```go
package util

var disableGoroutine bool // 创建一个不导出的变量

// SetDisableGoroutine 设定为「不开启协程」，我们通过这个函数动态设定是否走协程
func SetDisableGoroutine(set bool) {
	disableGoroutine = set
}

// Go 我们创建一个嵌套的 Go 方法来控制 Goroutine 的开关与否
func Go(f func()) {
  // 嵌套一个内层函数
	internal := func() {
		defer func() {
		  // 从 panic（恐慌）中还原
			if p := recover(); p != nil {
				// From net/http/server.go
				// https://github.com/golang/go/blob/release-branch.go1.13/src/net/http/server.go#L1765
				const size = 64 << 10
				buf := make([]byte, size)
				// if the size of stack tracing message is larger than 64k, the message will be truncated.
				buf = buf[:runtime.Stack(buf, false)] // 获取调用栈
				log.Errorf("Panic recovered, %v\n%s", p, buf) // 输出日志
			}
		}()
		f() // 传入的需要进行协程的函数 f
	}

	// 实际控制开关与否的逻辑
	if disableGoroutine {
		internal()
	} else {
		go internal()
	}
}
```

创建工具包对应的测试文件 `util_test.go`

```go
package util

// 测试函数
func TestSetDisableGoroutine(t *testing.T) {
	assert := assert.New(t)
	require := require.New(t)

	SetDisableGoroutine(true) // 设定为 true
	assert.True(disableGoroutine) // 断言

	SetDisableGoroutine(false) // 设定为 false
	assert.False(disableGoroutine) // 断言

	var wg sync.WaitGroup // 创建 waitgroup 来等待协程结束
	var afterGoroutineCount int // 协程 go 出去之后的 Goroutine 计数
	aquireCurrentGoroutineID := func() {
	    afterGoroutineCount = runtime.NumGoroutine() // 使用 runtime.NumGoroutine() 获取 Go 协程总数
		wg.Done() // 标记 waitgroup 为完成
	}

	// 打开 goroutine 的情况
	SetDisableGoroutine(false)
	require.False(disableGoroutine) // 断言
	beforeGoroutineCount := runtime.NumGoroutine() // 协程 go 出去之前的 Goroutine 计数
	wg.Add(1) // Go 出去之前给 waitgroup 加一
	Go(aquireCurrentGoroutineID) // 执行重新封装的 Go 协程函数
	wg.Wait() // 等待协程结束，确保我们的 afterGoroutineCount 变量被更新
	assert.Equal(beforeGoroutineCount+1, afterGoroutineCount) // 可以断言 afterGoroutineCount 的值比 beforeGoroutineCount 大，相差 1

	// 关闭 goroutine 的情况
	SetDisableGoroutine(true)
	require.True(disableGoroutine) // 断言
	beforeGoroutineCount = runtime.NumGoroutine() // 协程 go 出去之前的 Goroutine 计数
	wg.Add(1) // Go 出去之前给 waitgroup 加一
	Go(aquireCurrentGoroutineID) // 执行重新封装的 Go 协程函数
	wg.Wait() // 等待协程结束，确保我们的 afterGoroutineCount 变量被更新
	assert.Equal(beforeGoroutineCount, afterGoroutineCount) // 可以断言此时没有变化，Go 函数的调用并没有产生新的协程
}
```

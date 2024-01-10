---
title: 格式转换
author: mophia
---
# Go 格式转换

### 字符串转 int

```go
re2, _ := strconv.Atoi("1000")
fmt.Printf("%#v %T\n", re2, re2)
```

### int 转字符串

```go
re3 := strconv.Itoa(1000)
fmt.Printf("%#v %T\n", re3, re3)
```

### 字符串转 intX

```go
re1, err := strconv.ParseInt("1000", 10, 64)
if err != nil {
  fmt.Println("Parse Int Failed.")
  return
}
fmt.Printf("%#v %T\n", re1, re1)
```

### 数字转字符串

```go
re4 := fmt.Sprintf("%d", int32(97))
fmt.Printf("%#v %T\n", re4, re4)
```

### 把字符串转换成布尔值

```go
re5, _ := strconv.ParseBool("true")
fmt.Printf("%#v %T\n", re5, re5)
```

### 字符串转换成浮点数

```go
re6, _ := strconv.ParseFloat("1.23", 64)
fmt.Printf("%#v %T\n", re6, re6)
```

### 完整代码：

```go
package main

import (
	"fmt"
	"strconv"
)

// https://www.liwenzhou.com/posts/Go/go_strconv/

func main() {
	// 从字符串中解析出对应的int类型
	re1, err := strconv.ParseInt("1000", 10, 64)
	if err != nil {
		fmt.Println("Parse Int Failed.")
		return
	}
	fmt.Printf("%#v %T\n", re1, re1)

	// 字符串转int
	re2, _ := strconv.Atoi("1000")
	fmt.Printf("%#v %T\n", re2, re2)

	// int 转字符串
	re3 := strconv.Itoa(1000)
	fmt.Printf("%#v %T\n", re3, re3)

	// 把数字转换成字符串
	re4 := fmt.Sprintf("%d", int32(97))
	fmt.Printf("%#v %T\n", re4, re4)

	// 把字符串转换成布尔值
	re5, _ := strconv.ParseBool("true")
	fmt.Printf("%#v %T\n", re5, re5)

	// 字符串转换成浮点数
	re6, _ := strconv.ParseFloat("1.23", 64)
	fmt.Printf("%#v %T\n", re6, re6)

	return
}


```



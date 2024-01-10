---
title: 时间 time
author: mophia
---
# Go time 包

### 当前时间 time.Now()

```go
now := time.Now()
fmt.Println("now", now)
// now 2022-05-18 11:44:59.567151 +0800 CST m=+0.000156876
```

### 年份 now.Year()

```go
now.Year()
//  2022
```

### 当年的第几天 now.YearDay()

```go
now.YearDay()
// 138
```

### 日期 now.Date()

```go
now.Date()
// 2022 May 18
```

### 小时 分钟 秒

```go
now.Hour() now.Minute() now.Second()
// 11 44 59
```

### 时间戳

```go
timestamp := now.Unix()
fmt.Println(timestamp)
// 1652845499
```

### 时间戳 转 时间格式的对象

```go
	t1 := time.Unix(timestamp, 0)
	// 2022-05-18 11:44:59 +0800 CST
	fmt.Println(t1)
```

#### 纳秒时间戳

``` go
fmt.Println(now.UnixNano())
// 1652845499567151000
```

### 时间常量

源码：
```go
// time.go
package time

const (
  Nanosecond  Duration = 1
  Microsecond          = 1000 * Nanosecond
  Millisecond          = 1000 * Microsecond
  Second               = 1000 * Millisecond
  Minute               = 60 * Second
  Hour                 = 60 * Minute
)
```

```go
t2 := time.Nanosecond
fmt.Println(t2)
// 1ns
```

### 时间操作 Add, Sub, Equal, Before, After

```go
nowAdd := now.Add(time.Hour)
nowSub := now.Sub(time.Date(2022, 5, 20, 0, 0, 0, 0, time.UTC))
fmt.Println("现在加上一小时", "时间差")
fmt.Println(nowAdd, nowSub)

// 现在加上一小时: 2022-05-18 12:44:59.567151 +0800 CST m=+3600.000156876 
// 时间差 : -44h15m0.432849s
```

### 日期 📅 格式化 把时间对象转换成字符串时间

#### 当前日 2022-05-18

```go
now.Format("2006-01-02")
```

### 当前秒 12小时制 2022-05-18 11:44:59 AM

```go
now.Format("2006-01-02 03:04:05 PM")
```

### 当前秒 24小时制 2022-05-18 11:44:59 AM

```go
now.Format("2006-01-02 15:04:05")
```

### 当前微秒

```go
now.Format("2006-01-02 15:04:05.000000")
```

### 解析字符串类型的时间

```go
timeObj, err := time.Parse("2006-01-02", "2021-05-18")
if err != nil {
  fmt.Println("parse time err", err)
  return
}

fmt.Println(timeObj)
// 2021-05-18 00:00:00 +0000 UTC

fmt.Println(timeObj.Unix())
// 1621296000
```

### 时区

```go
loc, err := time.LoadLocation("Asia/Shanghai")
if err != nil {
  fmt.Println("load location failed", err)
  return
}

shTime, err := time.ParseInLocation("2006-01-02 15:04:05", now.Format("2006-01-02 03:04:05"), loc)
if err != nil {
  fmt.Println("parse time failed", err)
  return
}
fmt.Println("shanghai time", shTime)
// shanghai time 2022-05-18 11:44:59 +0800 CST
```

### time.Sleep

```go
fmt.Println("ready, Sleep!")
time.Sleep(time.Duration(3) * time.Second)
fmt.Println("After sleeping 3 secs, Get up!")
```

### 定时器

```go
timer := time.Tick(time.Second)
for t := range timer {
  fmt.Print(t.Date())
  fmt.Print("   ")
  fmt.Println(t.Clock())
}
```

### 源码

```go
package main

import (
	"fmt"
	"time"
)

// 时间 time

func main() {
	now := time.Now()

	// now 2022-05-18 11:44:59.567151 +0800 CST m=+0.000156876
	fmt.Println("now", now)
	// now.Year() 2022
	fmt.Println("now.Year()", now.Year())
	// now.YearDay() 138
	fmt.Println("now.YearDay()", now.YearDay())
	// 2022 May 18
	fmt.Println(now.Date())
	// 11 44 59
	fmt.Println(now.Hour(), now.Minute(), now.Second())

	// 时间戳
	timestamp := now.Unix()
	// 1652845499
	fmt.Println(timestamp)

	// 时间戳 转 时间格式的对象
	t1 := time.Unix(timestamp, 0)
	// 2022-05-18 11:44:59 +0800 CST
	fmt.Println(t1)

	// 纳秒时间戳
	// 1652845499567151000
	fmt.Println(now.UnixNano())

	// 时间常量

	// 源码：
	//const (
	//	Nanosecond  Duration = 1
	//	Microsecond          = 1000 * Nanosecond
	//	Millisecond          = 1000 * Microsecond
	//	Second               = 1000 * Millisecond
	//	Minute               = 60 * Second
	//	Hour                 = 60 * Minute
	//)

	t2 := time.Nanosecond
	// 1ns
	fmt.Println(t2)

	// 时间操作 Add Sub Equal Before After
	nowAdd := now.Add(time.Hour)
	nowSub := now.Sub(time.Date(2022, 5, 20, 0, 0, 0, 0, time.UTC))
	fmt.Println("现在加上一小时", "时间差")
	// 2022-05-18 12:44:59.567151 +0800 CST m=+3600.000156876 -44h15m0.432849s
	fmt.Println(nowAdd, nowSub)

	// 日期 📅 格式化 把时间对象转换成字符串时间
	// 字符串 - 日 2022-05-18
	fmt.Println("字符串 - 日", now.Format("2006-01-02"))
	// 字符串 - 十二小时秒 2022-05-18 11:44:59 AM
	fmt.Println("字符串 - 十二小时秒", now.Format("2006-01-02 03:04:05 PM"))
	// 字符串 - 二十四小时秒 2022-05-18 11:44:59
	fmt.Println("字符串 - 二十四小时秒", now.Format("2006-01-02 15:04:05"))
	// 字符串 - 微秒 2022-05-18 11:44:59.567151
	fmt.Println("字符串 - 微秒", now.Format("2006-01-02 15:04:05.000000"))

	// 解析字符串类型的时间
	timeObj, err := time.Parse("2006-01-02", "2021-05-18")
	if err != nil {
		fmt.Println("parse time err", err)
		return
	}
	// 2021-05-18 00:00:00 +0000 UTC
	fmt.Println(timeObj)
	// 1621296000
	fmt.Println(timeObj.Unix())

	// 时区
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		fmt.Println("load location failed", err)
		return
	}

	shTime, err := time.ParseInLocation("2006-01-02 15:04:05", now.Format("2006-01-02 03:04:05"), loc)
	if err != nil {
		fmt.Println("parse time failed", err)
		return
	}
	// shanghai time 2022-05-18 11:44:59 +0800 CST
	fmt.Println("shanghai time", shTime)

	// time.Sleep
	fmt.Println("ready, Sleep!")
	time.Sleep(time.Duration(3) * time.Second)
	fmt.Println("After sleeping 3 secs, Get up!")

	// 定时器
	timer := time.Tick(time.Second)
	for t := range timer {
		fmt.Print(t.Date())
		fmt.Print("   ")
		fmt.Println(t.Clock())
	}
}


```
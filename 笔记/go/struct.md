---
title: 结构体
author: mophia
---

## 结构体

```go
package main

import "fmt"

// 结构体 P51

type person struct {
	name, cnName string
	age          int
	hobby        []string
}

type x struct {
	a int8
	b int8
	c int8
}

func main() {
	// 声明 结构体
	// 实例化 person 类型 p
	var p person

	// 用 new 关键字对结构体进行实例化，得到结构体的指针
	var p2 = new(person)
	p2.cnName = "六"
	// 分别获取类型 值 和 内存地址（指针）
	fmt.Printf("type: %T value: %v pointer: %v \n", p2, p2, &p2)

	// 声明并初始化结构体
	var p3 = person{
		name:   "floy",
		cnName: "bu",
		age:    20,
		hobby:  []string{"🍰", "🍪"},
	}
	fmt.Println(p3)

	// 使用列表的方式初始化，要求排列的顺序和结构体声明时的顺序一致
	var p4 = person{"mophia", "jun", 22, []string{"🎱", "⚽️", "🏎️"}}
	fmt.Println(p4)

	// 通过字段赋值
	p.name = "mophia"
	p.age = 22
	p.cnName = "jun"
	p.hobby = []string{"🎱", "⚽️", "🏎️"}

	// 结构体的类型和值
	fmt.Printf("type:%T value:%v \n", p, p)
	// main.person {mophia jun 22 [🎱 ⚽️ 🏎️]}

	// 访问变量p的字段
	fmt.Printf(p.name)
	// mophia

	// 匿名结构体 anonymous struct ：多用于一些临时场景
	var aStruct struct {
		name string
		age  int
	}

	aStruct.name = "mophia"
	aStruct.age = 22
	fmt.Printf("type:%T value:%v \n", aStruct, aStruct)
	// type:struct { name string; age int } value:{Meggy 23}

	// 结构体的修改方法：指针传递. 推荐使用结构体指针
	changeAge(&p)
	fmt.Println(p.age)

	// 结构体占用一块连续的内存空间
	m := x{int8(10), int8(10), int8(10)}
	fmt.Printf("%p %p %p", &(m.a), &(m.b), &(m.c))
	// 0x1400012c010 0x1400012c011 0x1400012c012

	// 补充材料：内存对齐 https://segmentfault.com/a/1190000017527311

}

func changeAge(p *person) {
	// 可通过结构体指针访问结构体中的成员
	p.age += 1
}
```

## 结构体方法 method 和接收者 receiver

```go
package main

import "fmt"

// P10

// 方法是作用于特定类型的函数

type friend struct {
	name string
	age  int64
}

// 值接收者：拷贝
func (f friend) greet() {
	fmt.Printf("%s: nice to meet you~", f.name)
}

// 指针接收者：传内存地址进去
// 使用场景：需要修改接受者中的值
// 接受者是拷贝代价比较大的大对象
// 保证一致性，如果有某个方法使用了指针接收，那么其他方法也应该使用指针接收
func (f *friend) newYear() {
	f.age += 1
}

func main() {
	tom := friend{name: "Tom", age: 3}
	tom.greet()
	tom.newYear()
	fmt.Println("tom's age is", tom.age)
}
```

## 结构体与json

```go
package main

import (
	"encoding/json"
	"fmt"
)

// 结构体与 JSON

// 1. 把Go中的结构体变量 --> json 格式的字符串
// 2. json 格式的字符串 --> Go 中的能识别的结构体题量

type person struct {
	Name string `json:"name" db:"name"`
	Age  int    `json:"age" db:"name"`
}

func main() {
	p1 := person{
		Name: "tom",
		Age:  2,
	}

	// 序列化
	b, err := json.Marshal(p1)
	if err != nil {
		fmt.Printf("marshel failed, err:%v", err)
		return
	}
	fmt.Println(string(b))

	// 反序列化
	str := `{"name": "Jerry", "age": 3}`
	var p2 person
	json.Unmarshal([]byte(str), &p2) // 传指针是为了能在 json.Unmarshal 内部修改 p2 的值
	fmt.Printf("%#v\n", p2)
}
```

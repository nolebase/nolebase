---
tags:
  - node
  - cli
---
いままでは[[asdf]]を利用していたが、
- goで利用しにくい
	- asdfのpluginがメンテされてなかったような記憶がある。
	  https://zenn.dev/link/comments/5cf8013160b4bc
		  [asdf-golang](https://github.com/kennyp/asdf-golang)も[asdf-go-sdk](https://github.com/yacchi/asdf-go-sdk)もエラーになったりした記憶をメモしてる。
	  結局gvmを使っていたと。
- シンタックスがわかりにくい
	- `nodejs`とか微妙にわからないとか、flagなのかどうなのかいつも思い出せない

ということで、[[mise]]を使い始めた。
- Rust製
- asdfから移行可能

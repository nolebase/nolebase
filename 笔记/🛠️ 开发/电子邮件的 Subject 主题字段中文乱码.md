---
tags:
  - 开发/后端/SMTP
  - 开发/语言/Golang
  - 开发/后端/邮件
  - 开发/后端/Email
  - 编码/UTF-8
  - 规范/RFC
  - 计算机/网络/协议/邮件/Email
---

# 电子邮件的 Subject 主题字段中文乱码

##### 文档版本

| 编辑者 | 版本 | 变更日期 | 变更说明 |
| ----- | --- | ------- | ------- |
| Neko | v1.0.0 | 2022-04-02 | 创建 |

在 Golang 中我们可以使用下面的代码直接修复该问题：

```go
// 组合拼接邮件内容
header := make(map[string]string)
header["Subject"] = "=?UTF-8?B?" + base64.StdEncoding.EncodeToString([]byte(subject)) + "?=" + "\n"
```

如果你更喜欢 `fmt.Sprint` 的使用方法，也可以用下面的这个：

```go
// 组合拼接邮件内容
header := make(map[string]string)
header["Subject"] = fmt.Sprintf("=?UTF-8?B?%s?=\n", base64.StdEncoding.EncodeToString([]byte(subject)))
```

## 延伸阅读

[encoding - Converting "=?UTF 8?.." (RFC 2047) to a regular string in golang - Stack Overflow](https://stackoverflow.com/questions/28932140/converting-utf-8-rfc-2047-to-a-regular-string-in-golang)

[Non-ascii SUBJECT and FROM turns into " =?utf-8?b?" even when charset is set to iso-8859-2 · Issue #126 · mattupstate/flask-mail](https://github.com/mattupstate/flask-mail/issues/126)

[encoding - MIME email Subject etc. headers vs. utf8: first split, then encode? - Stack Overflow](https://stackoverflow.com/questions/65500376/mime-email-subject-etc-headers-vs-utf8-first-split-then-encode)

[What the =?UTF-8?B?ZnVjayDwn5CO?=! – dmorgan.info](https://dmorgan.info/posts/encoded-word-syntax/)

[golang--解决邮件发送标题乱码问题 - 黑曼巴后仰 - 博客园](https://www.cnblogs.com/s42-/p/13053885.html)

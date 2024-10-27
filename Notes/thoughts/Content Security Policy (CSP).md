---
tags:
  - security
---
## 概要
> **コンテンツ セキュリティ ポリシー**( [CSP ) は、クロスサイト スクリプティング (](https://developer.mozilla.org/en-US/docs/Glossary/CSP) [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) ) やデータ インジェクション攻撃などの特定の種類の攻撃を検出して軽減するのに役立つ追加のセキュリティ レイヤーです。
>
> [Content Security Policy (CSP) - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

HTTPの`Content-Security-Policy`レスポンスヘッダーに設定することで、信頼できるコンテンツやスクリプトのみを実行します。違反しているリソースの読み込みや実行は拒否されます。
[[XSS]]対策がメインになります。

## 設定概要
### Fetch directives
特定のリソース種別を読み込む事ができる場所を制御する。
### Document directives
ポリシーが適用sareru文書とworkerのプロパティを管理
### Navigation directives
`form-action`など、ユーザーが移動・送信できる場所を制御。
### Reporting directives
CSP違反のReportの制御。

## 対応基準
[[XSS]]対策が主になるため、ユーザー入力内容が表示・実行されるようなサービスでは特に対応を検討するべきです。

## 参考
- [ゼロから学ぶCSP（Content Security Policy）入門](https://liginc.co.jp/blog/tech/639126)

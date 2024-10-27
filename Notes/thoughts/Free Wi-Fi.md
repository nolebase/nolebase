---
tags:
  - security
---
想定されるリスク
1. DNSスプーフィング
	- 暗号化される前のDNSクエリの改ざん
	- 偽サイトへの誘導リスク
2. [SSLストリッピング](https://bluegoat.jp/blog/hsts-ssl-stripping/)
	- HTTPS接続を強制的にHTTPへダウングレードする
	- 見かけ上は通信しているため、前段で攻撃者が介在していると検知できない
	- HSTS[^HSTS]によって対策
1. [Man-in-the-middle (MITM) 攻撃](https://www.f5.com/ja_jp/glossary/man-in-the-middle-attack-mitm)
	- 偽のアクセスポイントを設置し、通信の傍受
	- 証明書の警告無視が危険
2. パケットスッフィング
	> [スニッフィングとは](https://wa3.i-3-i.info/word12624.html)

[^HSTS]: HTTP Strict Transport Security: 一度通信したブラウザとサーバー間でサーバーがブラウザに対してセキュリティヘッダーを付与。有効期間内でhttpsで接続する旨があり、次回以降は自動的にhttps接続をする。<br> https://securityheaders.com/ にてヘッダーの確認ができる。もしくはNetwork Tab

関連: [[Content Security Policy (CSP)]]
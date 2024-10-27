---
tags:
  - seed
  - paas
---

[Supabase vs Firebase](https://supabase.com/alternatives/supabase-vs-firebase)
- SupabaseはFirebaseの代替品
- ドキュメントベースではなくPostgreSQLベース
	- Pros
		- オープンソースなのでロックインされない
		- SQLでクエリ実行
		- 大規模活用できる実績
		- 一般的なシステムであるトランザクションんワークロードに最適なDB
		- エコシステム：Postgres拡張とプラグイン
- SupabaseはFirebaseのファンであるからこそ同等のものを用意している
	- 自動生成API
	- リアルタイム: Streaming可能
	- Auth
	- Functions: JavaScript/TypeScript Function
	- Storage: Image, Video, PDF
- その他の違い
	- Pricing
		- FirebaseはRead/Write/Deleteに料金発生
			- 初期では予測できないことがある
		- Supabaseは保存データ量に依存
			- **APIリクエストと認証ユーザーの数は無制限を確保**
	- Performance
		- FirebaseよりReadで最大4倍、Writeは3.1倍
	- 移行ツールもある

---
tags:
  - analytics
---
EU県内の個人データ保護を目的とした法律。2018年5月に施行。EU内で収集した個人データのEU外への転送と処理を原則禁止としている。

**Web Analyticsツールへの影響**

[[Google Analytics]]はGDPRの観点から懸念がある。
1. データ転送: Google サーバーに送信し分析するため、GDPR規制対象となる可能性あり。
2. Cookie利用: GA4はCookieを使用しており、Googleサーバーに送信する点で、`改正電気通信事業法`の外部送信規律の対象となり得る。
3. GDPR違反リスク

**対応策**
1. 同意取得
2. オプトアウト機能
3. プライバシーポリシーの更新
4. データ匿名化
5. 代替ツール

**代替ツール**

- [[Tinybird]]
  [Build a GDPR-compliant alternative to Google Analytics · Tinybird](https://www.tinybird.co/docs/live/google-analytics-free)
- [[Tinylytics]]
  > _GDPR_-compliant with no cookies or user-identifiable data storage. Securely hosted in Europe for your peace of mind. Learn more here on how we handle unique ...
  > [tinylytics Privacy & Data Protection](https://eu-software.com/alternatives/tinylytics/)
  > 
  

## Reference
- [GDPRとは？　個人情報保護法との違いや日本企業が注意すべき点 | ELEMINIST（エレミニスト）](https://eleminist.com/article/3127)
- https://www.perplexity.ai/search/gdprnifu-itenojie-shuo-to-guan-oTzwxlTnQEunOLzrZjw.1g
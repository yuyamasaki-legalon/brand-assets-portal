# Security Rules

## Never Commit
- `.env` files
- API keys
- Access tokens
- Passwords
- Private keys
- Credentials of any kind

## Never Expose
- User data in logs
- Internal configurations
- Authentication tokens in client code
- Sensitive error details to users

## Never Bypass
- Authentication checks on protected routes
- Authorization validation on API endpoints
- Input validation

## Mock Data / Dummy Data
- メールアドレスには `@example.com` または `@example.co.jp` を使用する（RFC 2606 準拠の安全なドメイン）
- 実在する企業ドメイン（`@legalontech.jp`, `@legalforce.co.jp` 等）や紛らわしいドメイン（`@sample.co.jp`, `@test.co.jp`）は使用しない
- 電話番号は `090-1234-5678`、住所は `東京都千代田区1-1-1` のような明らかなダミーパターンを使用する
- リポジトリが公開されても問題ないよう、顧客・社員の実在する個人情報は一切使用しない

## Prevent Vulnerabilities
- Sanitize user input (XSS prevention)
- Use parameterized queries (SQL injection prevention)
- Validate and sanitize file uploads
- Follow OWASP Top 10 guidelines

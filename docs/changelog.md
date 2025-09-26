# Changelog

## 1.2.0

## 1.1.0

- Added change log
- Added clear button to unset data
- New checks:
  - **Security/FrameEmbeddingCheck** - Checks if a website allows embedding in an iframe
  - **Security/CookieSecurityCheck** - Checks if cookies have secure, httponly, and samesite flags
  - **HTML/StopWordCheck** - Checks for stop words like "sex" or "porn" in HTML content

## 1.0.0

- Initial features:
  - Filtering by URL, method, severity, and third-party requests
  - Preserving logs across navigations
- Initial checks:
  - **General/StatusCodeCheck** - Checks for HTTP status codes >= 400
  - **General/SlowRequestCheck** - Checks for requests taking longer than 800 ms
  - **General/LargeResponseCheck** - Checks for responses larger than 1 MB
  - **HTTP/InsecureRequestCheck** - Checks for requests over HTTP
  - **HTTP/MissingCacheHeaderCheck** - Checks for static resources without cache headers
  - **HTTP/Http11Check** - Checks for HTTP/1.1 connections
  - **HTTP/header/ApacheVersionCheck** - Checks for Apache version in server header
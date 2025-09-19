# Inspect - Chrome Extension

![Dev Tools Panel](docs/dev-tools.png)


## Rules

### General

- Large Response (Content-Length > 1 MB)
- Slow Request (Duration > 800 ms)
- Status Code (>= 400)

### HTTP

- Insecure Request (HTTP)
- Missing Cache Header (static resources)
- HTTP/1.1 (instead of HTTP/2)
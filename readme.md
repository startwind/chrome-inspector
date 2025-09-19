# Inspect - Chrome Extension

Development Audit is a Chrome DevTools extension that monitors network traffic during development and highlights
potential issues such as insecure HTTP requests, large responses, missing cache headers, or slow requests. It focuses
only on relevant findings, provides filtering by URL, method, and severity, and offers the option to preserve logs
across navigations.

With its clear, responsive interface and modular, easily extensible checks, it helps developers
quickly identify and address performance or security problems without having to dig through the standard network tab.

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

## Installation (development version)

Download and unpack the latest version from GitHub
https://github.com/startwind/chrome-inspector/archive/refs/heads/main.zip

Switch on developer mode in Chrome ([chrome://extensions](chrome://extensions)) and load the extension from the unpacked directory.

## Usage

Open Chrome DevTools, switch to the **Inspection** panel, and browse your application. Findings for requests from
the active tab will appear automatically. Use the filter controls at the top to narrow results by URL, HTTP method,
severity, or third-party requests. Enable *Preserve log* to keep findings when navigating between pages.

## Contributing

Contributions are welcome. New checks can be added by creating a class that implements the `check(req)` method and
returning either `false` or a finding object. Please open issues or pull requests on GitHub.
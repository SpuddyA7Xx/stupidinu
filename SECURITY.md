# Security Policy

## Supported Versions

This project is experimental and currently supports the local simulation harness and its core TypeScript libraries.

## Reporting a Security Issue

Please report suspected vulnerabilities privately via the repository maintainer or via the project issue tracker with a clear description of the exploit path and impact.

## Security expectations

- Never expose keys, tokens, or secret material in configuration files or logs.
- Keep financial execution behind the deterministic policy engine.
- Force simulation mode by default.
- Treat all external integrations as untrusted input and validate payloads strictly.
- Do not authorize privileged wallet actions unless the operation is manually configured and reviewed.

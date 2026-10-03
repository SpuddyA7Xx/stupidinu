# Contributing to Stupidinu

This repository is intentionally conservative: simulation mode is the default, external credentials are required for live integrations, and all financial actions must pass policy checks before execution.

## Local development

1. Install dependencies:
   npm install
2. Run checks:
   npm run check
3. Start the simulation runtime:
   npm --workspace apps/agent-runtime run start

## Guardrails

- Never commit secrets or private keys.
- Do not enable live Solana execution without explicit credentials and a verified deployment plan.
- Add tests for new behavior before claiming it is supported.
- Document every trust assumption and unimplemented integration.

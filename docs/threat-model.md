# Threat Model

The project explicitly treats the AI layer as non-privileged. The financial authority is separated from the model output and sits behind deterministic policy validation.

## Risks considered

- Malformed or stale market data.
- Duplicate reward claims.
- Overflow or rounding manipulation.
- Unauthorized program invocation.
- Emergency pause bypass.
- Resource exhaustion and prompt injection.

## Mitigations

- Schema validation with Zod.
- Integer arithmetic.
- Program allowlisting and rate limiting.
- Simulation-first execution.
- Explicit emergency pause handling.

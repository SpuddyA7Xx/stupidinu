# Architecture

The Stupidinu runtime is intentionally built as a read-only and simulation-first system. The architecture separates perception, reasoning, validation, and execution so the AI layer can propose missions without direct access to funds or privileged actions.

## Layers

- Perception: market adapters and normalized observations.
- Reasoning: model abstraction returning structured proposals.
- Mission engine: persistent mission lifecycle state for the workflow.
- Policy engine: static validation of action safety and budget constraints.
- Reward accounting: integer-based payout planner and duplicate protection.
- Execution: simulation-only runtime with explicit authorization boundaries.

## File organization

Source code is distributed across typed packages to keep concerns small and auditable.

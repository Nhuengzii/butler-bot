# Butler Bot Agent Guide

This file guides agentic coding tools working in this repo.
Keep changes minimal, aligned with existing patterns, and avoid unrelated refactors.

## Repository Overview
- TypeScript Node.js Discord bot.
- Source code lives under `src/`.
- Tests use Bun's built-in test runner (`bun test`).
- Builds emit to `dist/` via `tsc`.

## Build, Test, and Dev Commands
- Install dependencies: `bun install`.
- Build: `bun run build` (runs `tsc`).
- Run built app: `bun run start` (runs `bun run dist/index.js`).
- Run in dev with hot reload: `bun run dev` (runs `bun --hot src/index.ts`).
- Run all tests: `bun test`.
- Run a single test file: `bun test ./path/to/file.spec.ts`.
- Run tests matching a name: `bun test --test-name-pattern "<test name or regex>"`.

## Bun Defaults
- Use `bun <file>` instead of `node <file>` or `ts-node <file>` when possible.
- Use `bun test` instead of Jest/Vitest for new tests.
- Use `bun build <file>` instead of webpack/esbuild for bundling tasks.
- Use `bun install` instead of npm/yarn/pnpm.
- Use `bun run <script>` for package scripts.
- Use `bunx <package> <command>` instead of `npx`.
- Bun automatically loads `.env`; avoid adding new `dotenv` usage.

## Bun APIs
- Prefer `Bun.serve()` over `express` for new servers.
- Use `bun:sqlite` for SQLite (avoid `better-sqlite3`).
- Use `Bun.redis` for Redis (avoid `ioredis`).
- Use `Bun.sql` for Postgres (avoid `pg`/`postgres.js`).
- Use built-in `WebSocket` instead of `ws`.
- Prefer `Bun.file` over `node:fs` read/write helpers when practical.
- Use `Bun.$` for shelling out instead of `execa`.

## Bun SQLite
- Local command storage uses `bun:sqlite` with `data/butler.sqlite` by default.
- Override the DB path with `BUTLER_DB_PATH` if needed.
- API is synchronous and uses `Database.query()` with cached statements.
- Prefer named params with `$`/`:`/`@` prefixes unless `strict: true` is set.
- Enable WAL via `PRAGMA journal_mode = WAL;` for write-heavy usage.
- Use `db.transaction()` for atomic multi-step writes.
- Instruction-based command generation is disabled (no backend service).
- Keep migrations minimal: adjust table schema via `CREATE TABLE IF NOT EXISTS` in code.

## Bun YAML
- Parse YAML strings with `Bun.YAML.parse` (returns an object or array for multi-doc YAML).
- Invalid YAML throws a `SyntaxError`; handle with `try/catch` for user input.
- Prefer built-in YAML support over `yaml`/`js-yaml` dependencies.
- Bun can `import`/`require` YAML files as modules when needed.

## Bun Install Config
- `bunfig.toml` sets `install.peer = false` to avoid installing peer deps like `@discordjs/opus`.

## Linting and Formatting
- No lint or formatter configuration found.
- Do not introduce new lint/format tools without explicit request.
- Preserve existing formatting and style in the files you touch.

## Cursor/Copilot Rules
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.
- If these appear later, incorporate them and update this file.

## Project Layout
- `src/index.ts`: Discord client setup and entrypoint.
- `src/butler/`: main bot domain (commands, actions, events, payloads, templates).
- `src/butler/**/__test__`: Bun test files.

## TypeScript Configuration
- `tsconfig.json` uses `module`/`moduleResolution`: `NodeNext`.
- `strict` mode is enabled.
- Output directory is `dist/`.
- `esModuleInterop` is enabled.

## Code Style and Conventions
### General
- Indentation is 2 spaces.
- Line endings are standard LF.
- Some files use semicolons, some omit them.
- Some files use single quotes, others use double quotes.
- Match the existing file’s quote/semicolon style.
- For new files, prefer double quotes and semicolons to match `src/butler/**`.
- Avoid unnecessary reformatting or style-only changes.

### Imports
- Place external imports first, then internal relative imports.
- Use named imports where possible.
- Keep import paths relative; no path aliases are configured.
- Keep imports sorted logically by dependency type, not alphabetically mandated.

### Exports
- Prefer named exports; most modules end with `export { Name }`.
- Keep public API surfaces explicit (avoid default exports).

### Naming
- Classes and types: `PascalCase`.
- Functions and variables: `camelCase`.
- Constants: `camelCase` unless truly constant-like, then `SCREAMING_SNAKE_CASE`.
- Private fields: prefix with `_` (e.g., `_parser`).
- Files and folders: `camelCase` or `kebab-case` as already used.

### Types and Interfaces
- Keep types close to usage when small (inline type literals are common).
- Use `type` aliases for object shapes as seen in `butler.ts`.
- Avoid `any`; `strict` mode should guide safer types.

### Functions and Classes
- Prefer explicit `public`/`private` on class members where used.
- Keep constructors concise; initialization and wiring are common patterns.
- Use early returns for guard conditions.
- Preserve existing method order when editing a class.

### Error Handling
- Use `try/catch` around network or parsing operations.
- Existing code logs errors with `console.log` and returns `false`/`undefined`.
- Maintain the existing behavior unless explicitly requested.
- Avoid throwing new errors in hot paths unless required for correctness.

### Async Patterns
- Use `async/await` consistently (already standard in the codebase).
- Return `Promise<boolean>` or `Promise<void>` per existing contracts.
- Avoid mixing `then()` chains with `async/await`.

## Testing Conventions
- Tests live in `__test__` folders and use `*.spec.ts` naming.
- Import `describe`, `test`, `it`, `expect`, and `jest` from `bun:test`.
- Test descriptions are short, lowercase sentences.
- When adding tests, follow the existing structure and naming style.

## Templates and Parsing
- Template keywords are uppercase with underscores (e.g., `SOURCE_MEMBER_ID`).
- Template parsing uses regex helpers; avoid altering regex behavior unless required.
- Keep keyword handling aligned with `TemplateString.availableKeyword`.

## Discord Integration Notes
- `src/index.ts` creates and configures the Discord `Client`.
- Bun auto-loads `.env`; avoid introducing new `dotenv` usage (legacy code still calls it).
- Bot token uses `process.env.TOKEN` (note: typo `TOEKN` exists in code; do not change unless asked).

## Dependency Notes
- Audio and voice handled via `@discordjs/voice` (Opus fallback uses `opusscript`).
- YAML parsing via `Bun.YAML.parse` (built-in).

## Change Safety Checklist
- Keep changes scoped to the request.
- Avoid broad refactors or style normalization.
- Update tests if behavior changes.
- Do not modify package scripts unless requested.
- Document new commands or conventions here if added.

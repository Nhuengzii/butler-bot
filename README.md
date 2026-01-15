# Butler Bot

## Bun migration notes

`discord-speech-recognition` has been removed because it hard-depends on the native `@discordjs/opus` binary, which fails under Bun (Node ABI mismatch). Until a Bun-compatible Opus build is available, the speech recognition hook in `src/butler/butler.ts` is disabled and the `MemberSpeak` event will not fire.

Dynamic commands now use a local SQLite database via `bun:sqlite` instead of the old HTTP backend. The database file defaults to `data/butler.sqlite` and can be overridden with `BUTLER_DB_PATH`. The instruction-based command generator is disabled until a replacement backend is provided.

To re-enable speech recognition later:
1. Reinstall a Bun-compatible Opus solution (or switch to Node 20 with the native prebuild).
2. Re-add `discord-speech-recognition` to `package.json`.
3. Restore the speech event wiring in `src/butler/butler.ts`.

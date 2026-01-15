# Butler Bot

## YAML command templates

Dynamic commands can be added with a YAML payload. The schema is:

- `name`: command name (string).
- `description`: short description (string).
- `targetEvents`: list of event names (array of strings).
- `actions`: list of action objects with `name` and optional `args`.

### Events

- `MemberSendTextMessage`
- `MemberJoinVoiceChannel`
- `MemberLeaveVoiceChannel`
- `MemberSpeak` (currently disabled; see migration notes below)

### Actions and arguments

- `SendTextMessageToTextChannel` — args: `[channelId, text]`
- `SendTextMessageToChannelByName` — args: `[channelName, text]`
- `SendTextMessageToUser` — args: `[userId, text]`
- `JoinVoiceChannel` — args: `[voiceChannelId]`
- `LeaveVoiceChannel` — args: `null`
- `SayText` — args: `[text]`
- `DisconnectMember` — args: `[memberId]`
- Controllers: `EqualActionController`, `NotEqualActionController`, `GreaterActionController`, `LesserActionController`, `StartWithsActionController`, `NotStartWithsActionController`, `ContainActionController`, `DelayActionController`

### Template strings

Use `{KEYWORD}` placeholders in args. Supported keywords include:

- `SOURCE_MESSAGE_CONTENT`
- `SOURCE_MESSAGE_TC_ID`
- `SOURCE_MESSAGE_TC_NAME`
- `SOURCE_MEMBER_ID`
- `SOURCE_MEMBER_NAME`
- `SOURCE_MEMBER_USERNAME`
- `SOURCE_MEMBER_VC_ID`
- `SOURCE_MEMBER_VC_NAME`
- `SOURCE_SPEECH_CONTENT`

You can also strip a prefix/suffix by using `{KEYWORD:<text to remove>}`.

### Example

```yaml
name: helloResponder
description: reply when someone says hello
targetEvents:
  - MemberSendTextMessage
actions:
  - name: StartWithsActionController
    args:
      - "{SOURCE_MESSAGE_CONTENT}"
      - "hello"
  - name: SendTextMessageToTextChannel
    args:
      - "{SOURCE_MESSAGE_TC_ID}"
      - "Hi {SOURCE_MEMBER_NAME}!"
```

## Workflow viewer

Use `--workflows` in a text channel to open a read-only workflow viewer for dynamic commands. Use the Prev/Next buttons to page actions and the select menu to switch commands.

## Bun migration notes

`discord-speech-recognition` has been removed because it hard-depends on the native `@discordjs/opus` binary, which fails under Bun (Node ABI mismatch). Until a Bun-compatible Opus build is available, the speech recognition hook in `src/butler/butler.ts` is disabled and the `MemberSpeak` event will not fire.

Dynamic commands now use a local SQLite database via `bun:sqlite` instead of the old HTTP backend. The database file defaults to `data/butler.sqlite` and can be overridden with `BUTLER_DB_PATH`. The instruction-based command generator is disabled until a replacement backend is provided.

To re-enable speech recognition later:
1. Reinstall a Bun-compatible Opus solution (or switch to Node 20 with the native prebuild).
2. Re-add `discord-speech-recognition` to `package.json`.
3. Restore the speech event wiring in `src/butler/butler.ts`.

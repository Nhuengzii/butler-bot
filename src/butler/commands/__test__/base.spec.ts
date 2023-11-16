import { ButlerCommand } from ".."

describe("butler commands workds", () => {
  test("from yaml works", () => {
    const t = `
name: say hello when boom has join
targetEvents:
- MemberJoinVoiceChannel
actions:
- name: EqualActionController
  args:
  - "{SOURCE_MEMBER_USERNAME}"
  - boom
`
    const c = ButlerCommand.fromYaml(t)
    expect(c).toBeInstanceOf(ButlerCommand)
    expect(c.name).toBe("say hello when boom has join")
    expect(c.targetEvents).toEqual(["MemberJoinVoiceChannel"])
    expect(c.actions).toHaveLength(1)
  })


})

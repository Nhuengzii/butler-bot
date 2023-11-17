import { TemplateString } from ".."
import { BasePayload } from "../../payloads"

describe("TemplateString", () => {
  beforeEach(() => {
    // mock method getValuesOfKeyword from TemplateString
    TemplateString.getValueOfKeyword = jest.fn((keyword, payload) => {
      switch (keyword) {
        case "SOURCE_MEMBER_VC_ID":
          return "123456789"
        case "SOURCE_MESSAGE_TC_ID":
          return "987654321"
        case "SOURCE_MESSAGE_CONTENT":
          return `--add-command
\`\`\`yaml
name: Hi
targetEvents:
- MemberSendTextMessage
actions:
  - name: EqualActionController
    args:
    - "{SOURCE_MESSAGE_CONTENT}"
    - "Hello"
  - name: SendTextMessageToTextChannel
    args:
    - "{SOURCE_MESSAGE_TC_ID}"
    - Hi
\`\`\``
        default:
          return ""
      }
    })
  })

  it("remove mod correctly", () => {
    const template = "Hello my name is {SOURCE_MEMBER_VC_ID:<--yee>}"
    const template2 = `Hello my name is {SOURCE_MEMBER_VC_ID:<354353453
>}`
    expect(TemplateString.removeKeywordModifyer(template)).toEqual("Hello my name is {SOURCE_MEMBER_VC_ID}")
    expect(TemplateString.removeKeywordModifyer(template2)).toEqual("Hello my name is {SOURCE_MEMBER_VC_ID}")
  })

  it("getKeywords correctly", () => {
    const template = "Hello my name is {SOURCE_MEMBER_VC_ID} {SOURCE_MESSAGE_TC_ID}"
    const template2 = "Hello my name is {SOURCE_MEMBER_VC_ID:<354353453>} {SOURCE_MESSAGE_TC_ID} {SOURCE_MESSAGE_TC_ID}yay"
    const template3 = "Yay Yay"
    expect(TemplateString.getKeywords(template)).toEqual(["SOURCE_MEMBER_VC_ID", "SOURCE_MESSAGE_TC_ID"])
    expect(TemplateString.getKeywords(template2)).toEqual(["SOURCE_MEMBER_VC_ID", "SOURCE_MESSAGE_TC_ID"])
    expect(TemplateString.getKeywords(template3)).toEqual([])
  })

  it("extract to be delete substring correctly", () => {
    const template = "Hello my name is {SOURCE_MEMBER_VC_ID} {SOURCE_MESSAGE_CONTENT:<--remove-command>}"
    const template2 = "{SOURCE_MESSAGE_CONTENT:<}"
    expect(TemplateString.getToBeDeletedSubstring(template)).toEqual(["--remove-command"])
    expect(TemplateString.getToBeDeletedSubstring(template2)).toEqual([])
    expect(TemplateString.getKeywords(template2)).toEqual([])
  })


  it("verifyTemplate correctly", () => {
    const validTemplate = "Hello my name is {SOURCE_MEMBER_VC_ID} {SOURCE_MESSAGE_TC_ID}"
    const invalidTemplate = "Hello my name is {SOURCE_MEMBER_VC_ID} {SOURCE_MESSAGE_TC_ID} {INVALID_KEYWORD}"
    expect(TemplateString.verifyTemplate(validTemplate)).toBeTruthy();
    expect(TemplateString.verifyTemplate(invalidTemplate)).toBeFalsy();
  })

  it("should throw error when instantiating with invalid template", () => {
    const invalidTemplate = "Hello my name is {SOURCE_MEMBER_VC_ID} {SOURCE_MESSAGE_TC_ID} {INVALID_KEYWORD}"
    expect(() => new TemplateString(invalidTemplate)).toThrow("Invalid template string")
  })

  test("fromTemplateKeyword works correctly", () => {
    expect(TemplateString.fromTemplateKeyword("SOURCE_MEMBER_VC_ID").template).toEqual("{SOURCE_MEMBER_VC_ID}")
  })

  it("get toBeDelete substring correctly", () => {
    const template = `{SOURCE_MESSAGE_CONTENT:<--add-command
>}`
    expect(TemplateString.getToBeDeletedSubstring(template)).toEqual([`--add-command
`])
  })

  it("format correctly", () => {
    const template = new TemplateString("Hello my name is {SOURCE_MEMBER_VC_ID} {SOURCE_MESSAGE_TC_ID}")
    expect(template.format({} as BasePayload)).toEqual("Hello my name is 123456789 987654321")
  })

  it("format correctly with yaml correctly", () => {
    const template = new TemplateString(`{SOURCE_MESSAGE_CONTENT:<--add-command
>}`)
    expect(template.format({} as BasePayload)).toEqual(`\`\`\`yaml
name: Hi
targetEvents:
- MemberSendTextMessage
actions:
  - name: EqualActionController
    args:
    - "{SOURCE_MESSAGE_CONTENT}"
    - "Hello"
  - name: SendTextMessageToTextChannel
    args:
    - "{SOURCE_MESSAGE_TC_ID}"
    - Hi
\`\`\``)
  })
})


import { TemplateString } from ".."

describe("TemplateString", () => {
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
})


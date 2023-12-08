import { AvailableTemplateKeyword } from ".";


class TemplateString {
  public template: string;
  constructor(template: string) {
    if (!TemplateString.verifyTemplate(template)) {
      throw new Error(`Invalid template string: ` + template)
    }
    this.template = template;
  }


  static removeKeywordModifyer(template: string): string {
    const mods = TemplateString.getToBeDeletedSubstring(template)
    mods.forEach(mod => {
      template = template.replace(`:<${mod}>`, "")
    })
    return template
  }

  static getKeywords(template: string): string[] {
    const noModTemplate = TemplateString.removeKeywordModifyer(template)
    const regex = /{([A-Z_]+)}/g
    const keywords = noModTemplate.match(regex) || []
    const uniqueKeywords = [...new Set(keywords)]
    return uniqueKeywords.map(keyword => keyword.slice(1, keyword.length - 1))
  }

  public getKeywords(): string[] {
    return TemplateString.getKeywords(this.template)
  }

  public getToBeDeletedSubstring(): string[] {
    return TemplateString.getToBeDeletedSubstring(this.template)
  }

  static getToBeDeletedSubstring(template: string): string[] {
    const regex = /{([A-Z_]+):<(.*)[\r\n]?>}/g
    const keywords = template.match(regex) || []
    const toBeDeleted: string[] = []
    keywords.forEach(keyword => {
      const mod = keyword.match(/:<(.*)[\r\n]?>/g)
      if (!mod) return
      if (toBeDeleted.includes(mod[0])) return
      toBeDeleted.push(mod[0])
    })
    return toBeDeleted.map(m => m.slice(2, m.length - 1))
  }

  static verifyTemplate(template: string): boolean {
    const keywords = this.getKeywords(template)
    return keywords.every(keyword => this.availableKeyword.includes(keyword))
  }

  static fromTemplateKeyword(keyword: keyof AvailableTemplateKeyword) {
    return new TemplateString(`{${keyword}}`)
  }
  static availableKeyword = [
    "SOURCE_MEMBER_VC_ID",
    "SOURCE_MESSAGE_TC_ID",
    "SOURCE_MEMBER_USERNAME",
    "SOURCE_MESSAGE_CONTENT",
    "SOURCE_MEMBER_ID",
    "SOURCE_MEMBER_NAME",
    "SOURCE_SPEECH_CONTENT",
    "SOURCE_MEMBER_VC_NAME",
    "SOURCE_MESSAGE_TC_NAME",

  ]
}
export { TemplateString }

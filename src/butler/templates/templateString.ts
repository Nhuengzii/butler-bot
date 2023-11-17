import { log } from "console";
import { AvailableTemplateKeyword } from ".";
import { BasePayload, MemberJoinVoiceChannelPayload, MessageCreatePayload } from "../payloads";


class TemplateString {
  public template: string;
  constructor(template: string) {
    if (!TemplateString.verifyTemplate(template)) {
      throw new Error(`Invalid template string: ` + template)
    }
    this.template = template;
  }
  format(payload: BasePayload) {
    const keywords = TemplateString.getKeywords(this.template)
    let values: Record<string, string> = {}
    let formattedString = TemplateString.removeKeywordModifyer(this.template)
    keywords.forEach(keyword => {
      values[keyword] = TemplateString.getValueOfKeyword(keyword as keyof AvailableTemplateKeyword, payload as MemberJoinVoiceChannelPayload | MessageCreatePayload)
      formattedString = formattedString.replace(`{${keyword}}`, values[keyword])
    })
    const toBeDeletedSubstring = TemplateString.getToBeDeletedSubstring(this.template)
    toBeDeletedSubstring.forEach(substring => {
      formattedString = formattedString.replace(substring, "")
    })
    return formattedString
  }

  static removeKeywordModifyer(template: string): string {
    const mods = template.match(/:<(.*)>/g) || []
    mods.forEach(mod => {
      template = template.replace(mod, "")
    })
    return template
  }

  static getKeywords(template: string): string[] {
    const regex = /{([A-Z_]+)}|{([A-Z_]+):<(.*)>}/g
    const keywords = (template.match(regex) || []).map(keyword => {
      const toBeDeleted = keyword.match(/<(.*)>/)?.[0] || ""
      if (!toBeDeleted) {
        return keyword
      }
      return keyword.replace(toBeDeleted, "").replace(":", "")
    })
    const uniqueKeywords = [...new Set(keywords)].map(keyword => keyword.slice(1, -1)) // remove the curly braces
    return uniqueKeywords
  }

  static getToBeDeletedSubstring(template: string): string[] {
    const regex = /{([A-Z_]+):<(.*)>}/g
    const keywords = (template.match(regex) || []).map(keyword => {
      const toBeDeleted = keyword.match(/<(.*)>/)?.[0] || ""
      return toBeDeleted.slice(1, -1)
    })
    const uniqueKeywords = [...new Set(keywords)]
    return uniqueKeywords
  }

  static verifyTemplate(template: string): boolean {
    const keywords = this.getKeywords(template)
    return keywords.every(keyword => this.availableKeyword.includes(keyword))
  }

  static getValueOfKeyword<T extends keyof AvailableTemplateKeyword>(keyword: T, payload: AvailableTemplateKeyword[T]): string {
    switch (keyword) {
      case "SOURCE_MEMBER_VC_ID": {
        return payload.sourceMember.voice.channelId!
      }
      case "SOURCE_MESSAGE_TC_ID":
        return (payload as MessageCreatePayload).textChannelId
      case "SOURCE_MEMBER_USERNAME":
        return payload.sourceMember.user.displayName
      case "SOURCE_MESSAGE_CONTENT":
        return (payload as MessageCreatePayload).message.content
      case "SOURCE_MEMBER_ID":
        console.log(payload.sourceMember.user.id);

        return payload.sourceMember.user.id
      default:
        throw new Error(`Unknown keyword: ${keyword}`)
    }
  }
  static fromTemplateKeyword(keyword: keyof AvailableTemplateKeyword) {
    return new TemplateString(`{${keyword}}`)
  }
  static availableKeyword = [
    "SOURCE_MEMBER_VC_ID",
    "SOURCE_MESSAGE_TC_ID",
    "SOURCE_MEMBER_USERNAME",
    "SOURCE_MESSAGE_CONTENT",
    "SOURCE_MEMBER_ID"
  ]
}
export { TemplateString }

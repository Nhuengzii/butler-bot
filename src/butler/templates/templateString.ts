import { log } from "console";
import { AvailableTemplateKeyword } from ".";
import { BasePayload, MemberJoinVoiceChannelPayload, MemberSpeakPayload, MessageCreatePayload } from "../payloads";


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

  static getValueOfKeyword<T extends keyof AvailableTemplateKeyword>(keyword: T, payload: AvailableTemplateKeyword[T]): string {
    switch (keyword) {
      case "SOURCE_MEMBER_VC_ID": {
        return payload.sourceMember.voice.channelId!
      }
      case "SOURCE_MESSAGE_TC_ID":
        return (payload as MessageCreatePayload).textChannelId
      case "SOURCE_MEMBER_USERNAME":
        return payload.sourceMember.user.username
      case "SOURCE_MEMBER_NAME":
        return payload.sourceMember.displayName
      case "SOURCE_MESSAGE_CONTENT":
        return (payload as MessageCreatePayload).message.content
      case "SOURCE_MEMBER_ID":
        return payload.sourceMember.user.id
      case "SOURCE_SPEECH_CONTENT":
        return (payload as MemberSpeakPayload).speech
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
    "SOURCE_MEMBER_ID",
    "SOURCE_MEMBER_NAME",
    "SOURCE_SPEECH_CONTENT"
  ]
}
export { TemplateString }

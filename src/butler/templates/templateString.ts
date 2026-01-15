import type { AvailableTemplateKeyword } from ".";
import type { BasePayload, MemberJoinVoiceChannelPayload, MemberLeaveVoiceChannelPayload, MemberSpeakPayload, MessageCreatePayload } from "../payloads";

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

  public format(payload: BasePayload): string {
    const keywords = this.getKeywords()
    let formattedString = TemplateString.removeKeywordModifyer(this.template)
    keywords.forEach(keyword => {
      const value = TemplateString.getValueOfKeyword(
        keyword as keyof AvailableTemplateKeyword,
        payload as MemberJoinVoiceChannelPayload | MemberLeaveVoiceChannelPayload | MessageCreatePayload | MemberSpeakPayload
      )
      formattedString = formattedString.replace(`{${keyword}}`, value)
    })
    const toBeDeletedSubstring = this.getToBeDeletedSubstring()
    toBeDeletedSubstring.forEach(substring => {
      formattedString = formattedString.replace(substring, "")
    })
    return formattedString
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

  static getValueOfKeyword<T extends keyof AvailableTemplateKeyword>(
    keyword: T,
    payload: AvailableTemplateKeyword[T]
  ): string {
    switch (keyword) {
      case "SOURCE_MEMBER_VC_ID": {
        const voiceChannelId = (payload as MemberLeaveVoiceChannelPayload).voiceChannelId
          ?? (payload as MemberJoinVoiceChannelPayload).sourceMember.voice.channelId
        return voiceChannelId || ""
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
      case "SOURCE_MEMBER_VC_NAME": {
        const voiceChannelId = (payload as MemberLeaveVoiceChannelPayload).voiceChannelId
          ?? (payload as MemberJoinVoiceChannelPayload).sourceMember.voice.channelId
        if (!voiceChannelId) return ""
        const channel = payload.sourceMember.guild.channels.cache.get(voiceChannelId)
        return channel?.name || ""
      }
      case "SOURCE_MESSAGE_TC_NAME": {
        const messagePayload = payload as MessageCreatePayload
        const channel = messagePayload.sourceMember.guild.channels.cache.get(messagePayload.textChannelId)
        return channel?.name || ""
      }
      default:
        return ""
    }
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

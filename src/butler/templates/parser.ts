import { Client } from "discord.js";
import { AvailableTemplateKeyword, TemplateString } from ".";
import { BasePayload, MemberJoinVoiceChannelPayload, MemberSpeakPayload, MessageCreatePayload } from "../payloads";

class TemplateStringParser {
  constructor(public client: Client) {

  }

  public async parse(template: TemplateString, payload: BasePayload) {
    const keywords = template.getKeywords()
    let values: Record<string, string> = {}
    let formattedString = TemplateString.removeKeywordModifyer(template.template)
    keywords.forEach(keyword => {
      values[keyword] = this.getValueOfKeyword(keyword as keyof AvailableTemplateKeyword,
        payload as MemberJoinVoiceChannelPayload | MessageCreatePayload)
      formattedString = formattedString.replace(`{${keyword}}`, values[keyword])
    })
    const toBeDeletedSubstring = template.getToBeDeletedSubstring()
    toBeDeletedSubstring.forEach(substring => {
      formattedString = formattedString.replace(substring, "")
    })
    return formattedString
  }

  public getValueOfKeyword<T extends keyof AvailableTemplateKeyword>(keyword: T, payload: AvailableTemplateKeyword[T]): string {
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

}

export { TemplateStringParser }

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

  private getGuild(guildId: string) {
    const guild = this.client.guilds.cache.get(guildId)
    if (!guild) throw new Error(`Guild not found: ${guildId}`)
    return guild
  }

  private getGuildChannel(guildId: string, channelId: string) {
    const guild = this.getGuild(guildId)
    const channel = guild.channels.cache.get(channelId)
    if (!channel) throw new Error(`Channel not found: ${channelId}`)
    return channel
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
      case "SOURCE_MEMBER_VC_NAME":
        return payload.sourceMember.voice.channel?.name!
      case "SOURCE_MESSAGE_TC_NAME": {
        const channelId = (payload as MessageCreatePayload).textChannelId
        const channel = this.getGuildChannel(payload.guildId, channelId)
        return channel.name
      }
      default:
        throw new Error(`Unknown keyword: ${keyword}`)
    }
  }

}

export { TemplateStringParser }

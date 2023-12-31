import { MemberJoinVoiceChannelPayload, MessageCreatePayload } from "../payloads"

interface AvailableTemplateKeyword {
  SOURCE_MEMBER_VC_ID: MemberJoinVoiceChannelPayload | MessageCreatePayload,
  SOURCE_MEMBER_ID: MemberJoinVoiceChannelPayload | MessageCreatePayload | MemberJoinVoiceChannelPayload | MemberJoinVoiceChannelPayload,
  SOURCE_MESSAGE_TC_ID: MessageCreatePayload,
  SOURCE_MEMBER_USERNAME: MemberJoinVoiceChannelPayload | MessageCreatePayload | MemberJoinVoiceChannelPayload | MemberJoinVoiceChannelPayload,
  SOURCE_MESSAGE_CONTENT: MessageCreatePayload,
}

export { AvailableTemplateKeyword }

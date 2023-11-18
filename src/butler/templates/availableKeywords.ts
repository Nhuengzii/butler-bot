import { MemberJoinVoiceChannelPayload, MemberSpeakPayload, MessageCreatePayload } from "../payloads"

interface AvailableTemplateKeyword {
  SOURCE_MEMBER_VC_ID: MemberJoinVoiceChannelPayload | MessageCreatePayload,
  SOURCE_MEMBER_ID: MemberJoinVoiceChannelPayload | MessageCreatePayload | MemberJoinVoiceChannelPayload | MemberJoinVoiceChannelPayload,
  SOURCE_MESSAGE_TC_ID: MessageCreatePayload,
  SOURCE_MEMBER_USERNAME: MemberJoinVoiceChannelPayload | MessageCreatePayload | MemberJoinVoiceChannelPayload | MemberJoinVoiceChannelPayload,
  SOURCE_MEMBER_NAME: MemberJoinVoiceChannelPayload | MessageCreatePayload | MemberJoinVoiceChannelPayload | MemberJoinVoiceChannelPayload,
  SOURCE_MESSAGE_CONTENT: MessageCreatePayload,
  SOURCE_SPEECH_CONTENT: MemberSpeakPayload
}

export { AvailableTemplateKeyword }

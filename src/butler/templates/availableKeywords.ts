import {
  MemberJoinVoiceChannelPayload,
  MemberLeaveVoiceChannelPayload,
  MemberSpeakPayload,
  MessageCreatePayload,
} from "../payloads";

interface AvailableTemplateKeyword {
  SOURCE_MEMBER_VC_ID: MemberJoinVoiceChannelPayload | MemberLeaveVoiceChannelPayload | MessageCreatePayload;
  SOURCE_MEMBER_VC_NAME: MemberJoinVoiceChannelPayload | MemberLeaveVoiceChannelPayload | MessageCreatePayload;
  SOURCE_MEMBER_ID: MemberJoinVoiceChannelPayload | MemberLeaveVoiceChannelPayload | MessageCreatePayload;
  SOURCE_MESSAGE_TC_ID: MessageCreatePayload;
  SOURCE_MESSAGE_TC_NAME: MessageCreatePayload;
  SOURCE_MEMBER_USERNAME: MemberJoinVoiceChannelPayload | MemberLeaveVoiceChannelPayload | MessageCreatePayload;
  SOURCE_MEMBER_NAME: MemberJoinVoiceChannelPayload | MemberLeaveVoiceChannelPayload | MessageCreatePayload;
  SOURCE_MESSAGE_CONTENT: MessageCreatePayload;
  SOURCE_SPEECH_CONTENT: MemberSpeakPayload;
}

export { AvailableTemplateKeyword };

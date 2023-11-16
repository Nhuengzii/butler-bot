import { GuildMember } from "discord.js";
import { BasePayload } from ".";

interface MemberJoinVoiceChannelPayload extends BasePayload {
  timestamp: number,
  sourceMember: GuildMember,
  voiceChannelId: string,
}


export { MemberJoinVoiceChannelPayload }

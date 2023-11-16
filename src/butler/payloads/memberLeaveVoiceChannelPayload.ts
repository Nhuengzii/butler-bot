import { GuildMember } from "discord.js";
import { BasePayload } from ".";

interface MemberLeaveVoiceChannelPayload extends BasePayload {
  timestamp: number,
  sourceMember: GuildMember,
  voiceChannelId: string,
}


export { MemberLeaveVoiceChannelPayload }

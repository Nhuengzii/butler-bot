import { GuildMember } from "discord.js";
import { BasePayload } from ".";

interface MemberSpeakPayload extends BasePayload {
  sourceMember: GuildMember,
  speech: string,
  voiceChannelId: string,
}

export { MemberSpeakPayload }

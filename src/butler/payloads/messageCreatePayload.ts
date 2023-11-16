import { GuildMember } from "discord.js";
import { BasePayload } from ".";

interface MessageCreatePayload extends BasePayload {
  timestamp: number;
  message: {
    id: string,
    content: string
  },
  textChannelId: string,
  sourceMember: GuildMember
}

export { MessageCreatePayload }

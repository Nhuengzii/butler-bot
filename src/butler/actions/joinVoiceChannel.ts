import { Butler } from "..";
import { BasePayload, MemberJoinVoiceChannelPayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class JoinVoiceChannelAction implements ButlerAction {
  public targetChannel: TemplateString;
  constructor(targetChannel: TemplateString) {
    this.targetChannel = targetChannel;
  }
  async execute(butler: Butler, payload: BasePayload) {
    const channelId = TemplateString.getValueOfKeyword("SOURCE_MEMBER_VC_ID", payload as MemberJoinVoiceChannelPayload);
    const guild = await butler.client.guilds.fetch(payload.guildId)
    if (!guild) {
      throw new Error("Guild not found");
    }
    butler.joinVoiceChannel(guild, channelId)
    return true

  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { JoinVoiceChannelAction }

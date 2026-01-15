import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class SendTextMessageToChannelByNameAction implements ButlerAction {
  public targetChannelName: TemplateString;
  public textMessage: TemplateString;
  constructor(targetChannelName: TemplateString, textMessage: TemplateString) {
    this.targetChannelName = targetChannelName;
    this.textMessage = textMessage;
  }
  async execute(butler: Butler, payload: BasePayload) {
    const text = await butler.parse(this.textMessage, payload);
    const targetChannelName = await butler.parse(this.targetChannelName, payload);
    const guild = butler.client.guilds.cache.get(payload.guildId);
    if (!guild) {
      console.log(`Guild not found: ${payload.guildId}`);
      return false;
    }
    const channel = guild.channels.cache.find(
      channel => channel.isTextBased() && channel.name === targetChannelName
    );
    if (!channel || !channel.isTextBased()) {
      console.log(`Text channel not found: ${targetChannelName}`);
      return false;
    }
    await channel.send({ content: text });
    return true;
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { SendTextMessageToChannelByNameAction };

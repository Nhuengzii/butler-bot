import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class SendTextMessageToTextChannelAction implements ButlerAction {
  public targetChannelId: TemplateString;
  public textMessage: TemplateString;
  constructor(targetChannelId: TemplateString, textMessage: TemplateString) {
    this.targetChannelId = targetChannelId;
    this.textMessage = textMessage;
  }
  async execute(butler: Butler, payload: BasePayload) {
    const text = this.textMessage.format(payload);
    const targetChannelId = this.targetChannelId.format(payload);
    const channel = butler.client.channels.cache.get(targetChannelId);
    if (channel?.isTextBased()) {
      await channel.send({ content: text })
    } else {
      throw new Error(`Channel ${targetChannelId} is not a text channel`)
    }
    return true;
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { SendTextMessageToTextChannelAction }

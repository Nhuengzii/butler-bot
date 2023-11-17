import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class ShowAvailableCommandsInTextChannelAction implements ButlerAction {
  constructor(public textChannelId: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const channel = await butler.client.channels.fetch(this.textChannelId.format(payload));
    if (!channel?.isTextBased()) {
      return false;
    }
    const text = "```\nAvailable commands:\n- " + butler.availableCommands.map(command => command).join("\n- ") + "\n```";
    await channel.send({ content: text });
    return true;
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { ShowAvailableCommandsInTextChannelAction }

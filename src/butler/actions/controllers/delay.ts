import { Client } from "discord.js";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";
import { Butler } from "../..";

class DelayActionController implements ButlerAction {
  constructor(public timeout: TemplateString) {
  }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const timeout = Number.parseInt(this.timeout.format(payload))
    await new Promise(resolve => setTimeout(resolve, timeout))
    return true
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { DelayActionController }

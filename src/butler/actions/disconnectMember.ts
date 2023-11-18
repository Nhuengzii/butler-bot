import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class DisconnectMemberAction implements ButlerAction {
  constructor(public memberId: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const voiceSatae = await butler.getMemberVoiceState(this.memberId.format(payload))
    if (!voiceSatae) return false
    await voiceSatae.disconnect()
    return true
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { DisconnectMemberAction }

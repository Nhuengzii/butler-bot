import { Butler } from "..";
import { BasePayload } from "../payloads";
import { ButlerAction } from "./base";

class LeaveVoiceChannelAction implements ButlerAction {
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    butler.leaveVoiceChannel()
    return true;
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { LeaveVoiceChannelAction }

import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class SendTextMessageToUser implements ButlerAction {
  constructor(public userId: TemplateString, public text: TemplateString) { }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

  public async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const userId = await butler.parse(this.userId, payload)
    const text = await butler.parse(this.text, payload)
    await butler.sendTextMessageToUser(userId, text)
    return true
  }

}

export { SendTextMessageToUser }

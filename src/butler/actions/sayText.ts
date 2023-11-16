import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class SayTextAction implements ButlerAction {
  constructor(public text: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    await butler.sayText(this.text.format(payload))
    return true
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { SayTextAction }

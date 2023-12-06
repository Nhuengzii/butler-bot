import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class SayTextAction implements ButlerAction {
  constructor(public text: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const text = await butler.parse(this.text, payload)
    await butler.sayText(text)
    return true
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { SayTextAction }

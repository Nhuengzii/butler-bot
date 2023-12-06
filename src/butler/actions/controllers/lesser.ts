import { Butler } from "../..";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";

class LesserActionController implements ButlerAction {
  constructor(public a: TemplateString, public b: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const a = await butler.parse(this.a, payload)
    const b = await butler.parse(this.b, payload)
    return Number.parseFloat(a) < Number.parseFloat(b);
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { LesserActionController }

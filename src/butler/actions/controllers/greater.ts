import { Butler } from "../..";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";

class GreaterActionController implements ButlerAction {
  constructor(public a: TemplateString, public b: TemplateString) { }
  async execute(buter: Butler, payload: BasePayload): Promise<boolean> {
    const a = await buter.parse(this.a, payload)
    const b = await buter.parse(this.b, payload)
    return Number.parseFloat(a) > Number.parseFloat(b);
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { GreaterActionController }

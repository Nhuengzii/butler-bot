import { Butler } from "../..";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";

class GreaterActionController implements ButlerAction {
  constructor(public a: TemplateString, public b: TemplateString) { }
  async execute(buter: Butler, payload: BasePayload): Promise<boolean> {
    const a = Number.parseFloat(this.a.format(payload))
    const b = Number.parseFloat(this.b.format(payload))
    return a > b;
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { GreaterActionController }

import { Butler } from "../..";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";

class StartWithsActionController implements ButlerAction {
  constructor(public a: TemplateString, public b: TemplateString) {
  }
  async execute(butler: Butler, payload: BasePayload) {
    const a = await butler.parse(this.a, payload)
    const b = await butler.parse(this.b, payload)
    return a.startsWith(b);
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { StartWithsActionController }

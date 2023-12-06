import { Butler } from "../..";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";

class ContainActionController implements ButlerAction {
  constructor(public text: TemplateString, public subtext: TemplateString[]) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const text = await butler.parse(this.text, payload);
    const subtext = await Promise.all(this.subtext.map(async (subtext) => await butler.parse(subtext, payload)))
    return subtext.some(subtext => text.includes(subtext))
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { ContainActionController }

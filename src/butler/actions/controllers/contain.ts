import { Butler } from "../..";
import { BasePayload } from "../../payloads";
import { TemplateString } from "../../templates";
import { ButlerAction } from "../base";

class ContainActionController implements ButlerAction {
  constructor(public text: TemplateString, public subtext: TemplateString[]) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const text = this.text.format(payload);
    return this.subtext.some(subtext => text.includes(subtext.format(payload)));
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { ContainActionController }

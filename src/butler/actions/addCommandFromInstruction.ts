import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class AddCommandFromInstructionAction implements ButlerAction {
  constructor(public instruction: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const instruction = await butler.parse(this.instruction, payload)
    console.log("Command generation backend is disabled.", instruction)
    return false
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { AddCommandFromInstructionAction };

import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class RemoveCommandAction implements ButlerAction {
  constructor(public commandName: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const commandName = await butler.parse(this.commandName, payload);
    return butler.removeCommand(commandName);
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { RemoveCommandAction };

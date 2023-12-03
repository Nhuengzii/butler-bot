import axios from "axios";
import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";
import { ButlerCommand } from "../commands";
import { AvailableButlerAction, createButlerAction } from ".";
import { AvailableEvents } from "../events";

type GenCommandResponse = {
  command: {
    name: string,
    description: string,
    events: AvailableEvents[],
    actions: {
      name: AvailableButlerAction,
      args: string[],
    }[],
  }
}

class AddCommandFromInstructionAction implements ButlerAction {
  constructor(public instruction: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const instruction = this.instruction.format(payload);
    try {
      const res = await axios.get<GenCommandResponse>("http://localhost:8000/commands/gen-command", { params: { q: instruction } })
      const data = res.data.command
      console.log(data);
      const command = new ButlerCommand(data.name, data.events, data.actions.map(a => createButlerAction(a.name, a.args)))
      butler.addCommand(command);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }
}

export { AddCommandFromInstructionAction };

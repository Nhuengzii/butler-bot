import axios from "axios";
import { Butler } from "..";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";
import { ButlerCommand } from "../commands";
import { log } from "console";

class AddCommandFromInstructionAction implements ButlerAction {
  constructor(public instruction: TemplateString) { }
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    const instruction = this.instruction.format(payload);
    try {
      const res = await axios.get<{ command: string }>("http://localhost:8000/gen-command", { params: { instruction } })
      const yaml = res.data.command.replace(`\`\`\`yaml
`, "").replace(`\`\`\``, "")
      log(yaml);
      const command = ButlerCommand.fromYaml(yaml);
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

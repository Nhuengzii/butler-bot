import { Butler } from "..";
import { ButlerCommand } from "../commands";
import { BasePayload } from "../payloads";
import { TemplateString } from "../templates";
import { ButlerAction } from "./base";

class AddCommandFromYamlAction implements ButlerAction {
  constructor(public messageContent: TemplateString) {

  }
  async execute(butler: Butler, payload: BasePayload) {
    const yaml = this.messageContent.format(payload).replace(`\`\`\`yaml
`, "").replace(`\`\`\``, "")
    if (!ButlerCommand.validateYaml(yaml)) {
      return false
    }
    const command = ButlerCommand.fromYaml(yaml)
    await butler.uploadCommandFromYaml(yaml)
    butler.addCommand(command)
    return true
  }
  validatePayload(payload: BasePayload): boolean {
    throw new Error("Method not implemented.");
  }

}

export { AddCommandFromYamlAction }

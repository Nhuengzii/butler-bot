import { StartWithsActionController } from ".";
import { Butler } from "../..";
import { BasePayload } from "../../payloads";

class NotStartWithsActionController extends StartWithsActionController {
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    return !(await super.execute(butler, payload))
  }
}

export { NotStartWithsActionController }

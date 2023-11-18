import { EqualActionController } from ".";
import { Butler } from "../..";
import { BasePayload } from "../../payloads";

class NotEqualActionController extends EqualActionController {
  async execute(butler: Butler, payload: BasePayload): Promise<boolean> {
    return !(await super.execute(butler, payload))
  }
}

export { NotEqualActionController }

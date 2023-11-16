import { BasePayload } from "../payloads"
import { Butler } from ".."

abstract class ButlerAction {
  abstract execute(butler: Butler, payload: BasePayload): Promise<boolean>
  abstract validatePayload(payload: BasePayload): boolean
}

export { ButlerAction }

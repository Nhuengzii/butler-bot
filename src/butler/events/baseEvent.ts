import { BasePayload } from "../payloads"

interface BaseEvent {
  name: string
  timestamp: number
  guildId: string
  payload: BasePayload
}

export { BaseEvent }

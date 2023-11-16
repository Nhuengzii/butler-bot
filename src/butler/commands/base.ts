import { Butler } from "..";
import { AvailableButlerAction, createButlerAction } from "../actions";
import { ButlerAction } from "../actions/base";
import { AvailableEvents } from "../events";
import { BasePayload } from "../payloads";
import { parse } from "yaml"

class ButlerCommand {
  constructor(public name: string, public targetEvents: AvailableEvents[], public actions: ButlerAction[]) { }
  async run(butler: Butler, payload: BasePayload) {
    for (let i = 0; i < this.actions.length; i++) {
      if (!await this.actions[i].execute(butler, payload)) {
        return
      }
    }
  }

  static fromYaml(y: string) {
    const commandTemplate: {
      name: string,
      targetEvents: AvailableEvents[],
      actions: {
        name: AvailableButlerAction,
        args: string[] | null
      }[]
    } = parse(y)
    return new ButlerCommand(commandTemplate.name,
      commandTemplate.targetEvents,
      commandTemplate.actions.map(a => createButlerAction(a.name, a.args))
    )
  }

  static validateYaml(y: string): boolean {
    try {
      ButlerCommand.fromYaml(y)
    } catch (e) {
      return false
    } finally {
      return true
    }
  }
}

export { ButlerCommand }

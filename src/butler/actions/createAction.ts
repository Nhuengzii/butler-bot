import { AvailableButlerAction, JoinVoiceChannelAction, SayTextAction } from ".";
import { TemplateString } from "../templates";
import { ContainActionController, DelayActionController, EqualActionController, GreaterActionController, LesserActionController, StartWithsActionController } from "./controllers";
import { DisconnectMemberAction } from "./disconnectMember";
import { LeaveVoiceChannelAction } from "./leaveVoiceChannel";
import { SendTextMessageToTextChannelAction } from "./sendTextMessageToTextChannel";

function createButlerAction(name: AvailableButlerAction, args: string[] | null) {
  if (args === null) {
    switch (name) {
      case AvailableButlerAction.LeaveVoiceChannel: {
        return new LeaveVoiceChannelAction()
      }
      default: {
        throw new Error(`Unknown action ${name}`)
      }
    }
  }
  switch (name) {
    case AvailableButlerAction.DelayActionController: {
      return new DelayActionController(new TemplateString(args[0]))
    }
    case AvailableButlerAction.SendTextMessageToTextChannel: {
      return new SendTextMessageToTextChannelAction(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.JoinVoiceChannel: {
      return new JoinVoiceChannelAction(
        new TemplateString(args[0]),
      )
    }
    case AvailableButlerAction.GreaterActionController: {
      return new GreaterActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.LesserActionController: {
      return new LesserActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.EqualActionController: {
      return new EqualActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.StartWithsActionController: {
      return new StartWithsActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.LeaveVoiceChannel: {
      return new LeaveVoiceChannelAction()
    }
    case AvailableButlerAction.SayText: {
      return new SayTextAction(
        new TemplateString(args[0])
      )
    }
    case AvailableButlerAction.NotEqualActionController: {
      return new EqualActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.NotStartWithsActionController: {
      return new StartWithsActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.DisconnectMember: {
      return new DisconnectMemberAction(
        new TemplateString(args[0])
      )
    }
    case AvailableButlerAction.ContainActionController: {
      return new ContainActionController(
        new TemplateString(args[0]),
        args.slice(1).map(arg => new TemplateString(arg))
      )
    }
    default: {
      throw new Error(`Unknown action ${name}`)
    }
  }
}

export { createButlerAction }

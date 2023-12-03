import { AvailableButlerAction, JoinVoiceChannelAction, SayTextAction, SendTextMessageToUser } from ".";
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
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new SendTextMessageToTextChannelAction(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.JoinVoiceChannel: {
      if (args.length !== 1) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new JoinVoiceChannelAction(
        new TemplateString(args[0]),
      )
    }
    case AvailableButlerAction.GreaterActionController: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new GreaterActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.LesserActionController: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new LesserActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.EqualActionController: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new EqualActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.StartWithsActionController: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new StartWithsActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.SayText: {
      if (args.length !== 1) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new SayTextAction(
        new TemplateString(args[0])
      )
    }
    case AvailableButlerAction.NotEqualActionController: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new EqualActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.NotStartWithsActionController: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new StartWithsActionController(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    case AvailableButlerAction.DisconnectMember: {
      if (args.length !== 1) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new DisconnectMemberAction(
        new TemplateString(args[0])
      )
    }
    case AvailableButlerAction.ContainActionController: {
      if (args.length < 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new ContainActionController(
        new TemplateString(args[0]),
        args.slice(1).map(arg => new TemplateString(arg))
      )
    } case AvailableButlerAction.SendTextMessageToUser: {
      if (args.length !== 2) {
        throw new Error(`Invalid args length for action ${name}`)
      }
      return new SendTextMessageToUser(
        new TemplateString(args[0]),
        new TemplateString(args[1])
      )
    }
    default: {
      throw new Error(`Unknown action ${name}`)
    }
  }
}

export { createButlerAction }

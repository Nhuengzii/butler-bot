import { ButlerCommand } from "..";
import { LeaveVoiceChannelAction } from "../../actions";
import { EqualActionController } from "../../actions/controllers";
import { AvailableEvents } from "../../events";
import { TemplateString } from "../../templates";

class LeaveVoiceChannelCommand extends ButlerCommand {
  constructor() {
    const targetEvents = [
      AvailableEvents.MemberSendTextMessage,
    ]
    const actions = [
      new EqualActionController(TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_CONTENT"), new TemplateString("--leave")),
      new LeaveVoiceChannelAction(),
    ]
    super("joinVoiceChannel", targetEvents, actions)
  }
}

export { LeaveVoiceChannelCommand }

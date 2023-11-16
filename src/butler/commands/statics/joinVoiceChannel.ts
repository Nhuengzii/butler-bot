import { ButlerCommand } from "..";
import { JoinVoiceChannelAction } from "../../actions";
import { EqualActionController } from "../../actions/controllers";
import { AvailableEvents } from "../../events";
import { TemplateString } from "../../templates";

class JoinVoiceChannelCommand extends ButlerCommand {
  constructor() {
    const targetEvents = [
      AvailableEvents.MemberSendTextMessage,
    ]
    const actions = [
      new EqualActionController(TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_CONTENT"), new TemplateString("--join")),
      new JoinVoiceChannelAction(TemplateString.fromTemplateKeyword("SOURCE_MEMBER_VC_ID")),
    ]
    super("joinVoiceChannel", targetEvents, actions)
  }
}

export { JoinVoiceChannelCommand }

import { ButlerCommand } from "..";
import { EqualActionController, ShowAvailableCommandsInTextChannelAction } from "../../actions";
import { AvailableEvents } from "../../events";
import { TemplateString } from "../../templates";

class ShowAvailableCommandsInTextChannelCommand extends ButlerCommand {
  constructor() {
    super("showAvailableCommandsInTextChannel", [
      AvailableEvents.MemberSendTextMessage
    ], [
      new EqualActionController(
        TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_CONTENT"),
        new TemplateString("--show-commands")
      ),
      new ShowAvailableCommandsInTextChannelAction(
        TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_TC_ID")
      )
    ])
  }
}

export { ShowAvailableCommandsInTextChannelCommand }

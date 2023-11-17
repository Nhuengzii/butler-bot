import { ButlerCommand } from "..";
import { RemoveCommandAction, SendTextMessageToTextChannelAction } from "../../actions";
import { StartWithsActionController } from "../../actions/controllers";
import { AvailableEvents } from "../../events";
import { TemplateString } from "../../templates";

class RemoveCommandCommand extends ButlerCommand {
  constructor() {
    super("removeCommandCommand", [
      AvailableEvents.MemberSendTextMessage
    ], [
      new StartWithsActionController(
        TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_CONTENT"),
        new TemplateString("--remove-command ")
      ),
      new SendTextMessageToTextChannelAction(
        new TemplateString("{SOURCE_MESSAGE_TC_ID}"),
        new TemplateString("{SOURCE_MESSAGE_CONTENT:<--remove-command >}")
      ),
      new RemoveCommandAction(
        new TemplateString("{SOURCE_MESSAGE_CONTENT:<--remove-command >}")
      )
    ])
  }
}

export { RemoveCommandCommand }

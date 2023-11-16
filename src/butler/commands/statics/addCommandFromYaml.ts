import { AddCommandFromYamlAction, ButlerCommand } from "..";
import { StartWithsActionController } from "../../actions/controllers";
import { SendTextMessageToTextChannelAction } from "../../actions/sendTextMessageToTextChannel";
import { AvailableEvents } from "../../events";
import { TemplateString } from "../../templates";

class AddCommandFromYamlCommand extends ButlerCommand {
  constructor() {
    const targetEvents = [
      AvailableEvents.MemberSendTextMessage,
    ]
    const actions = [
      new StartWithsActionController(
        TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_CONTENT"),
        new TemplateString("--add-command\n")
      ),
      new AddCommandFromYamlAction(
        TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_CONTENT")
      ),
      new SendTextMessageToTextChannelAction(
        TemplateString.fromTemplateKeyword("SOURCE_MESSAGE_TC_ID"),
        new TemplateString("Command added successfully!")
      )
    ]

    super("addCommandFromYaml", targetEvents, actions)
  }
}

export { AddCommandFromYamlCommand }

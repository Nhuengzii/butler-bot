import { ButlerCommand } from "..";
import { AddCommandFromInstructionAction, SendTextMessageToTextChannelAction, StartWithsActionController } from "../../actions";
import { AvailableEvents } from "../../events";
import { TemplateString } from "../../templates";

class AddCommandFromInstuctionCommand extends ButlerCommand {
  constructor() {
    super('addCommandFromInstruction',
      [AvailableEvents.MemberSendTextMessage],
      [
        new StartWithsActionController(
          new TemplateString("{SOURCE_MESSAGE_CONTENT}"),
          new TemplateString("--add-command-from-instruction "),
        ),
        new AddCommandFromInstructionAction(
          new TemplateString("{SOURCE_MESSAGE_CONTENT:<--add-command-from-instruction >}"),
        ),
        new SendTextMessageToTextChannelAction(
          new TemplateString("{SOURCE_MESSAGE_TC_ID}"),
          new TemplateString("Command added!"),
        )
      ])
  }
}

export { AddCommandFromInstuctionCommand }

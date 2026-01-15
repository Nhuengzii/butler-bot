import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Interaction,
  Message,
  StringSelectMenuBuilder,
} from "discord.js";

import { CommandStore, StoredCommand } from "../storage/commandStore";

const ACTIONS_PER_PAGE = 5;
const SESSION_TTL_MS = 15 * 60 * 1000;
const WORKFLOW_COMMAND = "--workflows";

const BUTTON_PREV = "workflow:prev";
const BUTTON_NEXT = "workflow:next";
const SELECT_COMMAND = "workflow:command";

type WorkflowSession = {
  messageId: string;
  userId: string;
  guildId: string;
  commandName: string | null;
  page: number;
  updatedAt: number;
};

class WorkflowTui {
  private _client: Client;
  private _commandStore: CommandStore;
  private _sessions = new Map<string, WorkflowSession>();

  constructor(client: Client, commandStore: CommandStore) {
    this._client = client;
    this._commandStore = commandStore;
    this._client.on("interactionCreate", interaction => {
      this.handleInteraction(interaction);
    });
  }

  public async handleMessage(message: Message): Promise<boolean> {
    if (!message.inGuild()) return false;
    if (message.author.id === this._client.user?.id) return false;
    if (message.content.trim() !== WORKFLOW_COMMAND) return false;

    const commands = this._commandStore.getCommandsForGuild(message.guildId);
    const commandName = commands[0]?.name ?? null;
    const session: WorkflowSession = {
      messageId: "",
      userId: message.author.id,
      guildId: message.guildId,
      commandName,
      page: 0,
      updatedAt: Date.now(),
    };

    if (!message.channel.isTextBased()) return false;
    const response = await message.channel.send(this.buildView(session, commands, message.guild?.name));
    session.messageId = response.id;
    this._sessions.set(response.id, session);
    return true;
  }

  private async handleInteraction(interaction: Interaction) {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    if (interaction.customId !== BUTTON_PREV && interaction.customId !== BUTTON_NEXT && interaction.customId !== SELECT_COMMAND) {
      return;
    }

    const session = this._sessions.get(interaction.message.id);
    if (!session) {
      await interaction.reply({ content: "This workflow view expired.", ephemeral: true });
      return;
    }

    if (Date.now() - session.updatedAt > SESSION_TTL_MS) {
      this._sessions.delete(interaction.message.id);
      await interaction.reply({ content: "This workflow view expired.", ephemeral: true });
      return;
    }

    if (interaction.user.id !== session.userId) {
      await interaction.reply({ content: "This workflow view belongs to someone else.", ephemeral: true });
      return;
    }

    const commands = this._commandStore.getCommandsForGuild(session.guildId);
    if (interaction.isStringSelectMenu()) {
      session.commandName = interaction.values[0] ?? session.commandName;
      session.page = 0;
    } else if (interaction.customId === BUTTON_PREV) {
      session.page = Math.max(0, session.page - 1);
    } else if (interaction.customId === BUTTON_NEXT) {
      session.page = session.page + 1;
    }

    const command = this.getCommand(commands, session.commandName);
    const totalPages = this.getTotalPages(command);
    if (session.page > totalPages - 1) {
      session.page = Math.max(0, totalPages - 1);
    }

    session.updatedAt = Date.now();
    await interaction.update(this.buildView(session, commands, interaction.guild?.name));
  }

  private buildView(session: WorkflowSession, commands: StoredCommand[], guildName?: string | null) {
    if (commands.length === 0) {
      return {
        embeds: [
          new EmbedBuilder()
            .setTitle("Workflow Viewer")
            .setDescription("No dynamic commands found for this guild."),
        ],
        components: [],
      };
    }

    const command = this.getCommand(commands, session.commandName) ?? commands[0];
    const totalPages = this.getTotalPages(command);
    const page = Math.min(session.page, Math.max(0, totalPages - 1));

    const description = this.buildScreen({
      command,
      guildName,
      page,
      totalPages,
    });

    return {
      embeds: [new EmbedBuilder().setTitle("Workflow Viewer").setDescription(description)],
      components: this.buildComponents(command, page, totalPages, commands),
    };
  }

  private buildComponents(
    command: StoredCommand,
    page: number,
    totalPages: number,
    commands: StoredCommand[]
  ) {
    const prevButton = new ButtonBuilder()
      .setCustomId(BUTTON_PREV)
      .setLabel("Prev")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page <= 0);

    const nextButton = new ButtonBuilder()
      .setCustomId(BUTTON_NEXT)
      .setLabel("Next")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages - 1);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton);

    const commandOptions = commands.slice(0, 25).map(storedCommand => {
      return {
        label: storedCommand.name,
        value: storedCommand.name,
        description: storedCommand.description?.slice(0, 80),
        default: storedCommand.name === command.name,
      };
    });

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(SELECT_COMMAND)
      .setPlaceholder("Select command")
      .addOptions(commandOptions);

    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    return [actionRow, selectRow];
  }

  private buildScreen({
    command,
    guildName,
    page,
    totalPages,
  }: {
    command: StoredCommand;
    guildName?: string | null;
    page: number;
    totalPages: number;
  }) {
    const startIndex = page * ACTIONS_PER_PAGE;
    const endIndex = Math.min(command.actions.length, startIndex + ACTIONS_PER_PAGE);
    const actions = command.actions.slice(startIndex, endIndex);

    const actionCount = command.actions.length;
    const startNumber = actionCount === 0 ? 0 : startIndex + 1;
    const endNumber = actionCount === 0 ? 0 : endIndex;

    const lines = [
      "Butler Workflow Viewer",
      `Guild: ${guildName ?? "Unknown"}`,
      `Command: ${command.name}`,
      `Event: ${command.events.join(", ") || "-"}`,
      `Description: ${command.description || "-"}`,
      "",
      `Actions (${startNumber}-${endNumber} of ${actionCount})`,
    ];

    if (actions.length === 0) {
      lines.push("(No actions)");
    } else {
      actions.forEach((action, index) => {
        const argsText = action.args?.length ? action.args.join(", ") : "(none)";
        lines.push(`[${startIndex + index + 1}] ${action.name}`);
        lines.push(`    args: ${argsText}`);
      });
    }

    lines.push("");
    lines.push(`Page ${page + 1} of ${Math.max(1, totalPages)}`);

    return `\`\`\`\n${lines.join("\n")}\n\`\`\``;
  }

  private getCommand(commands: StoredCommand[], commandName: string | null) {
    if (!commandName) return undefined;
    return commands.find(command => command.name === commandName);
  }

  private getTotalPages(command?: StoredCommand) {
    if (!command) return 1;
    return Math.max(1, Math.ceil(command.actions.length / ACTIONS_PER_PAGE));
  }
}

export { WorkflowTui, WORKFLOW_COMMAND };

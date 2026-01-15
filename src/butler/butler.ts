import { Client, Guild, Message, VoiceState } from "discord.js";
import { AvailableEvents } from "./events";
import { AddCommandFromInstuctionCommand, ButlerCommand, JoinVoiceChannelCommand, ShowAvailableCommandsInTextChannelCommand } from "./commands";
import { BasePayload, MemberJoinVoiceChannelPayload, MemberSpeakPayload, MessageCreatePayload } from "./payloads";
import { AddCommandFromYamlCommand } from "./commands/statics/addCommandFromYaml";
import { MemberLeaveVoiceChannelPayload } from "./payloads/memberLeaveVoiceChannelPayload";
import { AudioPlayer, AudioPlayerStatus, AudioResource, NoSubscriberBehavior, VoiceConnection, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import { createSpeech } from "./audioCreator";
import { LeaveVoiceChannelCommand } from "./commands/statics/leaveVoiceChannel";
import { RemoveCommandCommand } from "./commands/statics/removeCommandCommand";
import { AvailableButlerAction, createButlerAction } from "./actions";
import { TemplateString, TemplateStringParser } from "./templates";
import { CommandStore } from "./storage/commandStore";

type StoredCommand = {
  name: string,
  events: AvailableEvents[],
  description: string,
  actions: {
    name: AvailableButlerAction,
    args: string[] | null
  }[]
}

class Butler {
  public client: Client
  public guildId: string
  public audioPlayer: AudioPlayer
  public voiceConnection: undefined | VoiceConnection
  private _staticCommands: ButlerCommand[]
  private _dynamicCommands: ButlerCommand[]
  private _parser: TemplateStringParser
  private _commandStore: CommandStore
  constructor(client: Client, guildId: string) {
    this.client = client
    this.guildId = guildId
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      }
    })
    this._staticCommands = [
      new JoinVoiceChannelCommand(),
      new LeaveVoiceChannelCommand(),
      new AddCommandFromYamlCommand(),
      new ShowAvailableCommandsInTextChannelCommand(),
      new RemoveCommandCommand(),
      new AddCommandFromInstuctionCommand()
    ]
    this._dynamicCommands = []
    this._attachEvents()
    this._parser = new TemplateStringParser(client)
    this._commandStore = new CommandStore()
    this.loadGuildCommands()

  }
  public async loadGuildCommands() {
    try {
      const commands = this._commandStore.getCommandsForGuild(this.guildId)
      for (let i = 0; i < commands.length; i++) {
        const c = commands[i]
        const command = new ButlerCommand(
          c.name,
          c.events,
          c.actions.map(a => createButlerAction(a.name, a.args || []))
        )
        this.addCommand(command)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async fire(event: AvailableEvents, payload: BasePayload) {
    for (let i = 0; i < this.numberOfCommands; i++) {
      const command = this.commands[i]
      if (command.targetEvents.includes(event)) {
        await command.run(this, payload)
      }
    }
  }

  public joinVoiceChannel(guild: Guild, channelId: string) {
    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false
    })
    this.voiceConnection = connection
    this.voiceConnection.subscribe(this.audioPlayer)
  }
  public leaveVoiceChannel() {
    if (this.voiceConnection?.disconnect()) {
      this.voiceConnection = undefined
    }
  }

  private _attachEvents() {
    this.client.on("messageCreate", (message) => {
      if (message.inGuild() && message.guildId !== this.guildId) return;
      if (message.author.id === this.client.user?.id!) return;
      const payload: MessageCreatePayload = {
        timestamp: new Date().getTime(),
        message: {
          id: message.id,
          content: message.content,
        },
        guildId: this.guildId,
        sourceMember: message.member!,
        textChannelId: message.channel.id,
      }
      this.fire(AvailableEvents.MemberSendTextMessage, payload)
    })

    this.client.on("voiceStateUpdate", (oldState, newState) => {
      if (newState.guild.id !== this.guildId) return;

      // if member join voice channel
      if (!oldState.channelId && newState.channelId) {
        const payload: MemberJoinVoiceChannelPayload = {
          timestamp: new Date().getTime(),
          guildId: this.guildId,
          sourceMember: (newState.member || oldState.member)!,
          voiceChannelId: newState.channelId,
        }
        this.fire(AvailableEvents.MemberJoinVoiceChannel, payload)
      }

      // if member leave voice channel
      if (oldState.channelId && !newState.channelId) {
        const payload: MemberLeaveVoiceChannelPayload = {
          timestamp: new Date().getTime(),
          guildId: this.guildId,
          sourceMember: (newState.member || oldState.member)!,
          voiceChannelId: oldState.channelId,
        }
        this.fire(AvailableEvents.MemberLeaveVoiceChannel, payload)
      }
    })
  }

  public get commands(): ButlerCommand[] {
    return [...this._staticCommands, ...this._dynamicCommands]
  }

  public addCommand(command: ButlerCommand): boolean {
    if (this.commands.find(c => c.name === command.name)) {
      return false
    }
    this._dynamicCommands.push(command)
    return true
  }

  public async uploadCommandFromYaml(yaml_template: string) {
    const commandTemplate: {
      name: string,
      targetEvents: AvailableEvents[],
      description: string,
      actions: {
        name: AvailableButlerAction,
        args: string[] | null
      }[]
    } = Bun.YAML.parse(yaml_template)
    const command: StoredCommand = {
      name: commandTemplate.name,
      description: commandTemplate.description,
      events: commandTemplate.targetEvents,
      actions: commandTemplate.actions.map(a => {
        return {
          name: a.name,
          args: a.args
        }
      })
    }
    this._commandStore.saveCommandForGuild(this.guildId, command)
  }

  public removeCommand(commandName: string): boolean {
    if (this._staticCommands.find(c => c.name === commandName)) {
      return false
    }
    const index = this._dynamicCommands.findIndex(c => c.name === commandName)
    if (index === -1) {
      return false
    }
    this._dynamicCommands.splice(index, 1)
    this._commandStore.removeCommandForGuild(this.guildId, commandName)
    return true
  }

  public get availableCommands(): string[] {
    return this.commands.map(command => command.name)
  }

  public playSound(audioResource: AudioResource) {
    this.audioPlayer.play(audioResource)
  }

  public async sendTextMessageToUser(userId: string, text: string) {
    const user = await this.client.users.fetch(userId)
    await user.send({ content: text })
  }

  public async sayText(text: string) {
    const audio = createSpeech(text)
    this.playSound(audio)
    const promise = new Promise<void>((resolve, reject) => {
      this.audioPlayer.once(AudioPlayerStatus.Idle, () => {
        resolve()
      })
    })
    return promise
  }

  public async parse(templateString: TemplateString, payload: BasePayload): Promise<string> {
    return await this._parser.parse(templateString, payload)
  }

  get numberOfCommands(): number {
    return this.commands.length
  }

  public async getMemberVoiceState(memberId: string): Promise<VoiceState | undefined> {
    const member = await this.client.guilds.cache.get(this.guildId)?.members.fetch(memberId)
    if (!member) return undefined
    return member.voice
  }
}

export { Butler }

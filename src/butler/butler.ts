import { Client, Guild, VoiceState } from "discord.js";
import { AvailableEvents } from "./events";
import { ButlerCommand, JoinVoiceChannelCommand, ShowAvailableCommandsInTextChannelCommand } from "./commands";
import { BasePayload, MemberJoinVoiceChannelPayload, MessageCreatePayload } from "./payloads";
import { AddCommandFromYamlCommand } from "./commands/statics/addCommandFromYaml";
import { MemberLeaveVoiceChannelPayload } from "./payloads/memberLeaveVoiceChannelPayload";
import { AudioPlayer, AudioPlayerStatus, AudioResource, NoSubscriberBehavior, VoiceConnection, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import { createSpeech } from "./audioCreator";
import { LeaveVoiceChannelCommand } from "./commands/statics/leaveVoiceChannel";
import { RemoveCommandCommand } from "./commands/statics/removeCommandCommand";
import { log } from "console";

class Butler {
  public client: Client
  public guildId: string
  public audioPlayer: AudioPlayer
  public voiceConnection: undefined | VoiceConnection
  private _staticCommands: ButlerCommand[]
  private _dynamicCommands: ButlerCommand[]
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
    ]
    this._dynamicCommands = []
    this._attachEvents()
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

  public removeCommand(commandName: string): boolean {
    if (this._staticCommands.find(c => c.name === commandName)) {
      return false
    }
    const index = this._dynamicCommands.findIndex(c => c.name === commandName)
    if (index === -1) {
      return false
    }
    this._dynamicCommands.splice(index, 1)
    return true
  }

  public get availableCommands(): string[] {
    return this.commands.map(command => command.name)
  }

  public playSound(audioResource: AudioResource) {
    this.audioPlayer.play(audioResource)
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

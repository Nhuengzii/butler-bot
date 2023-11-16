import { Client, Guild } from "discord.js";
import { AvailableEvents } from "./events";
import { ButlerCommand, JoinVoiceChannelCommand } from "./commands";
import { BasePayload, MemberJoinVoiceChannelPayload, MessageCreatePayload } from "./payloads";
import { AddCommandFromYamlCommand } from "./commands/statics/addCommandFromYaml";
import { MemberLeaveVoiceChannelPayload } from "./payloads/memberLeaveVoiceChannelPayload";
import { AudioPlayer, AudioPlayerStatus, AudioResource, NoSubscriberBehavior, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { createSpeech } from "./audioCreator";
import { LeaveVoiceChannelCommand } from "./commands/statics/leaveVoiceChannel";

class Butler {
  public client: Client
  public guildId: string
  public audioPlayer: AudioPlayer
  public voiceConnection: undefined | VoiceConnection
  private _commands: ButlerCommand[]
  constructor(client: Client, guildId: string) {
    this.client = client
    this.guildId = guildId
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      }
    })
    this._attachEvents()
    this._commands = [
      new JoinVoiceChannelCommand(),
      new LeaveVoiceChannelCommand(),
      new AddCommandFromYamlCommand()
    ]
  }
  public async fire(event: AvailableEvents, payload: BasePayload) {
    for (let i = 0; i < this.numberOfCommands; i++) {
      const command = this._commands[i]
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

  public addCommand(command: ButlerCommand): void {
    this._commands.push(command)
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
    return this._commands.length
  }
}

export { Butler }

import { Client, GatewayIntentBits } from 'discord.js'
import { Butler } from './butler'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
})

const butlers: Record<string, Butler> = {}

client.on('clientReady', () => {
  console.log('Bot is ready')
  client.guilds.cache.forEach(guild => {
    console.log(`Guild: ${guild.name}`);
    butlers[guild.id] = new Butler(client, guild.id)
  })
})

const TOEKN = process.env.TOKEN
client.login(TOEKN)

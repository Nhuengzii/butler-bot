import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { Butler } from './butler'
config()

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

client.on('ready', () => {
  console.log('Bot is ready')
  client.guilds.cache.forEach(guild => {
    butlers[guild.id] = new Butler(client, guild.id)
  })
})

const TOEKN = process.env.TOKEN
client.login(TOEKN)

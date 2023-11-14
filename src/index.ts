import { Client, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ]
})


client.on('ready', () => {
  console.log('Bot is ready')
})

const TOEKN = process.env.TOKEN
client.login(TOEKN)

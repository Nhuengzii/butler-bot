import { Client, GatewayIntentBits } from 'discord.js'
import { Butler } from './butler'
import { CommandStore } from './butler/storage/commandStore'
import { WorkflowTui } from './butler/ui/workflowTui'

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
const commandStore = new CommandStore()
const workflowTui = new WorkflowTui(client, commandStore)

client.on('messageCreate', async (message) => {
  await workflowTui.handleMessage(message)
})

client.once('clientReady', () => {
  console.log('Bot is ready')
  client.guilds.cache.forEach(guild => {
    console.log(`Guild: ${guild.name}`);
    if (butlers[guild.id]) return
    butlers[guild.id] = new Butler(client, guild.id)
  })
})

client.on('guildCreate', guild => {
  if (butlers[guild.id]) return
  butlers[guild.id] = new Butler(client, guild.id)
})

const TOEKN = process.env.TOKEN
client.login(TOEKN)

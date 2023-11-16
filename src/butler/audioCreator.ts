import { createAudioResource } from "@discordjs/voice"

const Gtts = require('gtts')

function createSpeech(text: string) {
  let speech = new Gtts(text, "th")
  let audioResource = createAudioResource(speech.stream(), {
    inputType: speech.type,
    inlineVolume: true
  })
  return audioResource;
}

export { createSpeech }

require('dotenv').config()

const [exec, file, MODE] = process.argv
const allowedModes = ["bot", "auth", "debug", "check-ip"]
if(MODE && !allowedModes.includes(MODE)) throw new Error("Selected mode is not handled yet: "+MODE)
const mode = MODE || 'bot'

const Bot = require('./utils/Bot.class')
const bot = new Bot({
    mode
})

bot.start()
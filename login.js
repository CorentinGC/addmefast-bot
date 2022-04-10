require('dotenv').config()

const Bot = require('./utils/Bot.class')

const opts = {
    mode: "auth",
    incognito: false
}

const bot = new Bot(opts)

const startBot = () => {
    try {
        bot.start()
    } catch(e){
        console.log('ERREUR: ', e)
        // startBot()
    }
    
}

startBot()
// console.log(bot.randStrategy())
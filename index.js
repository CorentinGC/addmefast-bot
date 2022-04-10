require('dotenv').config()

const Bot = require('./utils/Bot.class')
const opts = {
    AMF_EMAIL: process.env.AMF_EMAIL,
    AMF_PASSWORD: process.env.AMF_PASSWORD,
    mode: "bot"
    // onlyStrat: ['ScLikes'],
    // disabledStrat: ['ScLikes']
}
const bot = new Bot(opts)

const startBot = () => {
    try {
        bot.start({debug:false})
    } catch(e){
        console.log('ERREUR: ', e)
    }
    
}

startBot()
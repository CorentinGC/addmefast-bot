const CREDENTIALS = require('./credentials').socials

const Bot = require('./utils/Bot.class')

const opts = {
    loginMode: true,
    // onlyStrat: ['ScLikes'],
    // disabledStrat: ['ScLikes']
}

console.log(CREDENTIALS)
const bot = new Bot(opts)

const startBot = () => {
    try {
        bot.start('facebook', CREDENTIALS)
    } catch(e){
        console.log('ERREUR: ', e)
        // startBot()
    }
    
}

startBot()
// console.log(bot.randStrategy())
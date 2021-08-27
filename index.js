

const CREDENTIALS = require('./credentials').amf

const Bot = require('./utils/Bot.class')
const opts = {
    AMF_EMAIL: CREDENTIALS.email,
    AMF_PASSWORD: CREDENTIALS.password,
    onlyStrat: [
        'FbPostLike', 
        'FbLikePage', 
        'ScLikes', 
        'ScFollow', 
        'YtLikes',
        'YtViews'

    ]

    // onlyStrat: ['ScLikes'],
    // disabledStrat: ['ScLikes']
}
const bot = new Bot(opts)


const startBot = () => {
    try {
        bot.start({debug:false})
    } catch(e){
        console.log('ERREUR: ', e)
        // startBot()
    }
    
}

startBot()
// console.log(bot.randStrategy())
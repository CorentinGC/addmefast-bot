// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

// TODO: Actually detected as bot once user-agent changed
// const UserAgent = require("user-agents")
// const {userAgent} = new UserAgent({deviceCategory: 'desktop'});
// const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36';
// const UA = USER_AGENT;

const Strategies = require('../strategies')

class Bot {
    constructor(OPTS=null){
        this.mode = OPTS?.mode || 'auth'
        this.started = false
        this.incognito = OPTS?.incognito || false
        this.idle = false

        if(this.mode === "bot"){
            if(!OPTS?.AMF_EMAIL || !OPTS?.AMF_PASSWORD) throw new Error('You should set your AddMeFast credentials first')
            this.AMF_EMAIL = OPTS.AMF_EMAIL
            this.AMF_PASSWORD = OPTS.AMF_PASSWORD
    
            this.onlyStrat = JSON.parse(process.env.ONLY_STRATEGIES) || null
            this.disabledStrat = OPTS?.disabledStrat || null
    
            if(this.onlyStrat && this.disabledStrat){
                this.onlyStrat.forEach(e => {
                    if(this.disabledStrat.includes(e)) throw new Error('You  have a disabledStrat element which is also present in onlyStrat opt')
                })
            }
   
            // this.totalPts = 0
            this.currentStrategy = null
            this.popupTab = null
        }

        this.puppeteer = puppeteer
        this.puppeteer.use(StealthPlugin())
        this.puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

    }
    randStrategy = () => {
        let arrStrategies = []
        for(let strategy in Strategies){
            arrStrategies.push(strategy)
        }
    
        let newStrat = arrStrategies[Math.floor(Math.random() * arrStrategies.length)]

        let onlyStrat = this.onlyStrat !== null && !this.onlyStrat.includes(newStrat)
        let disabledStrat = this.disabledStrat !== null && this.disabledStrat.includes(newStrat)
        let sameStrat = newStrat === this.currentStrategy

        if(onlyStrat || disabledStrat || sameStrat) return this.randStrategy(Strategies)

        this.currentStrategy = newStrat
        return newStrat

    }
    start = async (...opts) => {
        this.started = true
        this.idle = new Date()
        try { 
            let args = { 
                userDataDir: "./addmefast",
                headless: false,
                args: [
                    '--enable-features=NetworkService', 
                    '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--disable-dev-shm-usage',
                    '--flag-switches-begin',
                    '--disable-site-isolation-trials',
                    '--flag-switches-end'
                ],
                ignoreHTTPSErrors: true, 
                dumpio: false
            }
            if(this.incognito) args.args.push("--incognito")
            if(this.proxy) args.args.push(`--proxy-server=${PROXY_HOST}:${PROXY_PORT}`)
            let browser = await this.puppeteer.launch(args)

            browser.on('disconnected', (err) => {
                console.log(err)
                this._log('Browser has disconnected.')
                process.exit(0)
            })
            
            const [page] = await browser.pages()
            await page.setViewport({
                width: 1920 + Math.floor(Math.random() * 100),
                height: 3000 + Math.floor(Math.random() * 100),
                deviceScaleFactor: 1,
                hasTouch: false,
                isLandscape: false,
                isMobile: false,
            })
            // await page.setUserAgent(UA);
            await page.setJavaScriptEnabled(true);
            
            await page.setDefaultTimeout(10000)
            
            switch(this.mode){
                case 'bot':
                    setInterval(() => {
                        this._log('Check antibot...')
                        this.checkReloadBtn()
                    }, 10_000)

                    setInterval(() => {
                        this._log("Check inactivity...")
                        if((new Date() - this.idle) > 60_000) {
                            this._log("Too much inactivity (120s), restarting process")
                            process.exit()
                        }
                    }, 120_000)

                    this._log('Mode: AddMeFast Bot')
                    await this.signInAddMeFast(page)
                    await this.loop(page, browser)
                break

                case 'auth':
                    this._log('Mode: Auth Socials')
                    await this.authSocials(page, opts)
                break

                case 'debug':
                    this._log('Mode: Debug')
                    await this.debugMode(page, opts)
                break
            }
        } catch(e) {
            console.log(e)
            this._log('Browser has crashed :/')
            process.exit(0)
        }    
        

    }
    signInAddMeFast = async (page) => {
        this._log('GoTo Addmefast website')
        await page.goto('https://addmefast.com', {
            waitUntil: 'networkidle2',
        })
        this._log('Wait 5sec for cloudflare')
        await page.waitForTimeout(5_000) //cloudflare
        // await page.waitForSelector('.email')
    
        try {
            // Auth ADDMEFAST
            await page.type(".email", this.AMF_EMAIL, {delay: 25})
            await page.type(".password", this.AMF_PASSWORD, {delay: 25})
            await page.waitForTimeout(250)
            await page.click("[name='login_button']")
            this._log("Sign In to AddMeFast")
        } catch(err) {
            this._log("Probably already logged")
        }


    }
    isActionEmpty = async (page) => {
        const POINTS = /get ([0-9]+) points/i

        try {
            const element = await page.waitForSelector('.likedPagesSingle > center > b')
            const value = await page.evaluate(el => el.textContent, element)
            const state = value.match(POINTS)
    
            return state === null
        } catch (e) {
            return true
        }

    }
    clickAMFBtn = async (page, browser) => {
        this._log('Clicking AMF button')

        try {
            await page.click('a.single_like_button.btn3-wrap', {delay: 3000})
            await popup.evaluate(() =>document.querySelector('a.single_like_button.btn3-wrap').click())
        } catch (e){
            this._log('AMF button #1 not found')
        }
    }
    getPopup = async (browser) => {
        try {
            const pages = await browser.pages()
            const popup = pages[pages.length - 1]
            popup.setDefaultTimeout(5000)
    
            return popup
        } catch (e){
            this._log('Error: no popup found')
        }
  
    }
    closePopup = async (popup) => {
        try {
            await popup.close()
            this._log('Popup closed')
        } catch(e){
            this._log('Error closing popup !')
        }

    } 
    loop = async (page, browser) => {
        this.idle = new Date()
        this._log('Starting loop & go to action page')

        const newStratKey = this.randStrategy()
        this._log('Strategy: '+ newStratKey)

        const newStrat = Strategies[newStratKey]
        try {
            await page.goto(newStrat.url, {
                waitUntil: 'networkidle2'
            })
        } catch (err) {
            console.log('CODE', err.message)
            this._log('Error while loading strategy AMF page')
            process.exit(0)
            this.started = false
        }

        this._log('Checking if there is work')
        const isEmpty = await this.isActionEmpty(page)
        if(isEmpty) {
            this._log('No more points for this action :/')
            return this.loop(page, browser)
        } else this._log('Work found, starting loop')

        await this.clickAMFBtn(page, browser)
        this._log('Waiting 10s for popup loading')
        await page.waitForTimeout(10_000)

        const popup = await this.getPopup(browser)

        try {
            await newStrat.callback(popup, this, page)
        } catch(e){
            this._log('Error while executing callback.')
        }    

        this._log('Callback executed, waiting 5s before closing popup')
        await page.waitForTimeout(5_000)

        await this.closePopup(popup)
        this.idle = new Date()

        if(newStrat?.opts?.confirm_after_close === true) this.clickAMFBtn(page, browser)

        // await this.addPoints(page)

        this._log('Loop ended, waiting 10sec')
        await page.waitForTimeout(10_000)
        this.loop(page, browser)
    }
    checkReloadBtn = async (page) => {
        try {
            await page.evaluate(() => {
                const btn = document.querySelector(".reload-button")
                if(btn) {
                    btn.click()
                    this._log('Reload Btn clicked !')
                }
            })
        } catch(e){
            this._log('No antibot detected')
        }
    }
    // addPoints = async (page) => {
    //     page.setDefaultTimeout(10_000)
    //     let promises = [
    //         page.waitForSelector('.success_like'),
    //         page.waitForSelector('.error_like')
    //     ]

    //     let result = await racePromises(promises)
    //     page.setDefaultTimeout(5_000)

    //     if(result === 0){
    //         const element = await page.$('.success_like')
    //         const value = await page.evaluate(el => el.textContent, element)

    //         const POINTS = /([0-9]+) points/i
    //         const points = value.match(POINTS)
            
    //         this.totalPts += parseInt(points[1])
    //         this._log('Loop done ! +'+points[1]+'pts - Total: '+this.totalPts+'pts')
    //     }
    //     else {
    //         this._log('Error ! No points added :/')
    //     }

    // }
    authSocials = async (page, opts) => {
        // #"FbLikePage","FbPostLike","ScLikes","ScFollow","YtLikes","YtViews"

        const providers = [
            {provider: "facebook", strategies: ["FbLikePage", "FbPostLike"], url: "https://www.facebook.com/?sk=lf"},
            {provider: "gmail", strategies: ["YtLikes", "YtViews"], url: "https://accounts.google.com/"},
            {provider: "soundcloud", strategies: ["ScLikes", "ScFollow"], url: ""},
            {provider: "reddit", strategies: ["RedditUpvote"], url: "https://www.reddit.com/login/"}
        ]
        const enabled = JSON.parse(process.env.ONLY_STRATEGIES)
        const needAuth = {
            facebook: false,
            gmail: false,
            reddit: false,
            soundcloud: false
        }
        for(let strategy of enabled) {
            const {provider} = providers.find(e => e.strategies.includes(strategy)) || {provider: false, url: false}
            if(!provider) continue
            needAuth[provider] = true
        }


        for(let provider in needAuth) {
            if(needAuth[provider] === false) continue

            this._log("Auth for:"+provider)
            const {url} = providers.find(e => e.provider === provider)
            await page.goto(url, {
                waitUntil: 'networkidle2',
            })
            
            switch(provider){
                case "facebook":
                    try {
                        await page.waitForSelector("#ssrb_top_nav_start", {delay: 1_000})
                        this._log('Already logged')
                        continue
                    } catch (e) { 
                        console.log('error already logged', e)
                    }

                    try { 
                        await page.click("button[data-cookiebanner='accept_button']")
                    } catch {
                        this._log("Cookie banner not found, continue")
                    }

                    await page.type('#email', process.env.FACEBOOK_EMAIL, {delay: 25})
                    await page.type('#pass', process.env.FACEBOOK_PASSWORD, {delay: 25})

                    await page.click("button[name='login']")
                    await page.waitForTimeout(10_000)
                break

                case "gmail":
                    try {
                        await page.waitForSelector("a[href*='https://accounts.google.com/SignOutOptions?'", {delay: 1_000})
                        this._log("Already logged")
                        continue
                    } catch (e) { 
                        console.log('error already logged', e)
                    }
                    await page.waitForTimeout(500)

                    try {
                        await page.click(`div[data-identifier='${process.env.GMAIL_EMAIL}']`, {delay: 1_000})
                        this._log("Prelogged")
                        await page.waitForTimeout(3_000)

                        await page.type("input[type='password'", process.env.GMAIL_PASSWORD, {delay: 25})
                        await page.click("#passwordNext")
                        await page.waitForTimeout(3_000)
                        continue
                    } catch(e) {
                        console.log('error prelogged', e)
                     }


                    this._log('Not logged')

                    await page.type("input[type='email'", process.env.GMAIL_EMAIL, {delay: 25})
                    await page.click("#identifierNext")
                    await page.waitForTimeout(3_000)

                    await page.type("input[type='password'", process.env.GMAIL_PASSWORD, {delay: 25})
                    await page.click("#passwordNext")
                    await page.waitForTimeout(3_000)
                break

                case "reddit":
                    // try {
                    //     await page.waitForSelector("#ssrb_top_nav_start", {delay: 1000})
                    //     this._log('Already logged')
                    //     continue
                    // } catch (e) { 
                    //     console.log('error already logged', e)
                    // }

                    await page.type('#loginUsername', process.env.REDDIT_USER, {delay: 25})
                    await page.type('#loginPassword', process.env.REDDIT_PASSWORD, {delay: 25})

                    await page.click("button[type='submit']")
                    await page.waitForTimeout(10_000)
                break
            }


            
        }
        // process.exit(0)
    }
    debugMode = async (page, opts) => {
        await page.goto('https://www.youtube.com/watch?v=WGIJLXUKI5U', {
            ignoreDefaultArgs: ['--no-sandbox'],
            waitUntil: 'networkidle2',
        })
        await page.waitForTimeout(2_500)


        // let select = await page.waitForSelector(ELEMENT)
        await page.evaluate(() => {
            const ELEMENT = "ytd-toggle-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-text button#button > yt-icon" // Like video

            document.querySelectorAll(ELEMENT)[2].click()
        })
    
        // Auth ADDMEFAST
        // await page.type('.email', this.AMF_EMAIL, {delay: 50})
        // await page.type('.password', this.AMF_PASSWORD, {delay: 50})
        // await page.waitForTimeout(250)
        // await page.click('[name="login_button"]')
    }
    waitAndClick = async (selector, page) => {
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);
    }

    _log = (message, category=null) => {
        let time = new Date()
        let hours = ('0' + time.getHours()).slice(-2)
        let minutes = ('0' + time.getMinutes()).slice(-2)
        let secondes =('0' + time.getSeconds()).slice(-2)
        let text_time = `${hours}:${minutes}:${secondes}`
    
        let category_text = category !== null ? ` - [${category.toUpperCase()}]` : ''
        console.log(`[${text_time}]${category_text} - ${message}`)
    }
}

//https://stackoverflow.com/a/64308824
async function racePromises(promises) {
    const indexedPromises = promises.map((promise, index) => new Promise((resolve) => promise.then(() => resolve(index)).catch(e => null)))
    return Promise.race(indexedPromises)
}


module.exports = Bot
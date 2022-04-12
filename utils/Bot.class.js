const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker")
const tor_control = require("tor-control-promise")
const { getRandomProxy } = require('./')
// TODO: Actually detected as bot once user-agent changed
// const UserAgent = require("user-agents")
// const {userAgent} = new UserAgent({deviceCategory: 'desktop'});
// const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36';
// const UA = USER_AGENT;

const Strategies = require("../strategies")
const AMF_URL = "https://addmefast.com"
const CLOUDFLARE_TIMEOUT = process.env?.CLOUDFLARE_TIMEOUT || 15

let consecutive = {}
class Bot {
    constructor(OPTS=null){
        this.mode = OPTS?.mode || "auth"
        this.incognito = OPTS?.incognito || false
        this.idle = false
        this.proxy = false
        this.maxInactivity = process.env.MAX_INACTIVITY || 60
        this.strategies = JSON.parse(process.env.STRATEGIES) || null
        this.currentStrategy = null

        if((process.env?.PROXY_HOST && process.env?.PROXY_PORT) ) {
            this.proxy = "http://"+process.env.PROXY_HOST+":"+process.env.PROXY_PORT
            if(process.env?.PROXY_PROTOCOL) this.proxy = this.proxy.replace("http", process.env?.PROXY_PROTOCOL)
            console.log(this.proxy)
        }

        if(!process.env?.AMF_EMAIL || !process.env?.AMF_PASSWORD) throw new Error("You should set your AddMeFast credentials first")
    
        console.table({
            mode: this.mode,
            proxy: this.proxy,
            strategies: this.strategies.join(", "),
            maxInactivity: this.maxInactivity
        })
        this.puppeteer = puppeteer
        this.puppeteer.use(StealthPlugin())
        this.puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
    }
    setupTor = async () => {
        if(String(process.env?.PROXY_TOR) === "true") {
            this.tor = new tor_control({
                host: process.env.PROXY_HOST,
                port: process.env.PROXY_PORT,
                password: process.env.TOR_PASSWORD,
            })
            
            await this.tor.connect()
        }
    }
    getStrategy = () => {
        let arrStrategies = []
        for(let strategy in Strategies){
            arrStrategies.push(strategy)
        }
    
        let stratKey = arrStrategies[Math.floor(Math.random() * arrStrategies.length)]

        let enabled = this.strategies !== null && !this.strategies.includes(stratKey)
        let sameStrat = stratKey === this.currentStrategy

        if(enabled || sameStrat) return this.getStrategy()

        let strategy = Strategies[stratKey]
        let needPause = strategy.opts?.maxConsecutive && consecutive[stratKey] >= strategy.opts?.maxConsecutive

        if(needPause) {
            if("lastAction" in Strategies[stratKey].opts) {
                if(Strategies[stratKey].opts.lastAction >= Strategies[stratKey].opts.pauseDuration) {
                    delete Strategies[stratKey].opts.lastAction
                } else return this.getStrategy()
            } else {
                Strategies[stratKey].opts.lastAction = new Date()
                return this.getStrategy()
            }
        }

        if(consecutive[stratKey]) consecutive[stratKey]++
        else consecutive[stratKey] = 1

        this.currentStrategy = stratKey
        return {
            key: stratKey,
            strategy
        }
    }
    start = async (...config) => {
        this.setupTor()
        if (String(process.env?.RANDOM_PROXY) === "true") {
            const proxy = await getRandomProxy()
            this.proxy = proxy.type+"://"+proxy.ipPort
        }

        console.log(this.proxy)
        this.idle = new Date()
        try { 
            const opts = { 
                userDataDir: "./addmefast",
                headless: false,
                args: [
                    "--enable-features=NetworkService", 
                    "--no-sandbox", 
                    "--disable-setuid-sandbox", 
                    "--disable-dev-shm-usage",
                    "--flag-switches-begin",
                    "--disable-site-isolation-trials",
                    "--flag-switches-end"
                ],
                ignoreHTTPSErrors: true, 
                dumpio: false
            }
            if(this.incognito) opts.args.push("--incognito")
            if(this.proxy) opts.args.push(`--proxy-server=${this.proxy}`)

            // If it's Tor node, renew IP
            if(String(process.env?.PROXY_TOR) === "true") {
                try {
                    await this.tor.signalNewnym()
                    console.log("renewed")
                } catch(err) {
                    console.log("Tor renew ip failed")
                }
            }

            const browser = await this.puppeteer.launch(opts)
            browser.on("disconnected", (err) => {
                console.log(err)
                this._log("Browser has disconnected.")
                process.exit(0)
            })
            

            // await page.setDefaultTimeout(30_000)

                
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
            await page.setJavaScriptEnabled(true)

            if(process.env?.PROXY_USER && process.env?.PROXY_PASSWORD) {
                console.log("authenticate")
                await page.authenticate({ 
                    username: process.env?.PROXY_USER, 
                    password: process.env?.PROXY_PASSWORD 
                });
            }
            switch(this.mode){
                case "bot":
                    setInterval(() => {
                        this._log("Check antibot...")
                        this.checkReloadBtn()
                    }, 10_000)

                    setInterval(() => {
                        this._log("Check inactivity...")
                        if((new Date() - this.idle) > this.maxInactivity*1000) {
                            this._log(`Too much inactivity (${this.maxInactivity}s), restarting process`)
                            process.exit()
                        }
                    }, 120_000)

                    await this.signInAddMeFast(page)
                    await this.loop(page, browser, config)
                break

                case "auth":
                default:
                    await this.authSocials(page, config)
                break

                case "debug":
                    await this.debugMode(page, config)
                break

                case "check-ip":             
                    await page.goto("https://whatismyipaddress.com/fr/mon-ip")
                break
            }
        } catch(e) {
            console.log(e)
            this._log("Browser has crashed :/")
            process.exit(0)
        }    
        

    }
    signInAddMeFast = async (page) => {
        this._log("GoTo Addmefast website")
        await page.goto(AMF_URL, {
            waitUntil: "networkidle2",
        })
        
        this._log(`Wait ${CLOUDFLARE_TIMEOUT}sec for cloudflare`)
        await page.waitForTimeout(CLOUDFLARE_TIMEOUT*1000)

        // Auth AddMeFast
        try {
            await page.type(".email", process.env.AMF_EMAIL, {delay: 25}, {timeout: 2000})
            await page.type(".password", process.env.AMF_PASSWORD, {delay: 25})
            await page.waitForTimeout(250)
            await page.click("[name='login_button']")
            this._log("Sign In to AddMeFast")
            await page.waitForNavigation({waitUntil: "networkidle2"})
        } catch(err) {
            this._log("Probably already logged, checking")
                                
            // Check AddMeFast auth
            try {
                await page.waitForSelector("a[href*='/login/logout']", {timeout: 1_000})
                this._log("Account logged")

            } catch (err) {
                this._log("Error, not logged, retrying auth")
                return this.signInAddMeFast(page)
            }

        }

    }
    isActionEmpty = async (page) => {
        const POINTS = /get ([0-9]+) points/i

        try {
            const element = await page.waitForSelector(".likedPagesSingle > center > b", {timeout: 2000})
            const value = await page.evaluate(el => el.textContent, element)
            const state = value.match(POINTS)
    
            return state === null
        } catch (e) {
            return true
        }

    }
    clickAMFBtn = async (page, browser) => {
        this._log("Clicking AMF button")

        try {
            await page.click("a.single_like_button.btn3-wrap")
            await popup.evaluate(() =>document.querySelector("a.single_like_button.btn3-wrap").click())
        } catch (e){
            this._log("AMF button #1 not found")
        }
    }
    getPopup = async (browser) => {
        try {
            const pages = await browser.pages()
            const popup = pages[pages.length - 1]    
            return popup
        } catch (e){
            this._log("Error: no popup found")
        }
  
    }
    closePopup = async (popup) => {
        try {
            await popup.close()
            this._log("Popup closed")
        } catch(e){
            this._log("Error closing popup !")
        }

    } 
    loop = async (page, browser, config) => {
        
        this.idle = new Date()
        this._log("Starting loop & go to action page")

        const {key, strategy} = this.getStrategy()
        this._log("Strategy: "+ key)

        try {
            await page.goto(strategy.url, {
                waitUntil: "networkidle2"
            })
        } catch (err) {
            console.log("Error:", err.message)
            this._log("Error while loading strategy AMF page")
            process.exit(0)
        }

        this._log("Checking if there is work")
        const isEmpty = await this.isActionEmpty(page)
        if(isEmpty) {
            this._log("No more points for this action :/")
            return this.loop(page, browser)
        } else this._log("Work found, starting loop")

        await this.clickAMFBtn(page, browser)

        this._log("Waiting 10s for popup loading")
        await page.waitForTimeout(10_000)

        const popup = await this.getPopup(browser)

        try {
            await strategy.callback(popup, this, page)
        } catch(e){
            this._log("Error while executing callback.")
        }    

        this._log("Callback executed, waiting 10s before closing popup")
        await page.waitForTimeout(10_000)

        await this.closePopup(popup)
        this.idle = new Date()

        if(strategy?.opts?.confirm_after_close) this.clickAMFBtn(page, browser)

        this._log("Loop ended, waiting 10sec")
        await page.waitForTimeout(10_000)
        this.loop(page, browser)
    }
    checkReloadBtn = async (page) => {
        try {
            await page.evaluate(() => {
                const btn = document.querySelector(".reload-button")
                if(btn) {
                    btn.click()
                    this._log("Reload Btn clicked !")
                }
            })
        } catch(e){
            this._log("No antibot detected")
        }
    }
    authSocials = async (page, config) => {
        const enabled = JSON.parse(process.env.STRATEGIES)
        const needAuth = {
            facebook: false,
            gmail: false,
            reddit: false,
            soundcloud: false,
            twitter: false
        }
        for(let strategy of enabled) {
            const {provider} = Strategies.providers.find(e => e.strategies.includes(strategy)) || {provider: false, url: false}
            if(!provider) continue
            needAuth[provider] = true
        }


        for(let provider in needAuth) {
            if(needAuth[provider] === false) continue

            this._log("Auth for:"+provider)
            const {url} = Strategies.providers.find(e => e.provider === provider)
            await page.goto(url, {
                waitUntil: "networkidle2",
            })
            
            switch(provider){
                case "facebook":
                    try {
                        await page.waitForSelector("#ssrb_top_nav_start", {delay: 1_000})
                        this._log("Already logged")
                        continue
                    } catch (e) { 
                        console.log("error already logged", e)
                    }

                    try { 
                        await page.click("button[data-cookiebanner='accept_button']")
                    } catch {
                        this._log("Cookie banner not found, continue")
                    }

                    await page.type("#email", process.env.FACEBOOK_EMAIL, {delay: 25})
                    await page.type("#pass", process.env.FACEBOOK_PASSWORD, {delay: 25})

                    await page.click("button[name='login']")
                    await page.waitForTimeout(10_000)
                break

                case "gmail":
                    try {
                        await page.waitForSelector("a[href*='https://accounts.google.com/SignOutOptions?'", {delay: 1_000})
                        this._log("Already logged")
                        continue
                    } catch (e) { 
                        console.log("error already logged", e)
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
                        this._log("Not pre logged")

                        await page.type("input[type='email'", process.env.GMAIL_EMAIL, {delay: 25})
                        await page.click("#identifierNext")
                        await page.waitForTimeout(3_000)
    
                        await page.type("input[type='password'", process.env.GMAIL_PASSWORD, {delay: 25})
                        await page.click("#passwordNext")
                        await page.waitForTimeout(3_000)
                    }
                break

                case "reddit":
                    // try {
                    //     await page.waitForSelector("#ssrb_top_nav_start", {delay: 1000})
                    //     this._log('Already logged')
                    //     continue
                    // } catch (e) { 
                    //     console.log('error already logged', e)
                    // }

                    await page.type("#loginUsername", process.env.REDDIT_USER, {delay: 25})
                    await page.type("#loginPassword", process.env.REDDIT_PASSWORD, {delay: 25})

                    await page.click("button[type='submit']")
                    await page.waitForTimeout(10_000)
                break
            }            
        }
        process.exit(0)
    }
    debugMode = async (page, opts) => {
        await page.goto(AMF_URL, {waitUntil: "networkidle2"})
    }
    waitAndClick = async (selector, page) => page.evaluate((selector) => document.querySelector(selector).click(), selector)

    _log = (message, category=null) => {
        let time = new Date()
        let hours = ("0" + time.getHours()).slice(-2)
        let minutes = ("0" + time.getMinutes()).slice(-2)
        let secondes =("0" + time.getSeconds()).slice(-2)
        let text_time = `${hours}:${minutes}:${secondes}`
    
        let category_text = category !== null ? ` - [${category.toUpperCase()}]` : ""
        console.log(`[${text_time}]${category_text} - ${message}`)
    }
}

//https://stackoverflow.com/a/64308824
async function racePromises(promises) {
    const indexedPromises = promises.map((promise, index) => new Promise((resolve) => promise.then(() => resolve(index)).catch(e => null)))
    return Promise.race(indexedPromises)
}


module.exports = Bot
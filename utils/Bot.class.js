// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const Strategies = require('../strategies')

class Bot {
    constructor(OPTS=null){
        this.loginMode = OPTS?.loginMode || false

        if(!this.loginMode){
            if(!OPTS?.AMF_EMAIL || !OPTS?.AMF_PASSWORD) throw new Error('You should set your AddMeFast credentials first')
            this.AMF_EMAIL = OPTS.AMF_EMAIL
            this.AMF_PASSWORD = OPTS.AMF_PASSWORD
    
            this.onlyStrat = OPTS?.onlyStrat || null
            this.disabledStrat = OPTS?.disabledStrat || null
    
            if(this.onlyStrat && this.disabledStrat){
                this.onlyStrat.forEach(e => {
                    if(this.disabledStrat.includes(e)) throw new Error('You  have a disabledStrat element which is also present in onlyStrat opt')
                })
            }

                        
            this.totalPts = 0
            // this.mainTab = null
            this.currentStrategy = null
            this.popupTab = null
        }


        this.puppeteer = puppeteer
        // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
        this.puppeteer.use(StealthPlugin())
        // Add adblocker plugin to block all ads and trackers (saves bandwidth)
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
    start = (...opts) => {
        this.puppeteer.launch({ 
            userDataDir: "./addmefast",
            headless: false 
        })
        .then(async (browser) => {
            const [page] = await browser.pages()
            await page.setViewport({ width: 1024, height: 768 })

            // this.mainTab = page.mainFrame()._id
            page.setDefaultTimeout(5000)
            
            // Script
            if(!this.loginMode) {
                await this.signInAddMeFast(page)
                await this.loop(page, browser)
            } else {
                await this.authSocials(page, opts)
            }
        
        })
        .catch(e => {
            this._log('Browser has been closed or crashed :/')
            console.log(e)
        })          
    }
    signInAddMeFast = async (page) => {
        this._log('GoTo Addmefast website')
        await page.goto('https://addmefast.com', {
            ignoreDefaultArgs: ['--no-sandbox'],
            waitUntil: 'networkidle2',
        })
        this._log('Wait 5sec for cloudflare')
        await page.waitForTimeout(5000) //cloudflare
        // await page.waitForSelector('.email')
    
        // Auth ADDMEFAST
        await page.type('.email', this.AMF_EMAIL, {delay: 50})
        await page.type('.password', this.AMF_PASSWORD, {delay: 50})
        await page.waitForTimeout(250)
        await page.click('[name="login_button"]')
        this._log('Sign In to AddMeFast')

    }
    isActionEmpty = async (page) => {
        const POINTS = /You will get ([0-9]+) points/i

        const element = await page.waitForSelector('.fs18')
        const value = await page.evaluate(el => el.textContent, element)
        const state = value.match(POINTS)

        return state === null
    }
    clickAMFBtn = async (page) => {
        this._log('Clicking AMF button')

        await page.waitForSelector("a.single_like_button.btn3-wrap")
        await page.click('a.single_like_button.btn3-wrap')
    }
    getPopup = async (browser) => {
        const pages = await browser.pages()
        const popup = pages[pages.length - 1]
        popup.setDefaultTimeout(5000)

        return popup
    }
    closePopup = async (popup) => {
        await popup.close()
        this._log('Popup closed')
    } 
    loop = async (page, browser) => {
        this._log('Starting loop & go to action page')

        const newStratKey = this.randStrategy()
        this._log('Strategy: '+ newStratKey)

        const newStrat = Strategies[newStratKey]
        try {
            await page.goto(newStrat.url, {
                waitUntil: 'networkidle2'
            })
        } catch {
            await browser.close()
            this.start()
        }


        // Check antibot
        // await popup.waitForSelector('input.reload-button')
        try {
            //document.querySelector('[name="reload"]').click()
            await page.evaluate(() =>  document.querySelector('.reload-button').click())
        } catch(e){
            this._log('No antibot detected')
        }
        

        this._log('Checking if there is work')

        const isEmpty = await this.isActionEmpty(page)

        if(isEmpty) {
            this._log('No more points for this action :/')
            return this.loop(page, browser)
        } else {
            this._log('Work found, starting loop')
        }

        
        await this.clickAMFBtn(page)
        this._log('Waiting 10s for popup loading')
        await page.waitForTimeout(10000)

        const popup = await this.getPopup(browser)

        try {
            await newStrat.callback(popup, this)
        } catch(e){
            this._log('Button not found :/')
            console.log(e)
        }    

        this._log('Callback executed, waiting 10s before closing popup')
        await page.waitForTimeout(10000)

        await this.closePopup(popup)

        if(newStrat?.opts?.confirm_after_close === true){
            this.clickAMFBtn(page)
        }

        await this.addPoints(page, browser, this.loop)
        
        this._log('Loop ended, waiting 5sec')
        await page.waitForTimeout(5000)

        this.loop(page, browser)
    }
    addPoints = async (page) => {
        page.setDefaultTimeout(10000)
        let promises = [
            page.waitForSelector('.success_like'),
            page.waitForSelector('.error_like')
        ]

        let result = await racePromises(promises)
        page.setDefaultTimeout(5000)

        if(result === 0){
            const element = await page.$('.success_like')
            const value = await page.evaluate(el => el.textContent, element)

            const POINTS = /([0-9]+) points/i
            const points = value.match(POINTS)
            
            this.totalPts += parseInt(points[1])
            this._log('Loop done ! +'+points[1]+'pts - Total: '+this.totalPts+'pts')
        }
        else {
            this._log('Error ! No points added :/')
        }

    }
    authSocials = async (page, opts) => {
        const elements = opts[1][opts[0]]
        if(elements){
            await page.goto(elements.url, {
                waitUntil: 'networkidle2',
            })
            await page.waitForTimeout(1000)

            try {
                await page.type('#email', elements.accounts[0].email, {delay: 50})
                await page.type('#pass', elements.accounts[0].password, {delay: 50})

                await page.waitForTimeout(250)
                await page.click('button[name="login"]')
                await page.waitForTimeout(2000)

                try {
                    await page.waitForSelector("#ssrb_top_nav_start")
                    console.log('selector found ! you are logged !')
                } catch (e) {
                    console.log('error while logging', e)
                }
            } catch (e){
                console.log('inputs not found, probably already logged')
            }
        }
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
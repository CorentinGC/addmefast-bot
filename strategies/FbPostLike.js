const FbPostLike = async (popup) => {
    // const url = popup.url().replace('www', 'm')
    // // console.log(popup.url(), url)
    // await popup.goto(url, {
    //     waitUntil: 'networkidle2'
    // })
    // const ELEMENT = '#rootcontainer footer > div > div > div > a._15ko._77li.touchable'

    try {
        const ELEMENT = '.tvfksri0.ozuftl9m > .rq0escxv > .rq0escxv > [aria-label="Like"]'
        // await bot.waitAndClick(ELEMENT, popup)
        await popup.waitForSelector(ELEMENT, {timeout: 5000})
        await popup.click(ELEMENT) // Follow user
    } catch {

        try {
            const ELEMENT = 'div._8c74 > span > .oajrlxb2'
            // await bot.waitAndClick(ELEMENT, popup)
            await popup.waitForSelector(ELEMENT, {timeout: 5000})
            await popup.click(ELEMENT) // Follow user
        } catch {
            const ELEMENT = '.w0hvl6rk > .d2edcug0 '
            // await bot.waitAndClick(ELEMENT, popup)
            await popup.waitForSelector(ELEMENT, {timeout: 5000})
            
        }

    }

    // await waitAndClick(ELEMENT, page)
}
module.exports = {
    url: 'https://addmefast.com/free_points/facebook_post_like',
    callback: FbPostLike,
    opts: {
        confirm_after_close: true
    }
}

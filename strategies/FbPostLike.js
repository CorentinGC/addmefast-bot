const FbPostLike = async (popup) => {
    // const url = popup.url().replace('www', 'm')
    // // console.log(popup.url(), url)
    // await popup.goto(url, {
    //     waitUntil: 'networkidle2'
    // })
    // const ELEMENT = '#rootcontainer footer > div > div > div > a._15ko._77li.touchable'

    let ELEMENT
    try {
        ELEMENT = '.tvfksri0.ozuftl9m > .rq0escxv > .rq0escxv > [aria-label="Like"]'
        await popup.waitForSelector(ELEMENT, {timeout: 5000})
    } catch {
        console.log('Selector #1 not found')
    }
    try {
        ELEMENT = 'div._8c74 > span > .oajrlxb2'
        await popup.waitForSelector(ELEMENT, {timeout: 5000})
    } catch {
        console.log('Selector #2 not found')

    }
    try {
        ELEMENT = '.w0hvl6rk > .d2edcug0 '
        await popup.waitForSelector(ELEMENT, {timeout: 5000})
    } catch {
        console.log('Selector #3 not found')
    }   
    await popup.click(ELEMENT)
    await popup.waitForNavigation({
        waitUntil: 'networkidle0',
    })

    // await waitAndClick(ELEMENT, page)
}
module.exports = {
    url: 'https://addmefast.com/free_points/facebook_post_like',
    callback: FbPostLike,
    opts: {
        confirm_after_close: true
    }
}

const FbPostLike = async (popup) => {
    let ELEMENT
    try {
        ELEMENT = ".tvfksri0.ozuftl9m > .rq0escxv > .rq0escxv > [aria-label='Like']"
        await popup.waitForSelector(ELEMENT, {timeout: 5000})
    } catch {
        console.log("Selector #1 not found")
        try {
            ELEMENT = "div._8c74 > span > .oajrlxb2"
            await popup.waitForSelector(ELEMENT, {timeout: 5000})
        } catch {
            console.log("Selector #2 not found")
            try {
                ELEMENT = ".w0hvl6rk > .d2edcug0"
                await popup.waitForSelector(ELEMENT, {timeout: 5000})
            } catch {
                console.log("Selector #3 not found")
                try {
                    ELEMENT = "div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.rj1gh0hx.buofh1pr.g5gj957u.hpfvmrgz.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.d1544ag0.tw6a2znq.jb3vyjys.dlv3wnog.rl04r1d5.mysgfdmx.hddg9phg.qu8okrzs.g0qnabr5"
                    await popup.waitForSelector(ELEMENT, {timeout: 5000})
                } catch {
                    console.log("Selector #4 not found")
                } 
            }   
        }
    }

    try {
        await popup.click(ELEMENT)
    } catch(err) {
        console.log("Element not found :/")
    }


    // await waitAndClick(ELEMENT, page)
}
module.exports = {
    url: "https://addmefast.com/free_points/facebook_post_like",
    callback: FbPostLike,
    opts: {
        confirm_after_close: true
    }
}

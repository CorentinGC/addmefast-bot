const FbPostLike = async (popup) => {
    let ELEMENT = ".tgme_action_web_button"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: "https://addmefast.com/free_points/facebook_post_like",
    callback: FbPostLike,
    opts: {
        confirm_after_close: true
    }
}

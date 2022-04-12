const TwitterLike = async (popup) => {
    const ELEMENT = "div[data-testid='confirmationSheetConfirm']"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: "https://addmefast.com/free_points/twitter_likes",
    callback: TwitterLike,
    opts: {
        confirm_after_close: true,
        maxConsecutive: 10,
        pauseDuration: 3600*1000 // 1hour
    }
}

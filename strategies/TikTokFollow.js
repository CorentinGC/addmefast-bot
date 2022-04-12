const TikTokFollow = async (popup) => {
    const ELEMENT = "[data-e2e='follow-button']"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: "https://addmefast.com/free_points/tiktok_followers",
    callback: TikTokFollow
}

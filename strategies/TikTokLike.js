const TikTokLike = async (popup) => {
    const ELEMENT = "button[data-e2e='like-icon']"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: "https://addmefast.com/free_points/tiktok_video_likes",
    callback: TikTokLike
}

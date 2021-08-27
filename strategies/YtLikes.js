const YtLikes = async (popup, bot) => {
    const ELEMENT = "#columns #primary #info #menu > ytd-menu-renderer #top-level-buttons button#button" // Like video
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
    // await bot.waitAndClick(ELEMENT, popup)
}
module.exports = {
    url: 'https://addmefast.com/free_points/youtube_likes',
    callback: YtLikes
}

// https://www.youtube.com/watch?v=gpuBrCtQn5A
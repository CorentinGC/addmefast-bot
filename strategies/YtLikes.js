const YtLikes = async (popup, bot) => {
    await popup.evaluate(() => {
        const ELEMENT = "ytd-toggle-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-text button#button > yt-icon"
        document.querySelector(ELEMENT).click()
    })

}
module.exports = {
    url: 'https://addmefast.com/free_points/youtube_likes',
    callback: YtLikes
}

// https://www.youtube.com/watch?v=gpuBrCtQn5A
const YtSubscribe = async (popup, bot) => {
    const ELEMENT = ".style-scope ytd-subscribe-button-renderer"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: 'https://addmefast.com/free_points/youtube_subscribe',
    callback: YtSubscribe
}

// https://www.youtube.com/watch?v=gpuBrCtQn5A
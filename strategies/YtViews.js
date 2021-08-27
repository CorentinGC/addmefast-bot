const YtViews = async (popup, bot, page) => {
    const POINTS = /View this video for ([0-9]+) seconds and get ([0-9]+) points/i
    const element = await page.waitForSelector('.fs16')
    const value = await page.evaluate(el => el.textContent, element)
    const duration = value.match(POINTS)[1]
    this._log('Waiting '+duration+' seconds before closing popup')
    
    await popup.waitForTimeout(opts.duration*1000)
}
module.exports = {
    url: 'https://addmefast.com/free_points/youtube_views',
    callback: YtViews
}

// https://www.youtube.com/watch?v=gpuBrCtQn5A
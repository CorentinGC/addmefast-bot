const ScLikes = async (popup, bot) => {
    const ELEMENT = '.l-container.l-content div.soundActions > div.sc-button-group > button.sc-button-like'
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT) // Follow user
}

module.exports = {
    url: 'https://addmefast.com/free_points/soundcloud_likes',
    callback: ScLikes
}
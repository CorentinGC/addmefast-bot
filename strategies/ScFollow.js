const ScFollow = async (popup) => {
    await popup.click('div#content div.userInfoBar div.sc-button-group > button.sc-button-follow') // Follow user
}

module.exports = {
    url: 'https://addmefast.com/free_points/soundcloud_follow',
    callback: ScFollow
}
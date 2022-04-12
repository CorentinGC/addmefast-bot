const TwitterTweet = async (popup) => {
    const ELEMENT = "[data-testid='tweetButton']"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT) 
}
module.exports = {
    url: "https://addmefast.com/free_points/twitter_tweets",
    callback: TwitterTweet,
    opts: {
        confirm_after_close: true
    }
}

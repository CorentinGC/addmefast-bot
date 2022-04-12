const RedditUpvote = async (popup) => {
    const ELEMENT = "button.voteButton"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT) // Follow user
}
module.exports = {
    url: "https://addmefast.com/free_points/reddit_upvotes",
    callback: RedditUpvote
}

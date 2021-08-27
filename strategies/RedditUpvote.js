const RedditUpvote = async (popup) => {
    await popup.waitForSelector('button.voteButton')
    await popup.click('button.voteButton') // Follow user
}
module.exports = {
    url: 'https://addmefast.com/free_points/reddit_upvotes',
    callback: RedditUpvote
}

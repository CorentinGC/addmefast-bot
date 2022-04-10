const FbPageLike = require('./FbPageLike')
const FbPostLike = require('./FbPostLike')
const RedditUpvote = require('./RedditUpvote')
const ScFollow = require('./ScFollow')
const ScLike = require('./ScLike')
const YtLike = require('./YtLike')
const YtView = require('./YtView')
const CmcWatchlist = require('./CmcWatchlist')

const providers = [
    {provider: "facebook", strategies: ["FbPageLike", "FbPostLike"], url: "https://www.facebook.com/?sk=lf"},
    {provider: "gmail", strategies: ["YtLike", "YtView"], url: "https://accounts.google.com/"},
    {provider: "soundcloud", strategies: ["ScLike", "ScFollow"], url: ""},
    {provider: "reddit", strategies: ["RedditUpvote"], url: "https://www.reddit.com/login/"}
]

module.exports = {
    FbPageLike,
    FbPostLike,
    RedditUpvote,
    ScFollow,
    ScLike,
    YtLike,
    YtView,
    CmcWatchlist,
    providers
}
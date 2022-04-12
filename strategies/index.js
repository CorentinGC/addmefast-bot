const FbPageLike = require('./FbPageLike')
const FbPostLike = require('./FbPostLike')
const RedditLike = require('./RedditLike')
const ScFollow = require('./ScFollow')
const ScLike = require('./ScLike')
const YtLike = require('./YtLike')
const YtView = require('./YtView')
const YtSubscribe = require('./YtSubscribe')
const CmcWatchlist = require('./CmcWatchlist')
const TwitterLike = require('./TwitterLike')
const TwitterFollow = require('./TwitterFollow')
const TikTokLike = require('./TikTokLike')
const TikTokFollow = require('./TikTokFollow')

const providers = [
    {provider: "facebook", strategies: ["FbPageLike", "FbPostLike"], url: "https://www.facebook.com/?sk=lf"},
    {provider: "twitter", strategies: ["TwitterLike", "TwitterFollow"], url: "https://twitter.com/i/flow/login"},
    {provider: "gmail", strategies: ["YtLike", "YtView", "YtSubscribe"], url: "https://accounts.google.com/"},
    {provider: "soundcloud", strategies: ["ScLike", "ScFollow"], url: ""},
    {provider: "reddit", strategies: ["RedditLike", "RedditFollow"], url: "https://www.reddit.com/login/"},
    {provider: "tiktok", strategies: ["TikTokLike", "TikTokFollow"], url: "https://www.tiktok.com/login"}
]

module.exports = {
    FbPageLike,
    FbPostLike,
    RedditLike,
    ScFollow,
    ScLike,
    YtLike,
    YtSubscribe,
    YtView,
    CmcWatchlist,
    TwitterLike,
    TwitterFollow,
    TikTokLike,
    TikTokFollow,
    providers
}
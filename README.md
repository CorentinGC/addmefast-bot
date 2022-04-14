# AddMeFast Bot
*A bot to earn point automaticaly on AddMeFast*

This project is in active development and there might be some bugs, don't hesitate to open an issue if you found one.

### Setup
- Copy `.env.example` to `.env`
- Then fill your AddMeFast credentials (`AMF_EMAIL` and `AMF_PASSWORD`) and add strategies (`STRATEGIES`)
- Fill associated networks credentials (Facebook, Gmail, Soundcloud)
- Run `yarn start` to auto login on networks and start bot

The bot will stop on errors, if you want infinite loop you can run it with [`forever`](https://github.com/foreversd/forever)

*You can run `yarn start:noauth` to start without trying to auth on networks*

### Supported AddMeFast strategies
- Facebook like post - `FbPostLike`
- Facebook like page - `FbPageLike`
- Youtube video like - `YtLike`
- Youtube subscribe - `YtSubscribe`
- Soundcloud like - `ScLike`
- Soundcloud subscribe - `ScSubscribe`
- Reddit upvote - `RedditUpvote`
- Reddit follow - `RedditFollow`
- CoinMarketCap watchlist - `CmcWatchlist`
- Twitter like - `TwitterLike`
- Twitter follow - `TwitterFollow`
- TikTok like - `TikTokLike`
- TikTok follow - `TikTokFollow`

## Bot Configuration
|Key|Description|Type|Default|Optional|
|---|---|---|---|---|
|`AMF_EMAIL` | AddMeFast email  | `string` | `true` | false
|`AMF_PASSWORD` | AddMeFast password | `string` | `true` | false
|`CLOUDFLARE_TIMEOUT` | Cloudflare wait delay (startup) | `int` | `15` | true
|`STRATEGIES` | List of enabled strategies | `array` | `[]` | false
|`CHROME_PATH` | Path of chrome executable (instead of default chromieum) | `string` | `null` | true
|`MAX_INACTIVITY` | Time in second before forcerestart the bot | `int` | `60` | true
|`PROXY_PROTOCOL` | Proxy protocol | `string` | `http`| true
|`PROXY_HOST` | Proxy host | `string \| ip` | `null` | true
|`PROXY_PORT` | Proxy port | `string \| int` | `null` | true
|`PROXY_USER` | Proxy username | `string` | `null`| true
|`PROXY_PASSWORD` | Proxy password | `string` | `null`| true
|`PROXY_TOR` | Proxy is Tor node | `string \| bool` | `false` | true
|`TOR_PASSWORD` | If `PROXY_TOR` enabled define torrc password, for renewing IP | `string` | `null` | true

## Networks
*Actually only facebook, gmail/youtube and reddit accounts are supported on auto-login, if you want to auth on other networks, run the bot with `yarn debug`*
|Key|Description|
|---|---|
`FACEBOOK_EMAIL`| Facebook email
`FACEBOOK_PASSWORD` | Facebook password
`GMAIL_EMAIL` | Google email
`GMAIL_PASSWORD` | Google password
`SC_EMAIL` | Soundcloud email
`SC_PASSWORD` | Soundcloud password
`TWITTER_EMAIL` | Twitter email (if different from gmail account)
`TWITTER_PASSWORD` | Twitter password (if different from gmail account)

## Commands
|Key|Description|
|---|---|
`start`| Run the bot
`auth` | Run auto socials auth
`start:auth` |  Run auto socials auth then run the botaccount)
`debug` | Open navigator to AMF homepage
`check-ip` | Open navigator to whatismyipaddress.com to check current IP

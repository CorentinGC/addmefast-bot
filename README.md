# AddMeFast Bot

### Setup
- Copy `.env.example` to `.env`
- Then fill your AddMeFast credentials (`AMF_EMAIL` and `AMF_PASSWORD`) and add strategies (`STRATEGIES`)
- Fill associated networks credentials (Facebook, Gmail, Soundcloud)
- Run `yarn start` to auto login on networks and start bot

*You can run `yarn start:noauth` to start without trying to auth on networks*

### Supported AddMeFast strategies
- Facebook like post - `FbPostLike`
- Facebook like page - `FbPageLike`
- Youtube video like - `YtLike`
- Youtube subscribe - `YtSubscribe`
- Soundcloud like - `ScLike`
- Soundcloud subscribe - `ScSubscribe`
- Reddit upvote - `RedditUpvote`
- CoinMarketCap watchlist - `CmcWatchlist`

Strategies env (`STRATEGIES`)

## Bot Configuration
|Key|Description|Type|Default|Optional|
|---|---|---|---|---|
|`AMF_EMAIL` | AddMeFast email  | `string` | `true` | false
|`AMF_PASSWORD` | AddMeFast password | `string` | `true` | false
|`STRATEGIES` | List of enabled strategies | `array` | `[]` | false
|`MAX_INACTIVITY` | Time in second before forcerestart the bot | `int` | `60` | true
|`PROXY_PROTOCOL` | Proxy protocol | `string` | `http`| true
|`PROXY_HOST` | Proxy host | `string \| ip` | `null` | true
|`PROXY_PORT` | Proxy port | `string \| int` | `null` | true
|`PROXY_USER` | Proxy username | `string` | `null`| true
|`PROXY_PASSWORD` | Proxy password | `string` | `null`| true
|`PROXY_TOR` | Proxy is Tor node | `string \| bool` | `false` | true
|`TOR_PASSWORD` | If `PROXY_TOR` enabled define torrc password, for renewing IP | `string` | `null` | true

## Networks
|Key|Description|Type|
|---|---|---|
`FACEBOOK_EMAIL`| Facebook email | `string`
`FACEBOOK_PASSWORD` | Facebook password | `string`
`GMAIL_EMAIL` | Google email | `string`
`GMAIL_PASSWORD` | Google password | `string`
`SC_EMAIL` | Soundcloud email | `string`
`SC_PASSWORD` | Soundcloud password | `string`

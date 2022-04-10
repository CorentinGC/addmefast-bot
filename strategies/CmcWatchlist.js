const CmcWatchlist = async (popup) => {
    await popup.waitForSelector(".nameHeader>span")
    await popup.click(".nameHeader>span") // Follow user
}
module.exports = {
    url: 'https://addmefast.com/free_points/coinmarketcap_watchlist',
    callback: CmcWatchlist,
    opts: {
        confirm_after_close: true
    }
}

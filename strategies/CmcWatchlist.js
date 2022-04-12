const CmcWatchlist = async (popup) => {
    const ELEMENT = ".nameHeader>span"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT) // Follow user
}
module.exports = {
    url: "https://addmefast.com/free_points/coinmarketcap_watchlist",
    callback: CmcWatchlist,
    opts: {
        confirm_after_close: true
    }
}

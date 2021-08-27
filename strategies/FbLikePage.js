const FbLikePage = async (popup) => {
    const ELEMENT = "#rootcontainer #msite-pages-header-contents ._9_7._2rgt._1j-f._2rgt > ._a58._a5o._a5t._9_7._2rgt._1j-f._2rgt" // Fb Like
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: 'https://addmefast.com/free_points/facebook_likes',
    callback: FbLikePage
}

const RedditUpvote = async (popup) => {
    const ELEMENT = "._1LHxa-yaHJwrPK8kuyv_Y4._2iuoyPiKHN3kfOoeIQalDT._10BQ7pjWbeYP63SAPNS8Ts.HNozj_dKjQZ59ZsfEegz8._34mIRHpFtnJ0Sk97S2Z3D9"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT)
}
module.exports = {
    url: "https://addmefast.com/free_points/reddit_upvotes",
    callback: RedditUpvote
}

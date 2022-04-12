const TwitterFollow = async (popup) => {
    const ELEMENT = "div[data-testid='confirmationSheetConfirm']"
    await popup.waitForSelector(ELEMENT)
    await popup.click(ELEMENT) 
}
module.exports = {
    url: "https://addmefast.com/free_points/twitter",
    callback: TwitterFollow,
    opts: {
        confirm_after_close: true
    }
}

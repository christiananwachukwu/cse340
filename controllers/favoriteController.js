const favoriteModel = require("../models/favorite-model")
const utilities = require("../utilities/")

const favCont = {}

/* ***************************
*  Add vehicle to favorites
* ************************** */
favCont.addFavorite = async function (req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  // Check if already favorited
  const existing = await favoriteModel.checkExistingFavorite(account_id, inv_id)
 
  if (existing > 0) {
    req.flash("notice", "This vehicle is already in your favorites.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  const result = await favoriteModel.addFavorite(account_id, inv_id)

  if (result) {
    req.flash("notice", "Vehicle added to favorites!")
    res.redirect("/favorite")
  } else {
    req.flash("notice", "Sorry, adding to favorites failed.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
*  Show all favorites
* ************************** */
favCont.getFavorites = async function (req, res) {
  const account_id = res.locals.accountData.account_id
  const favorites = await favoriteModel.getFavoritesByAccountId(account_id)
 
  let nav = await utilities.getNav()
 
  res.render("favorites/index", {
    title: "My Favorites",
    nav,
    favorites,
    errors: null,
  })
}

/* ***************************
*  Remove from favorites
* ************************** */
favCont.removeFavorite = async function (req, res) {
  const { inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  const result = await favoriteModel.removeFavorite(account_id, inv_id)

  if (result) {
    req.flash("notice", "Vehicle removed from favorites.")
  } else {
    req.flash("notice", "Sorry, removal failed.")
  }
 
  res.redirect("/favorite")
}

module.exports = favCont
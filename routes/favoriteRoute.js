// Needed Resources
const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const utilities = require("../utilities/")

// All routes require login 
router.use(utilities.checkLogin)

// Route to add a favorite
router.post("/add", utilities.handleErrors(favoriteController.addFavorite))

// Route to view favorites
router.get("/", utilities.handleErrors(favoriteController.getFavorites))

// Route to remove a favorite
router.post("/remove", utilities.handleErrors(favoriteController.removeFavorite))

module.exports = router
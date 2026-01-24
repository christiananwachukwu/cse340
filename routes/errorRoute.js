// Needed Resources
const express = require('express')
const router = new express.Router()
const errorController = require('../utilities/')
const utilities = require('../utilities/index')

// Route to trigger intetional error
router.get('/trigger-error', utilities.handleErrors(errorController.triggerError))

module.exports = router
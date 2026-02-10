// Needed Resources
const express = require("express")
const router = new express.Router()
const bookingController = require("../controllers/bookingController")
const utilities = require("../utilities/")
// All routes require login 
router.use(utilities.checkLogin)
// Route to show booking form
router.get("/create/:invId", utilities.handleErrors(bookingController.showBookingForm))

// Route to process booking
router.post("/create", utilities.handleErrors(bookingController.createBooking))

// Route to view user's bookings
router.get("/", utilities.handleErrors(bookingController.getUserBookings))

// Route to cancel a booking
router.post("/cancel", utilities.handleErrors(bookingController.cancelBooking))

module.exports = router
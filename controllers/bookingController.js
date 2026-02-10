const bookingModel = require("../models/booking-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")

const bookCont = {}

/* ***************************
*  Show booking form
* ************************** */
bookCont.showBookingForm = async function (req, res) {
  const inv_id = req.params.invId
  const vehicleData = await invModel.getInventoryById(inv_id)
 
  let nav = await utilities.getNav()
  const vehicleName = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
 
  res.render("bookings/create", {
    title: "Book " + vehicleName,
    nav,
    vehicleData,
    errors: null,
  })
}

/* ***************************
*  Process booking creation
* ************************** */
bookCont.createBooking = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_id, start_date, end_date } = req.body
  const account_id = res.locals.accountData.account_id

  // Validate dates
  const startDate = new Date(start_date)
  const endDate = new Date(end_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (startDate < today) {
    req.flash("notice", "Start date cannot be in the past.")
    return res.redirect(`/booking/create/${inv_id}`)
  }

  if (endDate <= startDate) {
    req.flash("notice", "End date must be after start date.")
    return res.redirect(`/booking/create/${inv_id}`)
  }

  // Check for booking conflicts
  const conflict = await bookingModel.checkBookingConflict(inv_id, start_date, end_date)
 
  if (conflict > 0) {
    req.flash("notice", "Sorry, this vehicle is already booked for those dates.")
    return res.redirect(`/booking/create/${inv_id}`)
  }

  // Create the booking
  const result = await bookingModel.createBooking(account_id, inv_id, start_date, end_date)

  if (result.booking_id) {
    req.flash("notice", "Booking created successfully!")
    res.redirect("/booking")
  } else {
    req.flash("notice", "Sorry, booking creation failed.")
    res.redirect(`/booking/create/${inv_id}`)
  }
}

/* ***************************
*  Show user's bookings
* ************************** */
bookCont.getUserBookings = async function (req, res) {
  const account_id = res.locals.accountData.account_id
  const bookings = await bookingModel.getBookingsByAccountId(account_id)
 
  let nav = await utilities.getNav()
 
  res.render("bookings/index", {
    title: "My Bookings",
    nav,
    bookings,
    errors: null,
  })
}

/* ***************************
*  Cancel a booking
* ************************** */
bookCont.cancelBooking = async function (req, res) {
  const { booking_id } = req.body
  const account_id = res.locals.accountData.account_id

  const result = await bookingModel.cancelBooking(booking_id, account_id)

  if (result) {
    req.flash("notice", "Booking cancelled successfully.")
  } else {
    req.flash("notice", "Sorry, cancellation failed.")
  }
 
  res.redirect("/booking")
}

module.exports = bookCont
const pool = require("../database/")

/* ***************************
*  Create new booking
* ************************** */
async function createBooking(account_id, inv_id, start_date, end_date) {
  try {
    const sql = `
      INSERT INTO bookings (account_id, inv_id, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
    `
    const result = await pool.query(sql, [account_id, inv_id, start_date, end_date])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Get all bookings for a user
* ************************** */
async function getBookingsByAccountId(account_id) {
  try {
    const sql = `
      SELECT b.booking_id, b.inv_id, b.start_date, b.end_date, b.status, b.created_at,
             i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail
      FROM bookings b
      INNER JOIN inventory i ON b.inv_id = i.inv_id
      WHERE b.account_id = $1
      ORDER BY b.created_at DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Cancel booking
* ************************** */
async function cancelBooking(booking_id, account_id) {
  try {
    const sql = `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE booking_id = $1 AND account_id = $2
      RETURNING *
    `
    const result = await pool.query(sql, [booking_id, account_id])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Get booking by ID
* ************************** */
async function getBookingById(booking_id) {
  try {
    const sql = "SELECT * FROM bookings WHERE booking_id = $1"
    const result = await pool.query(sql, [booking_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Check for conflicting bookings
* ************************** */
async function checkBookingConflict(inv_id, start_date, end_date) {
  try {
    const sql = `
      SELECT * FROM bookings
      WHERE inv_id = $1
      AND status != 'cancelled'
      AND (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      )
    `
    const result = await pool.query(sql, [inv_id, start_date, end_date])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {
  createBooking,
  getBookingsByAccountId,
  cancelBooking,
  getBookingById,
  checkBookingConflict
}
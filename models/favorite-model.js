const pool = require("../database/")

/* ***************************
*  Add vehicle to favorites
* ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Get all favorites for a user
* ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id, f.inv_id, f.date_added,
             i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_thumbnail
      FROM favorites f
      INNER JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.date_added DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Remove favorite
* ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = "DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Check if vehicle is already favorited
* ************************** */
async function checkExistingFavorite(account_id, inv_id) {
  try {
    const sql = "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {
  addFavorite,
  getFavoritesByAccountId,
  removeFavorite,
  checkExistingFavorite
}
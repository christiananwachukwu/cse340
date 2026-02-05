const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Valid year required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be number."),
    body("inv_color").trim().notEmpty().withMessage("Color required."),
    body("classification_id").notEmpty().withMessage("Choose classification."),
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList =
      await utilities.buildClassificationList(req.body.classification_id)

    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors,
      ...req.body,
    })
    return
  }
  next()
}

/* ******************************
* Check data and return errors or continue to update
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate
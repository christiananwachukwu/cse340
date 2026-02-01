const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")

const inventoryRules = () => {
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

const checkInventoryData = async (req, res, next) => {
  const { errors } = validationResult(req)

  if (errors.length > 0) {
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
module.exports = { inventoryRules, checkInventoryData }
const invModel = require("../models/inventory-model") 
const utilities = require("../utilities/") 

const invCont = {} 

/* *************************** 
* Build inventory by classification view 
* ************************** */ 
invCont.buildByClassificationId = async function (req, res, next) { 
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id) 
    const grid = await utilities.buildClassificationGrid(data) 
    let nav = await utilities.getNav() 
    let className = "No Classification"
    if (data && data.length > 0) {
        className = data[0].classification_name
    }
    res.render("./inventory/classification", { 
        title: className + " vehicles", 
        nav, 
        grid, 
    }) 
}

/* ***************************
*  Build vehicle detail view by inventory ID
* ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryById(inv_id);
   
    if (!data) {
      // If no vehicle found, trigger 404
      const err = new Error('Vehicle not found');
      err.status = 404;
      return next(err);
    }
   
    const grid = await utilities.buildVehicleDetailHTML(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
   
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};
/***********************
 * Test: show all inventory as JSON
 * *************************** */
invCont.testInventory = async function (req, res, next) {
    const data = await invModel.getInventoryByClassificationId(1)
    res.json(data)
}
module.exports = invCont
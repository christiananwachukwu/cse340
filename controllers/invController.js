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
/***********************
 * Test: show all inventory as JSON
 * *************************** */
invCont.testInventory = async function (req, res, next) {
    const data = await invModel.getInventoryByClassificationId(1)
    res.json(data)
}
module.exports = invCont
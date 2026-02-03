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
    const data = await invModel.getInventoryById(inv_id); // FIXED: was getInventoryByInventoryId
  
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

/* ***************************
*  Build inventory management view
* ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
*  Build add classification view
* ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
*  Process add classification
* ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    nav = await utilities.getNav() // Rebuild nav with new classification
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
*  Build add inventory view
* ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
*  Process add inventory
* ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationList =
    await utilities.buildClassificationList(req.body.classification_id)

  const result = await invModel.addInventoryItem(req.body)

  if (result) {
    req.flash("notice", "Vehicle successfully added.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, adding vehicle failed.")

    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body,
    })
  }
}

/***********************
* Test: show all inventory as JSON
* *************************** */
invCont.testInventory = async function (req, res, next) {
    const data = await invModel.getInventoryByClassificationId(1)
    res.json(data)
}

module.exports = invCont
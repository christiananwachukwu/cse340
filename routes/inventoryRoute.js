// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const accountValidate = require("../utilities/account-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to show add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification (POST)
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Test route
router.get("/test", utilities.handleErrors(invController.testInventory));
// Inventory Detail Route
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to show inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post("/add-inventory", inventoryValidate.inventoryRules(), inventoryValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to process inventory update
router.post("/update", inventoryValidate.inventoryRules(), inventoryValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Route to build delete confirmation
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView));

// Route to process inventory deletion
router.post("/delete", utilities.handleErrors(invController.deleteInventory));
module.exports = router;
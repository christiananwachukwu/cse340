// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const accountValidate = require("../utilities/account-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// PUBLIC ROUTES (anyone can access - no changes)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/test", utilities.handleErrors(invController.testInventory));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// PROTECTED ROUTES (Employee/Admin only) - ADD utilities.checkAccountType to each
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

router.post("/add-inventory", utilities.checkAccountType, inventoryValidate.inventoryRules(), inventoryValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));

router.post("/update", utilities.checkAccountType, inventoryValidate.inventoryRules(), inventoryValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView));

router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory));

module.exports = router;

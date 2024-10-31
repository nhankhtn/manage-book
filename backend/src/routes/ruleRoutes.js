const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");

// changeRules
router.put("/", ruleController.updateRules);

router.get("/", ruleController.getRules);

module.exports = router;

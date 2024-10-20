const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");

// changeRules
router.put("/update", ruleController.updateRules);

router.get("/all-rules", ruleController.getRules);

module.exports = router;
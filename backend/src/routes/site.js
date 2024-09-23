const express = require("express");
const router = express.Router();

router.get("/", (req, res) => { return res.json({ message: "Hello world!!!" }) });

module.exports = router;
const express = require("express");
const kotController = require("../controllers/kotController");

const router = express.Router();

router.get("/getAllKot", kotController.getAllkot).post("/createKot", kotController.createKOT);

module.exports = router;
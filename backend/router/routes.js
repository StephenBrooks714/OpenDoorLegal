const express = require("express");
const router = express.Router();

const Controller = require("../controllers/MainControllerRoute");

router.get("/", Controller.home)

module.exports = router;
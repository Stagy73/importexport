const express = require("express");
const router = express.Router();

const { convertCurrency } = require("../controllers/currencyController");
const { simulateImport } = require("../controllers/simulateController");

router.get("/currency/convert", convertCurrency);
router.get("/simulate", simulateImport);

module.exports = router;

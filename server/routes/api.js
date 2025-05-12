const express = require("express");
const router = express.Router();

const { convertCurrency } = require("../controllers/currencyController");
const {
  simulateImport,
  getAllSimulations,
} = require("../controllers/simulateController");

router.get("/currency/convert", convertCurrency);
router.get("/simulate", simulateImport);

// ➕ Nouvelle route pour récupérer les simulations stockées
router.get("/simulations", getAllSimulations);

module.exports = router;

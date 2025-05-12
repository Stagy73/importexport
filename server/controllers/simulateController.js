const Simulation = require("../models/Simulation");

// 👉 Simulation principale
const simulateImport = async (req, res, next) => {
  try {
    const {
      originCountry,
      destinationCountry,
      price,
      shippingService,
      shippingCost,
      margin,
      type,
    } = req.query;

    if (
      !originCountry ||
      !destinationCountry ||
      !price ||
      !shippingService ||
      !shippingCost ||
      !margin ||
      !type
    ) {
      return res.status(400).json({
        error:
          "Paramètres requis : originCountry, destinationCountry, price, shippingService, shippingCost, margin, type",
      });
    }

    const numericPrice = parseFloat(price);
    const numericMargin = parseFloat(margin);
    const numericShipping = parseFloat(shippingCost);

    if (isNaN(numericPrice) || isNaN(numericMargin) || isNaN(numericShipping)) {
      return res.status(400).json({
        error: "price, margin et shippingCost doivent être des nombres",
      });
    }

    const tvaRates = {
      fr: 20,
      de: 19,
      es: 21,
      it: 22,
      us: 0,
    };

    const customsRates = {
      fr: 4,
      de: 4,
      es: 5,
      it: 4.5,
      us: 2,
    };

    const tvaRate = tvaRates[destinationCountry.toLowerCase()] || 20;
    const customsRate = customsRates[destinationCountry.toLowerCase()] || 5;

    const customs = numericPrice * (customsRate / 100);
    const marginValue =
      type === "percent" ? numericPrice * (numericMargin / 100) : numericMargin;

    const totalHT = numericPrice + customs + marginValue + numericShipping;
    const tva = totalHT * (tvaRate / 100);
    const totalTTC = totalHT + tva;

    const simulation = await Simulation.create({
      originCountry,
      destinationCountry,
      price: numericPrice,
      shippingService,
      shippingCost: numericShipping,
      customsRate,
      customs,
      margin: marginValue,
      tvaRate,
      tva,
      totalHT,
      totalTTC,
    });

    res.json({
      id: simulation.id,
      originCountry,
      destinationCountry,
      price: simulation.price,
      shippingService,
      shippingCost: simulation.shippingCost.toFixed(2),
      customsRate,
      customs: simulation.customs.toFixed(2),
      margin: simulation.margin.toFixed(2),
      tvaRate,
      tva: simulation.tva.toFixed(2),
      totalHT: simulation.totalHT.toFixed(2),
      totalTTC: simulation.totalTTC.toFixed(2),
      createdAt: simulation.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

// 👉 Liste des simulations en base
const getAllSimulations = async (req, res, next) => {
  try {
    const simulations = await Simulation.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(simulations);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  simulateImport,
  getAllSimulations,
};

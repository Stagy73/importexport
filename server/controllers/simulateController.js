const simulateImport = (req, res) => {
  const { price, country, margin, type } = req.query;

  if (!price || !country || !margin || !type) {
    return res
      .status(400)
      .json({ error: "Paramètres requis : price, country, margin, type" });
  }

  const numericPrice = parseFloat(price);
  const numericMargin = parseFloat(margin);
  if (isNaN(numericPrice) || isNaN(numericMargin)) {
    return res
      .status(400)
      .json({ error: "price et margin doivent être des nombres" });
  }

  // Taux de TVA par pays (exemple simple)
  const tvaRates = {
    fr: 20,
    de: 19,
    es: 21,
    it: 22,
    us: 0,
  };

  // Taux de douane par pays (exemple générique)
  const customsRates = {
    fr: 4,
    de: 4,
    es: 5,
    it: 4.5,
    us: 2,
  };

  const tvaRate = tvaRates[country.toLowerCase()] || 20;
  const customsRate = customsRates[country.toLowerCase()] || 5;

  // Douane
  const customs = numericPrice * (customsRate / 100);

  // Marge
  let marginValue =
    type === "percent" ? numericPrice * (numericMargin / 100) : numericMargin;

  // Total HT
  const totalHT = numericPrice + customs + marginValue;

  // TVA
  const tva = totalHT * (tvaRate / 100);

  // Total TTC
  const totalTTC = totalHT + tva;

  res.json({
    price: numericPrice,
    customsRate,
    customs: customs.toFixed(2),
    margin: marginValue.toFixed(2),
    tvaRate,
    tva: tva.toFixed(2),
    totalHT: totalHT.toFixed(2),
    totalTTC: totalTTC.toFixed(2),
  });
};

module.exports = { simulateImport };

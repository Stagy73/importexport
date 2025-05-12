const axios = require("axios");

const convertCurrency = async (req, res, next) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Paramètres manquants (from, to, amount)" });
  }

  try {
    const response = await axios.get("https://api.exchangerate.host/convert", {
      params: { from, to, amount },
    });

    const result = response.data;

    if (!result.result) {
      return res.status(500).json({ error: "Conversion échouée" });
    }

    res.json({
      from,
      to,
      amount: Number(amount),
      converted: result.result,
      rate: result.info.rate,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { convertCurrency };

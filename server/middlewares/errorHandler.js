const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur :", err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || "Erreur serveur",
  });
};

module.exports = { errorHandler };

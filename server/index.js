const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRoutes = require("./routes/api");
const { errorHandler } = require("./middlewares/errorHandler");
const sequelize = require("./config/db");
const Simulation = require("./models/Simulation");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", apiRoutes);
app.use(errorHandler);

// 🔧 Connexion MySQL + Sync modèles
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connecté à MySQL");

    return sequelize.sync({ alter: true }); // synchroniser les modèles
  })
  .then(() => {
    console.log("✅ Base synchronisée (Simulation table)");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur MySQL :", err.message);
  });

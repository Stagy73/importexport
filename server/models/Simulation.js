const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Simulation = sequelize.define(
  "Simulation",
  {
    // 🔽 Origine & destination
    originCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 🔽 Base de calcul
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shippingService: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // 🔽 Douane
    customsRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    customs: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // 🔽 Marge
    margin: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // 🔽 TVA
    tvaRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tva: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // 🔽 Résultats
    totalHT: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalTTC: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = Simulation;

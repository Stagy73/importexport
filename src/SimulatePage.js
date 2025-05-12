import React, { useState } from "react";
import axios from "axios";
import { countries } from "./data/countries";
import "./simulate.css";

const shippingServices = [
  { code: "ups", label: "UPS" },
  { code: "dhl", label: "DHL" },
  { code: "fedex", label: "FedEx" },
  { code: "laposte", label: "La Poste" },
  { code: "chronopost", label: "Chronopost" },
];

function SimulatePage() {
  const [form, setForm] = useState({
    price: "",
    originCountry: "fr",
    destinationCountry: "us",
    margin: "",
    type: "percent",
    shippingService: "",
    shippingCost: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const res = await axios.get("http://localhost:5000/api/simulate", {
        params: form,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur serveur");
    }
  };

  return (
    <div className="simulate-container">
      <h1 className="simulate-title">Simulation Import/Export</h1>

      <form onSubmit={handleSubmit} className="simulate-form">
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Prix d'achat"
          className="simulate-input"
          required
        />

        <select
          name="originCountry"
          value={form.originCountry}
          onChange={handleChange}
          className="simulate-input"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          name="destinationCountry"
          value={form.destinationCountry}
          onChange={handleChange}
          className="simulate-input"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="margin"
          value={form.margin}
          onChange={handleChange}
          placeholder="Marge"
          className="simulate-input"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="simulate-input"
        >
          <option value="percent">Pourcentage (%)</option>
          <option value="fixed">Montant fixe (€)</option>
        </select>

        <select
          name="shippingService"
          value={form.shippingService}
          onChange={handleChange}
          className="simulate-input"
          required
        >
          <option value="">Service de livraison</option>
          {shippingServices.map((s) => (
            <option key={s.code} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="shippingCost"
          value={form.shippingCost}
          onChange={handleChange}
          placeholder="Coût de livraison (€)"
          className="simulate-input"
          required
        />

        <button type="submit" className="simulate-button">
          Calculer
        </button>
      </form>

      {error && <p className="simulate-error">{error}</p>}

      {result && (
        <div className="simulate-result">
          <h2>Résultat :</h2>
          <ul>
            <li>💰 Prix : {result.price} €</li>
            <li>📦 Douane : {result.customs} €</li>
            <li>📈 Marge : {result.margin} €</li>
            <li>🚚 Livraison : {form.shippingCost} €</li>
            <li>🧾 TVA : {result.tva} €</li>
            <li>🧮 Total HT : {result.totalHT} €</li>
            <li>💸 Total TTC : {result.totalTTC} €</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SimulatePage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { countries } from "./data/countries";
import "./history.css";

function SimulationHistory() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/simulations");
        setSimulations(res.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des simulations :",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSimulations = simulations.filter((s) =>
    countryFilter.trim()
      ? s.originCountry?.toLowerCase().includes(countryFilter.toLowerCase()) ||
        s.destinationCountry
          ?.toLowerCase()
          .includes(countryFilter.toLowerCase())
      : true
  );

  const exportToCSV = () => {
    const dataToExport = filteredSimulations.map((s) => ({
      Date: new Date(s.createdAt).toLocaleString(),
      Origine: s.originCountry?.toUpperCase(),
      Destination: s.destinationCountry?.toUpperCase(),
      Prix: s.price?.toFixed(2),
      Livraison: s.shippingCost?.toFixed(2),
      Transporteur: s.shippingService,
      Douane: s.customs?.toFixed(2),
      Marge: s.margin?.toFixed(2),
      TVA: s.tva?.toFixed(2),
      Total_TTC: s.totalTTC?.toFixed(2),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `simulations_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="history-container">
      <h1 className="history-header">📊 Historique des simulations</h1>

      <div className="history-filters">
        <select
          className="filter-select"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="">🌍 Tous les pays</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>

        <button onClick={exportToCSV} className="export-button">
          ⬇️ Exporter CSV
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : filteredSimulations.length === 0 ? (
        <p>Aucune simulation trouvée.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Origine</th>
              <th>Destination</th>
              <th>Prix</th>
              <th>Livraison</th>
              <th>Transporteur</th>
              <th>Douane</th>
              <th>Marge</th>
              <th>TVA</th>
              <th>Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {filteredSimulations.map((s) => (
              <tr key={s.id}>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td>{s.originCountry?.toUpperCase()}</td>
                <td>{s.destinationCountry?.toUpperCase()}</td>
                <td>{s.price?.toFixed(2)} €</td>
                <td>{s.shippingCost?.toFixed(2)} €</td>
                <td>{s.shippingService}</td>
                <td>{s.customs?.toFixed(2)} €</td>
                <td>{s.margin?.toFixed(2)} €</td>
                <td>{s.tva?.toFixed(2)} €</td>
                <td className="font-bold">{s.totalTTC?.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SimulationHistory;

import React, { useEffect, useState } from "react";

function Rates() {
  const [usdToInr, setUsdToInr] = useState(null);
  const [source, setSource] = useState(null);
  const [goldRate, setGoldRate] = useState(null);
  const [goldSource, setGoldSource] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://expense-rates-backend.onrender.com/api/usd-to-inr")
      .then((res) => res.json())
      .then((data) => {
        setUsdToInr(data.rate);
        setSource(data.source);
      })
      .catch(() => setError("Could not load exchange rate."));

    fetch("https://expense-rates-backend.onrender.com/api/gold-rate")
      .then((res) => res.json())
      .then((data) => {
        console.log("GOLD DATA:", data);
        setGoldRate(data.rate);
        setGoldSource(data.source);
      })
      .catch(() => setError("Could not load gold rate."));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg rates-container-bg mb-4">
      <div className="container-md d-flex justify-content-between align-items-center rates-bar">
        <div className="pill">
          <span>1 USD :</span>
          {error ? (
            <span className="text-danger ms-2">{error}</span>
          ) : usdToInr ? (
            <span className="ms-2">₹{usdToInr}</span>
          ) : (
            <span className="ms-2">Loading...</span>
          )}
        </div>
        <div className="pill">
          <span>10g Gold :</span>
          {error ? (
            <span className="text-danger ms-2">{error}</span>
          ) : goldRate ? (
            <span className="ms-2">₹{goldRate}</span>
          ) : (
            <span className="ms-2">Loading...</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Rates;

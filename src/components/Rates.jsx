import { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../context/GlobalState";

function Rates() {
  const [usdToInr, setUsdToInr] = useState(null);
  const [source, setSource] = useState(null);
  const [goldRate, setGoldRate] = useState(null);
  const [goldSource, setGoldSource] = useState(null);

  const [error, setError] = useState(null);
  const { apiBaseUrl } = useContext(GlobalContext);

  const ratesBaseUrl = useMemo(() => {
    if (!apiBaseUrl) {
      return null;
    }
    return `${apiBaseUrl}/api`;
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!ratesBaseUrl) {
      return;
    }

    fetch(`${ratesBaseUrl}/usd-to-inr`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load exchange rate.");
        }
        return res.json();
      })
      .then((data) => {
        setUsdToInr(data.rate);
        setSource(data.source);
      })
      .catch(() => setError("Could not load exchange rate."));

    fetch(`${ratesBaseUrl}/gold-rate`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not load gold rate.");
        }
        return res.json();
      })
      .then((data) => {
        setGoldRate(data.rate);
        setGoldSource(data.source);
      })
      .catch(() => setError("Could not load gold rate."));
  }, [ratesBaseUrl]);

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
          {source ? (
            <span className="ms-2 text-muted" style={{ fontSize: "0.85rem" }}>
              ({source})
            </span>
          ) : null}
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
          {goldSource ? (
            <span className="ms-2 text-muted" style={{ fontSize: "0.85rem" }}>
              ({goldSource})
            </span>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Rates;

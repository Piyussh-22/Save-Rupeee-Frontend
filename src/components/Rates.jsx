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
    <div className="mb-4 flex h-[60px] items-center justify-between gap-[10%] rounded-[10px] bg-[#434a55] px-[5%]">
      <div className="flex h-[80%] w-[42.5%] items-center justify-center rounded-full bg-[#d9eafd] text-center font-medium text-[#003366] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <span>1 USD :</span>
          {error ? (
            <span className="ml-2 text-red-600">{error}</span>
          ) : usdToInr ? (
            <span className="ml-2">₹{usdToInr}</span>
          ) : (
            <span className="ml-2">Loading...</span>
          )}
      </div>
      <div className="flex h-[80%] w-[42.5%] items-center justify-center rounded-full bg-[#d9eafd] text-center font-medium text-[#003366] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <span>10g Gold :</span>
          {error ? (
            <span className="ml-2 text-red-600">{error}</span>
          ) : goldRate ? (
            <span className="ml-2">₹{goldRate}</span>
          ) : (
            <span className="ml-2">Loading...</span>
          )}
      </div>
    </div>
  );
}

export default Rates;

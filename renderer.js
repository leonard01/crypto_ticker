const axios = require("axios");

const API_URL = "https://api.binance.com/api/v3/ticker/24hr";
const PAIRS = ["BTCUSDT", "ETHUSDT"];
const previousPrices = {};

async function fetchPrices() {
  try {
    const response = await axios.get(API_URL);
    const filtered = response.data.filter((ticker) =>
      PAIRS.includes(ticker.symbol)
    );

    let html = "";
    filtered.forEach((ticker) => {
      const price = parseFloat(ticker.lastPrice).toLocaleString();
      const change24h = parseFloat(ticker.priceChangePercent).toFixed(2);

      // Determine live delta
      const prevPrice = previousPrices[ticker.symbol];
      let liveArrow = "→";
      let liveClass = "";
      if (prevPrice !== undefined) {
        if (price > prevPrice) {
          liveArrow = "↑";
          liveClass = "up";
        } else if (price < prevPrice) {
          liveArrow = "↓";
          liveClass = "down";
        }
      }
      previousPrices[ticker.symbol] = price;

      // 24h change symbol
      const changeClass = change24h >= 0 ? "up" : "down";
      const changeSymbol = change24h >= 0 ? `▲` : `▼`;

      html += `
        <div class="coin">
          <strong>${ticker.symbol}</strong>: 
          <span class="${liveClass}">${price} ${liveArrow}</span> 
          <span class="${changeClass}">${changeSymbol} ${change24h}%</span>
        </div>
      `;
    });

    document.getElementById("ticker").innerHTML = html;
  } catch (err) {
    console.error("Error fetching prices:", err);
  }
}

// Update every 5 seconds
setInterval(fetchPrices, 5000);
fetchPrices();

import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const COINS = ["bitcoin", "ethereum"];
const CURRENCY = "usd";

async function fetchPrices() {
  try {
    const response = await axios.get(API_URL, {
      params: {
        ids: COINS.join(","),
        vs_currencies: CURRENCY,
      },
    });

    const prices = response.data;
    console.clear();
    console.log("📈 Crypto Ticker:");
    COINS.forEach((coin) => {
      console.log(`${coin.toUpperCase()}: $${prices[coin][CURRENCY]}`);
    });
} catch (error: any) {
  console.error("❌ Error fetching prices:", error.message);
}
}

// Update every 10 seconds
setInterval(fetchPrices, 10_000);
fetchPrices(); // Initial call

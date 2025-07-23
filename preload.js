const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload loaded");

contextBridge.exposeInMainWorld("electronAPI", {
  hideHeader: () => ipcRenderer.send("header-hide"),
  fetchPrices: async () => {
    const API_URL = "https://api.binance.com/api/v3/ticker/24hr";
    const COINS = ["BTCUSDT", "ETHUSDT"];
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("✅ Real prices fetched");
      return data.filter((ticker) => COINS.includes(ticker.symbol));
    } catch (err) {
      console.error("❌ Failed to fetch prices:", err);
      throw err;
    }
  },
});

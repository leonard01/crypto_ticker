const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchPrices: async () => {
    const API_URL = "https://api.binance.com/api/v3/ticker/24hr";
    const COINS = ["BTCUSDT", "ETHUSDT"];
    try {
      const response = await fetch(API_URL);
      return (await response.json()).filter(ticker => COINS.includes(ticker.symbol));
    } catch (err) {
      console.error("❌ fetchPrices failed", err);
      throw err;
    }
  }
});

ipcRenderer.on("measure-content", () => {
  const contentHeight = document.body.scrollHeight;
  ipcRenderer.send("content-height", contentHeight);
});

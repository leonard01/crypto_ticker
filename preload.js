const { ipcRenderer, contextBridge } = require("electron");

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
  },
  dragWindow: (newPos) => {
    if (newPos && typeof newPos.x === "number" && typeof newPos.y === "number") {
      ipcRenderer.send("drag-window", newPos);
    } else {
      console.error("❌ Invalid drag position:", newPos);
    }
  }
});

import axios from "axios";
import chalk from "chalk";
import Table from "cli-table3";

const API_URL = "https://api.binance.com/api/v3/ticker/24hr";
const PAIRS = ["BTCUSDT", "ETHUSDT"];

interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

const previousPrices: Record<string, number> = {};

async function fetchPrices() {
  try {
    const response = await axios.get<TickerData[]>(API_URL);

    const filtered = response.data.filter((ticker) =>
      PAIRS.includes(ticker.symbol)
    );

    // Create a nice table
    const table = new Table({
      head: [
        chalk.whiteBright("PAIR"),
        chalk.whiteBright("PRICE"),
        chalk.whiteBright("LIVE"),
        chalk.whiteBright("24H CHANGE"),
      ],
      colWidths: [12, 18, 8, 15],
    });

    filtered.forEach((ticker) => {
      const price = parseFloat(ticker.lastPrice);
      const change24h = parseFloat(ticker.priceChangePercent);

      // Determine live delta
      const previousPrice = previousPrices[ticker.symbol];
      let liveDelta = chalk.gray("→");
      if (previousPrice !== undefined) {
        liveDelta =
          price > previousPrice
            ? chalk.green("↑")
            : price < previousPrice
            ? chalk.red("↓")
            : chalk.gray("→");
      }
      previousPrices[ticker.symbol] = price;

      // 24h change symbol
      const change24hSymbol =
        change24h >= 0
          ? chalk.green(`▲ ${change24h.toFixed(2)}%`)
          : chalk.red(`▼ ${change24h.toFixed(2)}%`);

      // Add row to table
      table.push([
        chalk.yellowBright(ticker.symbol),
        `$${price.toLocaleString()}`,
        liveDelta,
        change24hSymbol,
      ]);
    });

    console.clear();
    console.log(chalk.blueBright("📈 Binance Crypto Ticker"));
    console.log(table.toString());
  } catch (error: any) {
    console.error(chalk.red("❌ Error fetching prices:"), error.message);
  }
}

// Update every 5 seconds
setInterval(fetchPrices, 5_000);
fetchPrices();

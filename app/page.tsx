"use client";

import { useState, useEffect } from "react";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [globalData, setGlobalData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Global market data
        const globalRes = await fetch("https://api.coingecko.com/api/v3/global");
        const global = await globalRes.json();
        setGlobalData(global.data);

        // Top 100 coins
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const formatMarketCap = (cap: number) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD", 
      notation: "compact",
      maximumFractionDigits: 2 
    }).format(cap);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-2xl text-white">Loading live crypto data from CoinGecko...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl font-bold">TC</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">TokenCap</h1>
              <p className="text-xs text-gray-400 -mt-1">Live Token Market Caps</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search tokens (Bitcoin, ETH...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-700 rounded-full px-5 py-3 w-96 focus:outline-none focus:border-green-500 placeholder-gray-500"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Global Stats */}
        {globalData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400 text-sm">Total Market Cap</p>
              <p className="text-4xl font-semibold mt-2">
                ${globalData.total_market_cap?.usd?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400 text-sm">24h Volume</p>
              <p className="text-4xl font-semibold mt-2">
                ${globalData.total_volume?.usd?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
              <p className="text-gray-400 text-sm">BTC Dominance</p>
              <p className="text-4xl font-semibold mt-2">
                {globalData.market_cap_percentage?.btc?.toFixed(1) || "N/A"}%
              </p>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="px-8 py-5 font-normal w-12">#</th>
                  <th className="px-4 py-5 font-normal">Coin</th>
                  <th className="px-4 py-5 font-normal text-right">Price</th>
                  <th className="px-4 py-5 font-normal text-right">24h Change</th>
                  <th className="px-4 py-5 font-normal text-right">Market Cap</th>
                  <th className="px-4 py-5 font-normal text-right">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin) => (
                    <tr key={coin.id} className="table-row border-b border-gray-800 hover:bg-[#252525] transition-colors">
                      <td className="px-8 py-6 text-gray-400 font-mono">{coin.market_cap_rank}</td>
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-4">
                          <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
                          <div>
                            <div className="font-semibold">{coin.name}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-right font-mono text-lg">
                        ${coin.current_price.toLocaleString()}
                      </td>
                      <td className={`px-4 py-6 text-right font-semibold ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : "0.00"}%
                      </td>
                      <td className="px-4 py-6 text-right font-mono">
                        {formatMarketCap(coin.market_cap)}
                      </td>
                      <td className="px-4 py-6 text-right font-mono text-gray-400">
                        ${coin.total_volume.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-gray-400">
                      No tokens found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          Live data from CoinGecko • Refreshes every 60 seconds • Built with Grok
        </div>
      </div>
    </div>
  );
}

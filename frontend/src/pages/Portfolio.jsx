import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import useFetchDetails from '../hooks/useFetchDetails';

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return false;
      }

      const response = await axios.get('https://stock-backend-production-1815.up.railway.app/auth/portfolio', {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status !== 201) {
        navigate('/login');
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      navigate('/login');
      return false;
    }
  };

  const displayPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      const response = await axios.post('https://stock-backend-production-1815.up.railway.app/portfolio/getStocks', {
        user_id: userId
      }, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status === 200) {
        const formattedData = response.data.map(item => ({
          id: item.id || item._id,
          name: item.asset_name || item.name || 'Unknown Asset',
          symbol: item.asset_symbol || '',
          quantity: parseFloat(item.quantity) || 0,
          avg_price: parseFloat(item.average_price) || 0
        }));
        setPortfolio(formattedData);
      } else {
        setError("No portfolio data available");
        setPortfolio([]);
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Failed to load portfolio data or no assets found.");
      toast.error("Failed to load portfolio data. Please try again.");
      setPortfolio([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const authSuccess = await fetchPortfolio();
      if (authSuccess) {
        await displayPortfolio();
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Portfolio</h1>
          {loading ? (
            <div className="text-center py-8">Loading portfolio data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="bg-white p-6 shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 rounded-t-lg">
                    <th className="p-3 rounded-tl-lg"></th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Symbol</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Avg. Price</th>
                    <th className="p-3">Current Price</th>
                    <th className="p-3">Profit/Loss</th>
                    <th className="p-3 rounded-tr-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.length > 0 ? (
                    portfolio.map((asset, index) => (
                      <AssetRow key={asset.id || `asset-${index}`} asset={asset} index={index} refreshPortfolio={displayPortfolio} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        No assets in your portfolio
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const AssetRow = ({ asset, index, refreshPortfolio }) => {
  const { currency, isError, isLoading, coin } = useFetchDetails(asset.symbol);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState(1);

  if (!asset) return null;

  const currentPrice = coin?.market_data?.current_price?.usd || 0;
  const profitLoss = ((currentPrice - (asset.avg_price || 0)) * (asset.quantity || 0)).toFixed(2);
  const symbol = asset.symbol ? asset.symbol : 'N/A';

  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  const handleSellClick = () => {
    setIsSellModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero!");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post("https://stock-backend-production-1815.up.railway.app/portfolio/buy", {
        user_id: localStorage.getItem("userId"),
        asset_symbol: asset.symbol,
        asset_name: asset.name,
        quantity,
        price: currentPrice,
      });

      if (response.status === 200) {
        toast.success("Purchase successful!");
        setIsModalOpen(false);
        setQuantity(1);
        await refreshPortfolio(); // ✅ Refresh
      } else {
        toast.error("Purchase failed. Try again.");
      }
    } catch (error) {
      console.error("Error buying asset:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setIsProcessing(false);
  };

  const handleConfirmSell = async () => {
    if (sellQuantity <= 0) {
      toast.error("Quantity must be greater than zero!");
      return;
    }

    if (sellQuantity > asset.quantity) {
      toast.error("You cannot sell more than you own!");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post("https://stock-backend-production-1815.up.railway.app/portfolio/sell", {
        user_id: localStorage.getItem("userId"),
        asset_symbol: asset.symbol,
        quantity: sellQuantity,
        price: currentPrice,
      });

      if (response.status === 200) {
        toast.success("Sell successful!");
        setIsSellModalOpen(false);
        setSellQuantity(1);
        await refreshPortfolio(); // ✅ Refresh
      } else {
        toast.error("Sell failed. Try again.");
      }
    } catch (error) {
      console.error("Error selling asset:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <tr className={`font-semibold border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-50`}>
        <td className="p-3 flex items-center justify-center">
          {coin?.image?.large ? (
            <img src={coin.image.large} alt={symbol} className="w-10 h-10" />
          ) : (
            <div className="w-15 h-15 bg-gray-200 rounded-full"></div>
          )}
        </td>
        <td className="p-3">{asset.name || 'N/A'}</td>
        <td className="p-3">{symbol}</td>
        <td className="p-3">{asset.quantity.toFixed(8)}</td>
        <td className="p-3">${(asset.avg_price || 0).toFixed(2)}</td>
        <td className="p-3">{isLoading ? "Loading..." : `$${currentPrice.toFixed(2)}`}</td>
        <td className={`p-3 ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
          ${profitLoss}
        </td>
        <td className="p-3 flex gap-2">
          <button onClick={handleBuyClick} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Buy
          </button>
          <button onClick={handleSellClick} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
            Sell
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Purchase</h2>
            <div className="flex items-center mb-4">
              <img src={coin?.image?.large} alt={asset.name} className="w-10 h-10 mr-2" />
              <span>{asset.name}</span>
            </div>
            <label className="block text-gray-700 font-medium mb-2">Enter Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-3 py-1 bg-gray-400 text-white rounded-md mr-2">
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing || quantity < 1}
                className={`px-3 py-1 rounded-md ${isProcessing || quantity < 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                {isProcessing ? "Processing..." : "Confirm Buy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSellModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Sell</h2>
            <div className="flex items-center mb-4">
              <img src={coin?.image?.large} alt={asset.name} className="w-10 h-10 mr-2" />
              <span>{asset.name}</span>
            </div>
            <label className="block text-gray-700 font-medium mb-2">Enter Quantity:</label>
            <input
              type="number"
              min="1"
              max={asset.quantity}
              value={sellQuantity}
              onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {sellQuantity > asset.quantity && (
              <p className="text-red-600 text-sm mt-1">Cannot sell more than owned quantity ({asset.quantity.toFixed(8)})</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSell}
                disabled={isProcessing || sellQuantity < 1 || sellQuantity > asset.quantity}
                className={`px-3 py-1 rounded-md ${isProcessing || sellQuantity < 1 || sellQuantity > asset.quantity
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"}`}
              >
                {isProcessing ? "Processing..." : "Confirm Sell"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;

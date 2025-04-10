import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        return;
      }
      
      const response = await axios.get('http://localhost:3000/auth/portfolio', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status !== 201) {
        navigate('/login');
      }
      return true;
    } catch (err) {
      navigate('/login');
      console.log(err);
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
      
      const response = await axios.post('http://localhost:3000/portfolio/getStocks', {
        user_id: userId
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        // Ensure the data is properly formatted
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
      setError("Failed to load portfolio data");
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
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Your Portfolio</h1>
          <p className="text-xl text-slate-600 mb-8">Track your investments, analyze performance, and make informed decisions.</p>
          
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
                    <th className="p-3 rounded-tr-lg">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.length > 0 ? (
                    portfolio.map((asset, index) => (
                      <AssetRow key={asset.id || `asset-${index}`} asset={asset} index={index}/>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
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

const AssetRow = ({ asset,index }) => {
  const { currency, isError, isLoading, coin } = useFetchDetails(asset.symbol);
  
  if (!asset) return null;
  
  const currentPrice = coin?.market_data?.current_price?.usd || 0;
  const profitLoss = ((currentPrice - (asset.avg_price || 0)) * (asset.quantity || 0)).toFixed(2);
  const symbol = asset.symbol ? asset.symbol:'N/A';
  
  return (
    <tr className={`font-semibold border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-50`}>
      <td className="p-3">
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
      <td className="p-3">
        {isLoading ? "Loading..." : `$${currentPrice.toFixed(2)}`}
      </td>
      <td className={`p-3 ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
        ${profitLoss}
      </td>
    </tr>
  );
};

export default Portfolio;
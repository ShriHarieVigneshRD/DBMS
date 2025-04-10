import axios from 'axios';
import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useFetchDetails from '../hooks/useFetchDetails';
import { toast,ToastContainer } from 'react-toastify';

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://stock-backend-production-1815.up.railway.app/auth/watchlist', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status !== 201) {
        navigate('/login');
        return false;
      }
      return true;
    } catch (err) {
      navigate('/login');
      console.log(err);
      return false;
    }
  };

  const displayWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      const response = await axios.post('https://stock-backend-production-1815.up.railway.app/watchlist/get', {
        user_id: userId
      }, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status === 200) {
        const formattedData = response.data.map(item => ({
          id: item.id || item._id,
          name: item.asset_name || item.name || 'Unknown Asset',
          symbol: item.asset_symbol || '',
        }));
        setWatchlist(formattedData);
      } else {
        setError("No watchlist data available");
        setWatchlist([]);
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      toast.error("Failed to load watchlist data or no watchlist data available");
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      const loadData = async () => {
        const authSuccess = await fetchUser();
        if (authSuccess) {
          await displayWatchlist();
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
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Watchlist Data
          </h1>

          {loading ? (
            <div className="text-center py-8">Loading watchlist data...</div>
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
                    <th className="p-3">Current Price</th>
                    <th className="p-3">24H Change</th>
                    <th className="p-3 rounded-tr-lg"></th>                  
                  </tr>
                </thead>
                <tbody>
                  {watchlist.length > 0 ? (
                    watchlist.map((asset, index) => (
                      <AssetRow key={asset.id || `asset-${index}`} asset={asset} index={index} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        No assets in your watchlist
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

const AssetRow = ({ asset, index }) => {
  const { currency, isError, isLoading, coin } = useFetchDetails(asset.symbol);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!asset) return null;

  const currentPrice = coin?.market_data?.current_price?.usd || 0;
  const priceChange = coin?.market_data?.price_change_percentage_24h || 0;
  const symbol = asset.symbol ? asset.symbol : 'N/A';

  const handleRemoveClick = () => {
    setIsModalOpen(true);
  };

  
  const handleConfirmRemove = async () => {
      
    setIsProcessing(true);
    try {
      const response = await axios.post("https://stock-backend-production-1815.up.railway.app/watchlist/delete", {
        user_id: localStorage.getItem("userId"),
        asset_symbol: asset.symbol,
      });
  
      if (response.status === 200) {
        toast.success("Removed From watchlist successfully!");
        setIsModalOpen(false);
      } else {
        toast.error("Failed. Try again.");
      }
    } catch (error) {
      console.error("Error removing asset from watchlist:", error);
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
        <td className="p-3">{isLoading ? "Loading..." : `$${currentPrice.toFixed(2)}`}</td>
        <td className={`p-3 ${priceChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {isLoading ? "Loading..." : `${priceChange.toFixed(2)}%`}
        </td>
        <td className="p-3 flex gap-2">
          <button onClick={handleRemoveClick} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            - WatchList
          </button>
        </td>
      </tr>

      {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Confirm Remove</h2>
          <p className="mb-4">Are you sure you want to remove {asset.name} from your watchlist?</p>
          <div className="flex items-center mb-4">
            <img src={coin?.image?.large} alt={asset.name} className="w-10 h-10 mr-2" />
            <span>{asset.name}</span>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="px-3 py-1 bg-gray-400 text-white rounded-md mr-2"
            >
              Cancel
            </button>

            <button 
              onClick={handleConfirmRemove} 
              disabled={isProcessing } 
              className={`px-3 py-1 rounded-md ${isProcessing ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
            >
              {isProcessing ? "Processing..." : "Confirm Remove"}
            </button>
          </div>
        </div>
      </div>
    )}
    
    </>
  );
};

export default Watchlist;

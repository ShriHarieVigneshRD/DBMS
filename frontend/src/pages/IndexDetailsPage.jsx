import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import useFetchDetails from '../hooks/useFetchDetails';
import Button from '../components/Button'; 
import LineIndexContainer from '../components/LineIndex/LineIndexContainer';
import CandleIndexContainer from '../components/CandleIndex/CandleIndexContainer';


const IndexDetailsPage = () => {
  const navigate = useNavigate();
  const { indexId } = useParams();
  const [isCandleStick, setIsCandleStick] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { currency, isError, isLoading: isFetching, coin } = useFetchDetails(indexId);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://stock-backend-production-1815.up.railway.app/auth/details/${indexId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [indexId]);

  if (isFetching) {
    return <div className="text-center text-blue-500 font-semibold text-lg">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 font-semibold text-lg">Error: Something went wrong</div>;
  }

  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://stock-backend-production-1815.up.railway.app/portfolio/buy', {
        user_id: localStorage.getItem("userId"),
        asset_symbol: indexId,
        asset_name: coin.name,
        quantity,
        price: coin?.market_data?.current_price[currency],
      });
      
      if (response.status === 200) {
        toast.success("Purchase successful!");
        setIsModalOpen(false);
        setQuantity(1);
      } else {
        toast.error("Purchase failed. Try again.");
      }
    } catch (error) {
      console.error("Error buying asset:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  const handleWatchListClick = async () => {
    try {
      const response = await axios.post('https://stock-backend-production-1815.up.railway.app/watchlist/add', {
        user_id: localStorage.getItem("userId"),
        asset_symbol: indexId,
        asset_name: coin.name,
      });
      if(response.status === 200) {
        toast.success("Added to WatchList!");
      }
      else {
        toast.error("Failed to add to WatchList. Try again.");
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row pt-22 px-6">
        <div className="md:w-1/3 w-full flex flex-col items-start mt-6 md:mt-0 bg-white shadow-md rounded-xl p-6 border border-gray-200">
        {coin?.image?.large && coin?.name && (
            <div className="flex items-center space-x-4 mb-6">
              <img src={coin.image.large} alt={coin.name} className="w-24 h-24 object-contain rounded-full shadow-sm" />
              <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">{coin.name}</h1>
            </div>
          )}
          {/* Market Details with Alternating Row Colors */}
          <div className="w-full rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-white px-4 py-3 flex justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Rank</h2>
              <span className="text-lg font-medium">{coin?.market_cap_rank}</span>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Current Price</h2>
              <span className="text-lg font-medium">
                {coin?.market_data?.current_price[currency]}
              </span>
            </div>
            <div className="bg-white px-4 py-3 flex justify-between">
              <h2 className="text-lg font-semibold text-gray-700">24h Change</h2>
              <span className="text-lg font-medium">
                {coin?.market_data?.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Volume</h2>
              <span className="text-lg font-medium">
                {coin?.market_data?.total_volume[currency]}
              </span>
            </div>
            <div className="bg-white px-4 py-3 flex justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Market Cap</h2>
              <span className="text-lg font-medium">
                {coin?.market_data?.market_cap[currency]}
              </span>
            </div>
          </div>

          <div className="flex space-x-4 mt-6 w-full justify-center">
            <Button onClick={handleBuyClick} className="w-1/2">Buy</Button>
            <Button onClick={handleWatchListClick} className="w-1/2">+ WatchList</Button>
          </div>
        </div>

        <div className="md:w-2/3 w-full px-6">
          <div className='flex justify-center'>
            <Button onClick={() => setIsCandleStick(!isCandleStick)}>
              {isCandleStick ? 'Switch to Candlestick Chart' : 'Switch to Line Chart'}
            </Button>
          </div>
          {isCandleStick ? (
            <LineIndexContainer coinId={indexId} />
          ) : (
            <CandleIndexContainer coinId={indexId} />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Confirm Buy</h2>
            <div>
              <img src={coin?.image?.large} alt={coin.name} className="w-10 h-10 mr-2" />
              <span className="text-lg font-semibold">{coin.name}</span>
            </div>
            <label className="block mb-2 font-medium">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              min="1"
            />
            <p className="text-gray-600 mb-4">Total Price: <strong>{(quantity * coin?.market_data?.current_price[currency]).toFixed(2)}</strong></p>
            <div className="flex justify-between">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
              <button onClick={handleConfirmPurchase} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" disabled={isLoading}>{isLoading ? "Processing..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexDetailsPage;


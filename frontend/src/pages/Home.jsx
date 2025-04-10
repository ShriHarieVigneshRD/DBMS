import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import useFetchDetails from '../hooks/useFetchDetails';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://stock-backend-production-1815.up.railway.app/auth/home', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 201) {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch live market data
  const bitcoin = useFetchDetails('bitcoin');
  const ethereum = useFetchDetails('ethereum');
  const tether = useFetchDetails('tether');
  const xrp = useFetchDetails('ripple');

  const getColor = (percentage) => {
    if (percentage >= 0) return "text-emerald-500";
    return "text-red-500";
  };

  const getChangeColor = (percentage) => {
    if (percentage >= 0) return "text-emerald-600";
    return "text-red-600";
  };

  const getIcon = (percentage) => {
    return percentage >= 0 ? TrendingUp : TrendingDown;
  };

  const handleCardClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Centered Search Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Track Your Investments in Real Time
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl">
              Get real-time stock market data, track your portfolio, and make informed investment decisions.
            </p>
            <SearchBar />
          </div>

          {/* Market Data Section */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-[23%] min-w-[250px]">
              <Card
                title="Bitcoin"
                subtitle="BTC"
                imgLogo={bitcoin.isLoading ? "" : bitcoin.coin?.image?.large}
                value={bitcoin.isLoading ? "Loading..." : `$${bitcoin.coin?.market_data?.current_price?.usd}`}
                change={bitcoin.isLoading ? "..." : `${bitcoin.coin?.market_data?.price_change_24h?.toFixed(2)}`}
                icon={getIcon(bitcoin.coin?.market_data?.price_change_percentage_24h)}
                iconColor={getColor(bitcoin.coin?.market_data?.price_change_percentage_24h)}
                changeColor={getChangeColor(bitcoin.coin?.market_data?.price_change_percentage_24h)}
                volume={bitcoin.isLoading ? "..." : `${bitcoin.coin?.market_data?.total_volume?.usd}M`}
                onClick = {() => handleCardClick('bitcoin')}
              />
            </div>

            <div className="w-[23%] min-w-[250px]">
              <Card
                title="Ethereum"
                subtitle="ETH"
                imgLogo={bitcoin.isLoading ? "" : ethereum.coin?.image?.large}
                value={ethereum.isLoading ? "Loading..." : `$${ethereum.coin?.market_data?.current_price?.usd}`}
                change={ethereum.isLoading ? "..." : `${ethereum.coin?.market_data?.price_change_24h?.toFixed(2)}`}
                icon={getIcon(ethereum.coin?.market_data?.price_change_percentage_24h)}
                iconColor={getColor(ethereum.coin?.market_data?.price_change_percentage_24h)}
                changeColor={getChangeColor(ethereum.coin?.market_data?.price_change_percentage_24h)}
                volume={ethereum.isLoading ? "..." : `${ethereum.coin?.market_data?.total_volume?.usd}M`}
                onClick = {() => handleCardClick('ethereum')}
              />
            </div>

            <div className="w-[23%] min-w-[250px]">
              <Card
                title="Tether"
                subtitle="USDT"
                imgLogo={bitcoin.isLoading ? "" : tether.coin?.image?.large}
                value={tether.isLoading ? "Loading..." : `$${tether.coin?.market_data?.current_price?.usd}`}
                change={tether.isLoading ? "..." : `${tether.coin?.market_data?.price_change_24h?.toFixed(2)}`}
                icon={getIcon(tether.coin?.market_data?.price_change_percentage_24h)}
                iconColor={getColor(tether.coin?.market_data?.price_change_percentage_24h)}
                changeColor={getChangeColor(tether.coin?.market_data?.price_change_percentage_24h)}
                volume={tether.isLoading ? "..." : `${tether.coin?.market_data?.total_volume?.usd}M`}
                onClick = {() => handleCardClick('tether')}
              />
            </div>

            <div className="w-[23%] min-w-[250px]">
              <Card
                title="XRP"
                subtitle="XRP"
                imgLogo={bitcoin.isLoading ? "" : xrp.coin?.image?.large}
                value={xrp.isLoading ? "Loading..." : `$${xrp.coin?.market_data?.current_price?.usd}`}
                change={xrp.isLoading ? "..." : `${xrp.coin?.market_data?.price_change_24h?.toFixed(2)}`}
                icon={getIcon(xrp.coin?.market_data?.price_change_percentage_24h)}
                iconColor={getColor(xrp.coin?.market_data?.price_change_percentage_24h)}
                changeColor={getChangeColor(xrp.coin?.market_data?.price_change_percentage_24h)}
                volume={xrp.isLoading ? "..." : `${xrp.coin?.market_data?.total_volume?.usd}M`}
                onClick = {() => handleCardClick('ripple')}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

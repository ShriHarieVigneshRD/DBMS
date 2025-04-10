import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchTable } from '../services/fetchTable.js';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch coin data when searchQuery changes
  useEffect(() => {
    const fetchCoins = async () => {
      if (!searchQuery.trim()) {
        setCoins([]);
        return;
      }

      setIsLoading(true);
      try {
        const coinsData = await fetchTable(1, 'usd'); // Fetch first page with USD currency
        const filteredCoins = coinsData.filter(coin =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setCoins(filteredCoins);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
      setIsLoading(false);
    };

    // Debounce API call
    const timer = setTimeout(() => {
      fetchCoins();
    }, 300); // Delays execution by 300ms to reduce API calls

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle selection of a coin
  const handleSelect = (coinId) => {
    navigate(`/details/${coinId}`);
    setSearchQuery(''); // Clear search bar after navigation
  };

  return (
    <div className="relative max-w-2xl w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search cryptocurrencies..."
        className="w-full px-4 py-4 pl-12 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 text-lg"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
      {isLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Loading...</div>}

      {/* Autocomplete Dropdown */}
      {searchQuery && coins.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-md mt-2 z-50">
          {coins.map((coin) => (
            <li
              key={coin.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSelect(coin.id)}
            >
              <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
              {coin.name} ({coin.symbol.toUpperCase()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

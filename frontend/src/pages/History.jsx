import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return false;
      }

      const response = await axios.get('https://stock-backend-production-1815.up.railway.app/auth/history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 201) {
        navigate('/login');
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  const displayTransaction = async (sort = 'DESC', filter = 'ALL') => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'https://stock-backend-production-1815.up.railway.app/portfolio/transactions',
        { user_id: userId, sort, filter },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const formattedData = response.data.map((item) => ({
          id: item.id || item._id,
          assetName: item.asset_name,
          assetSymbol: item.asset_symbol,
          type: item.transaction_type,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
          date: new Date(item.transaction_date),
        }));

        setTransactions(formattedData);
      } else {
        setError('No transaction data available');
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError('Failed to load transaction history.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const authSuccess = await fetchHistory();
      if (authSuccess) {
        await displayTransaction();
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Transaction History</h1>
          <p className="text-lg text-gray-600 mb-8">View your recent buy/sell transactions.</p>

          {/* ✅ Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => displayTransaction('DESC', 'BUY')}
              className="px-5.5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Show Buy
            </button>
            <button
              onClick={() => displayTransaction('DESC', 'SELL')}
              className="px-5.5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Show Sell
            </button>
            <button
              onClick={() => displayTransaction('ASC', 'ALL')}
              className="px-2.5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ascending Date
            </button>
            <button
              onClick={() => displayTransaction('DESC', 'ALL')}
              className="px-10 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
             All
            </button>
          </div>

          {/* ✅ Loading and Error */}
          {loading && <p className="text-gray-600">Loading history...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* ✅ Table */}
          {!loading && !error && transactions.length > 0 && (
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr className="text-base font-semibold text-gray-800">
                    <th className="px-6 py-4 text-center">Asset</th>
                    <th className="px-6 py-4 text-center">Symbol</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    <th className="px-6 py-4 text-center">Quantity</th>
                    <th className="px-6 py-4 text-center">Price</th>
                    <th className="px-6 py-4 text-center">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr
                      key={tx.id}
                      className={`text-base font-medium text-gray-700 border-b border-gray-300 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">{tx.assetName}</td>
                      <td className="px-6 py-4">{tx.assetSymbol}</td>
                      <td className="px-6 py-4">{tx.type}</td>
                      <td className="px-6 py-4">{tx.quantity.toFixed(8)}</td>
                      <td className="px-6 py-4">${tx.price.toFixed(2)}</td>
                      <td className="px-6 py-4">{tx.date.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ Empty */}
          {!loading && !error && transactions.length === 0 && (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;

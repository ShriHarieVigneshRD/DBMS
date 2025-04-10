import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import IndexTable from '../components/IndexTable';

const Stockindices = () => {
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://stock-backend-production-1815.up.railway.app/auth/stockindices', {
        headers: {
          "Authorization": `Bearer ${token}`
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Global Stock Indices
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Stay updated with real-time cryptocurrencies.
          </p>

          {/* Stock Indices Content Placeholder */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <IndexTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stockindices;

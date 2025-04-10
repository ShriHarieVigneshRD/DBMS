import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Logo from './Logo';
import Button from './Button';
import { LogOut } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();

    const handleLogout = async () => {
      try {
          const token = localStorage.getItem('token');
          await axios.post('https://stock-backend-production-1815.up.railway.app/auth/logout', {}, {
              headers: { "Authorization": `Bearer ${token}` }
          });

          // Remove token and redirect
          localStorage.removeItem('token');
          navigate('/login');
      } catch (error) {
          console.error("Logout failed:", error);
      }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-900 to-indigo-800 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22">
          <Logo />
          
          <div className="flex items-center gap-1">
          <Button variant="secondary" onClick={() => navigate('/profile')}>Profile</Button>
            <Button variant="secondary" onClick={() => navigate('/portfolio')}>Portfolio</Button>
            <Button variant="secondary" onClick={() => navigate('/watchlist')}>Watchlist</Button>
            <Button variant="secondary" onClick={() => navigate('/stockindices')}>Indices</Button>
            <Button variant="secondary" onClick={() => navigate('/history')}>History</Button>
            <Button variant="secondary" onClick={() => navigate('/about')}>About</Button>
            <div className="h-6 w-px bg-indigo-700 mx-2"></div>
            <Button 
              variant="primary"
              onClick={() => handleLogout()}
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

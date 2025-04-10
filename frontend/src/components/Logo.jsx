import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/imhage.png'; 

function Logo() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1">
      <img src={logo} alt="StockZilla Logo" width={150} height={150} />
      <span 
        className="text-3xl font-bold text-white cursor-pointer"
        onClick={() => navigate('/')}
      >
        ZenCrypto
      </span>
    </div>
  );
}

export default Logo;

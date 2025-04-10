import React from 'react';

function Button({ children, variant = 'primary', onClick }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm",
    secondary: "bg-indigo-800/40 text-indigo-100 hover:bg-indigo-500/60"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
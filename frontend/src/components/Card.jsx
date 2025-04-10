import React from 'react';

function Card({
  title,
  subtitle,
  value,
  change,
  imgLogo,
  icon: Icon,
  iconColor,
  changeColor,
  volume,
  gradient = false,
  onClick
}) {
  const baseClasses = "p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow";
  const bgClasses = gradient ? "bg-gradient-to-br from-indigo-50 to-white" : "bg-white";

  return (
    <div className={`${baseClasses} ${bgClasses} cursor-pointer`} onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        {/* Image on the left */}
        <img src={imgLogo} alt={title} className="h-8 w-8 object-contain" />

        {/* Title and subtitle in center */}
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>

      <p className="text-2xl font-bold text-slate-900 mb-2 text-center">{value}</p>
      <p className={`text-sm font-medium text-center ${changeColor}`}>{change}</p>
      {volume && <p className="text-sm text-slate-500 mt-2 text-center">Vol: {volume}</p>}
    </div>
  );
}

export default Card;

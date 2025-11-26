import React from 'react';

const SimpleBarChart = ({ data, title, valueKey, labelKey, colorClass = 'from-emerald-500 to-emerald-600' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-emerald-200/60 py-8">
        No hay datos para mostrar
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => parseFloat(item[valueKey]) || 0));

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => {
          const value = parseFloat(item[valueKey]) || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const label = item[labelKey] || `Item ${index + 1}`;

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium truncate max-w-[60%]">
                  {label}
                </span>
                <span className="text-emerald-200 font-semibold">
                  {value.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-xs text-white font-bold">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleBarChart;

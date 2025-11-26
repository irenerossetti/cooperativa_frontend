import React from 'react';
import { Check } from 'lucide-react';

const ColumnSelector = ({ columns, selectedColumns, onToggle, onSelectAll, onDeselectAll }) => {
  const allSelected = selectedColumns.length === columns.length;
  const someSelected = selectedColumns.length > 0 && selectedColumns.length < columns.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-white font-medium">Seleccionar Columnas</h4>
        <div className="flex space-x-2">
          <button
            onClick={onSelectAll}
            className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded transition-colors"
          >
            Todas
          </button>
          <button
            onClick={onDeselectAll}
            className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded transition-colors"
          >
            Ninguna
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
        {columns.map((column) => {
          const isSelected = selectedColumns.includes(column.key);
          
          return (
            <button
              key={column.key}
              onClick={() => onToggle(column.key)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-white'
                  : 'bg-white/5 border-white/10 text-emerald-200/60 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-white/30'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium">{column.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-sm text-emerald-200/60">
        {selectedColumns.length} de {columns.length} columnas seleccionadas
      </div>
    </div>
  );
};

export default ColumnSelector;

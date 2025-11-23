import React from 'react';
import { Construction } from 'lucide-react';

const PagePlaceholder = ({ title, description, icon: Icon }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          {Icon && (
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
            <p className="text-emerald-200/80">{description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Construction className="w-10 h-10 text-emerald-300" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Módulo en Desarrollo</h2>
          <p className="text-emerald-200/60 max-w-md mx-auto">
            Esta funcionalidad está siendo desarrollada y estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PagePlaceholder;

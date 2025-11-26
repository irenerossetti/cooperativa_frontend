import React from 'react';
import { Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OrganizationSelector = () => {
  const { currentOrganization, changeOrganization, user } = useAuth();
  
  // No mostrar nada si no hay usuario
  if (!user) {
    return null;
  }

  // Organizaciones disponibles
  const organizations = [
    { subdomain: 'sanjuan', name: 'Cooperativa San Juan' },
    { subdomain: 'progreso', name: 'Cooperativa El Progreso' },
    { subdomain: 'demo', name: 'Cooperativa Demo' },
  ];

  // Obtener nombre de la organización actual
  const currentOrgName = organizations.find(org => org.subdomain === currentOrganization)?.name || 'Cooperativa';
  
  // Si es ADMIN, mostrar selector
  const isAdmin = user.role?.name === 'ADMIN';
  
  if (isAdmin) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
        <Building2 className="w-4 h-4 text-white" />
        <select
          value={currentOrganization}
          onChange={(e) => changeOrganization(e.target.value)}
          className="bg-transparent text-white text-sm font-medium border-none outline-none cursor-pointer"
        >
          {organizations.map((org) => (
            <option key={org.subdomain} value={org.subdomain} className="text-gray-900">
              {org.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // Si NO es admin, solo mostrar el nombre (sin selector)
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
      <Building2 className="w-4 h-4 text-white" />
      <span className="text-white text-sm font-medium">
        {currentOrgName}
      </span>
    </div>
  );
};

export default OrganizationSelector;

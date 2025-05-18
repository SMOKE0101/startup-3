import { Building, Users } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Calculate status based on units and tenants
  const getStatusBadge = (property: Property) => {
    const vacancies = property.totalUnits - property.activeTenantsCount;
    
    if (vacancies === 0) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-secondary-100 text-secondary-700">
          Fully Occupied
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
          {vacancies} {vacancies === 1 ? "Vacancy" : "Vacancies"}
        </span>
      );
    }
  };

  return (
    <div className="flex items-start py-4 border-b border-neutral-200">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={property.imageUrl} 
          alt={property.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-neutral-900 mb-1">{property.name}</h3>
        <p className="text-sm text-neutral-500 mb-2">{property.address}</p>
        <div className="flex items-center space-x-2 text-sm">
          <span className="flex items-center text-neutral-700">
            <Building className="mr-1 h-4 w-4" /> {property.totalUnits} Units
          </span>
          <span className="flex items-center text-neutral-700">
            <Users className="mr-1 h-4 w-4" /> {property.activeTenantsCount} Tenants
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        {getStatusBadge(property)}
      </div>
    </div>
  );
}

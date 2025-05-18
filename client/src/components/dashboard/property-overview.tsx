import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, PlusCircle } from "lucide-react";
import { type Property } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

// High-quality property images
const DEFAULT_PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
];

interface PropertyOverviewProps {
  className?: string;
}

export function PropertyOverview({ className }: PropertyOverviewProps) {
  const { user } = useAuth();

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", { ownerId: user?.id }],
    enabled: !!user?.id,
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "fully_occupied":
        return "bg-secondary-100 text-secondary-700";
      case "vacant":
        return "bg-danger-100 text-danger-700";
      case "partially_occupied":
      default:
        return "bg-warning-100 text-warning-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fully_occupied":
        return "Fully Occupied";
      case "vacant":
        return "Vacant";
      case "partially_occupied":
      default:
        const property = properties?.find(p => p.status === status);
        if (property) {
          return `${property.units - property.tenantCount} Vacancies`;
        }
        return "Partially Occupied";
    }
  };

  // Get a default property image if none is provided
  const getPropertyImage = (property: Property) => {
    if (property.imageUrl && property.imageUrl.startsWith('http')) {
      return property.imageUrl;
    }
    // Return a random image from our high-quality collection
    return DEFAULT_PROPERTY_IMAGES[Math.floor(Math.random() * DEFAULT_PROPERTY_IMAGES.length)];
  };

  return (
    <Card className={className}>
      <CardHeader className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-heading font-semibold text-neutral-900">
            My Properties
          </CardTitle>
          <Link href="/properties" className="text-primary-600 text-sm font-medium hover:underline flex items-center">
            <span>View All</span>
            <PlusCircle className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading properties...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-danger-500">Failed to load properties</p>
          </div>
        ) : properties?.length === 0 ? (
          <div className="py-8 text-center">
            <p>No properties found. Add your first property to get started.</p>
            <Link href="/properties/new" className="mt-4 inline-block text-primary-600 hover:underline">
              Add Property
            </Link>
          </div>
        ) : (
          <>
            {properties?.map((property) => (
              <div 
                key={property.id} 
                className="flex items-start py-4 border-b border-neutral-200 last:border-b-0"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md transition-transform hover:scale-105">
                  <img 
                    src={getPropertyImage(property)} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium text-neutral-900 mb-1">{property.name}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{property.address}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="flex items-center text-neutral-700">
                      <Building className="h-4 w-4 mr-1" /> {property.units} Units
                    </span>
                    <span className="flex items-center text-neutral-700">
                      <Users className="h-4 w-4 mr-1" /> {property.tenantCount} Tenants
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(property.status)}`}>
                    {getStatusText(property.status)}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

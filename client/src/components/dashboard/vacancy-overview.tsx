import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type VacancyStats, type Vacancy } from "@/lib/types";
import { format, differenceInDays } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Home, DoorOpen, CheckCircle, Clock } from "lucide-react";

// Premium property images for vacant units
const VACANT_UNIT_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
];

interface VacancyOverviewProps {
  className?: string;
}

export function VacancyOverview({ className }: VacancyOverviewProps) {
  const { user } = useAuth();

  // This would typically come from the backend
  const vacancyStats: VacancyStats = {
    totalUnits: 40,
    occupiedUnits: 34,
    vacantUnits: 6
  };

  // Sample vacancies (would be fetched from the backend)
  const vacancies: Vacancy[] = [
    {
      id: 1,
      propertyName: "Westview Apt #304",
      unitNumber: "304",
      vacantSince: "2023-08-01"
    },
    {
      id: 2,
      propertyName: "Oakridge #8A",
      unitNumber: "8A",
      vacantSince: "2023-07-28"
    }
  ];

  // Get a random vacant unit image
  const getVacantUnitImage = (id: number) => {
    return VACANT_UNIT_IMAGES[id % VACANT_UNIT_IMAGES.length];
  };

  return (
    <Card className={className}>
      <CardHeader className="p-6 border-b border-neutral-200">
        <CardTitle className="text-lg font-heading font-semibold text-neutral-900 flex items-center">
          <DoorOpen className="mr-2 h-5 w-5 text-amber-500" />
          Vacancy Overview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center px-4 py-2 bg-primary-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1">Total Units</p>
            <p className="text-2xl font-semibold text-neutral-900">{vacancyStats.totalUnits}</p>
          </div>
          <div className="text-center px-4 py-2 bg-secondary-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1">Occupied</p>
            <p className="text-2xl font-semibold text-secondary-700">{vacancyStats.occupiedUnits}</p>
          </div>
          <div className="text-center px-4 py-2 bg-warning-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1">Vacant</p>
            <p className="text-2xl font-semibold text-warning-700">{vacancyStats.vacantUnits}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Recent Vacancies</h3>
          <div className="space-y-3">
            {vacancies.map((vacancy) => {
              const vacantDays = differenceInDays(new Date(), new Date(vacancy.vacantSince));
              
              return (
                <div key={vacancy.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-100 shadow-sm">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 shadow-md">
                      <img 
                        src={getVacantUnitImage(vacancy.id)} 
                        alt={vacancy.propertyName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{vacancy.propertyName}</p>
                      <p className="text-xs text-neutral-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1 text-amber-500" />
                        Vacant since {format(new Date(vacancy.vacantSince), "MMM d, yyyy")}
                        {vacantDays > 0 && ` (${vacantDays} days)`}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200 transition-all">
                    List Now
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

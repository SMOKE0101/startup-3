import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vacancy } from "@shared/schema";
import { format, differenceInDays } from "date-fns";

interface VacancyWidgetProps {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  recentVacancies: Vacancy[];
}

export function VacancyWidget({ 
  totalUnits, 
  occupiedUnits, 
  vacantUnits, 
  recentVacancies 
}: VacancyWidgetProps) {
  // Format date to display how long it's been vacant
  const formatVacancyDate = (vacantSince: string) => {
    return `Vacant since ${format(new Date(vacantSince), 'MMM d, yyyy')}`;
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="p-6 border-b border-neutral-200">
        <CardTitle className="text-lg font-heading font-semibold text-neutral-900">Vacancy Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center px-4 py-2 bg-primary-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1">Total Units</p>
            <p className="text-2xl font-semibold text-neutral-900">{totalUnits}</p>
          </div>
          <div className="text-center px-4 py-2 bg-secondary-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1">Occupied</p>
            <p className="text-2xl font-semibold text-secondary-700">{occupiedUnits}</p>
          </div>
          <div className="text-center px-4 py-2 bg-warning-50 rounded-lg">
            <p className="text-xs text-neutral-600 mb-1">Vacant</p>
            <p className="text-2xl font-semibold text-warning-700">{vacantUnits}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Recent Vacancies</h3>
          <div className="space-y-3">
            {recentVacancies.map((vacancy) => (
              <div key={vacancy.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{vacancy.propertyName} #{vacancy.unitNumber}</p>
                  <p className="text-xs text-neutral-500">{formatVacancyDate(vacancy.vacantSince)}</p>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  className="text-xs bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200"
                >
                  List Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

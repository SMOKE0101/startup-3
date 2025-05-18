import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Building, Users, HomeIcon } from "lucide-react";
import { type Property } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

export default function Properties() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

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
        return `${properties?.filter(p => p.status === status)[0]?.units - properties?.filter(p => p.status === status)[0]?.tenantCount} Vacancies`;
    }
  };

  const filteredProperties = properties?.filter(property => {
    if (activeTab === "all") return true;
    if (activeTab === "vacant") return property.status === "vacant";
    if (activeTab === "partially") return property.status === "partially_occupied";
    if (activeTab === "fully") return property.status === "fully_occupied";
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-neutral-50">
        <Header />

        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-2">Properties</h1>
              <p className="text-neutral-600">Manage all your rental properties in one place.</p>
            </div>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Property
            </Button>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="vacant">Vacant</TabsTrigger>
              <TabsTrigger value="partially">Partially Occupied</TabsTrigger>
              <TabsTrigger value="fully">Fully Occupied</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="py-8 text-center">
              <p>Loading properties...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-danger-500">Failed to load properties</p>
            </div>
          ) : filteredProperties?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 px-6 pb-8 text-center">
                <HomeIcon className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No properties found</h3>
                <p className="text-neutral-600 mb-6">
                  {activeTab === "all" 
                    ? "You haven't added any properties yet." 
                    : `You don't have any ${activeTab === "vacant" ? "vacant" : activeTab === "partially" ? "partially occupied" : "fully occupied"} properties.`}
                </p>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties?.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={property.imageUrl} 
                      alt={property.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-neutral-500 mb-4">{property.address}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-neutral-500 mr-1" />
                        <span className="text-sm">{property.units} Units</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-neutral-500 mr-1" />
                        <span className="text-sm">{property.tenantCount} Tenants</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(property.status)}`}>
                        {getStatusText(property.status)}
                      </span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

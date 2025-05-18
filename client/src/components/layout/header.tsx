import { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center md:hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <h1 className="font-heading font-semibold text-xl text-neutral-900 md:hidden">
          PropertyPulse
        </h1>
        
        <div className="flex-1 md:ml-6 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search properties, tenants, or issues..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <div className="hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="font-medium">
                  {user ? getInitials(user.name) : "?"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}

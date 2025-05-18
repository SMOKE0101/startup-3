import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { 
  Bell, 
  Menu, 
  Search, 
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TenantSidebar } from "./tenant-sidebar";

export function TenantHeader() {
  const { user } = useAuth();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-6 w-6 text-neutral-500" />
          </Button>
          
          {/* Search */}
          <div className="hidden md:block md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-neutral-50 border-neutral-200 text-sm focus-visible:ring-primary-500"
              />
            </div>
          </div>
          
          {/* Right side - notifications, messages, profile */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-primary-500">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-primary-500">
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <div className="relative ml-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <span className="text-xs font-medium">
                  {user ? getInitials(user.name) : "?"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-neutral-900/50" 
            onClick={toggleMobileSidebar}
          />
          
          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <Button
                variant="ghost" 
                size="icon"
                onClick={toggleMobileSidebar}
                className="text-neutral-500"
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <TenantSidebar onClose={toggleMobileSidebar} />
          </div>
        </div>
      )}
    </header>
  );
}
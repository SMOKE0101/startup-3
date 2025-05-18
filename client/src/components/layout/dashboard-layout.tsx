import { useState, ReactNode } from "react";
import Sidebar from "./sidebar";
import { Menu, Bell, Search } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useCurrentUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white border-r border-neutral-200 overflow-y-auto scrollbar-hide">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden absolute left-4 top-4 z-40">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="bg-white shadow-md text-neutral-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-neutral-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-neutral-200 py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="font-heading font-semibold text-xl text-neutral-900 md:hidden">PropertyPulse</h1>
            <div className="flex-1 md:ml-6 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Search properties, tenants, or issues..." 
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
              </Button>
              <div className="hidden md:block">
                <UserAvatar user={user} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

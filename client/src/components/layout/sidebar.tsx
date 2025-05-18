import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { 
  Building, Home, Users, File, 
  Wrench, Truck, BarChart3, FolderOpen, 
  Settings, LogOut, GaugeCircle, TrendingUp,
  MessageCircle
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: number;
}

const SidebarLink = ({ href, icon, label, isActive, badge }: SidebarLinkProps) => {
  return (
    <li>
      <Link 
        href={href} 
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg ${
          isActive 
            ? "text-primary-600 bg-primary-50" 
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        {icon}
        <span>{label}</span>
        {badge && (
          <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
};

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-neutral-200 overflow-y-auto scrollbar-hide h-full">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-8">
          <Building className="text-primary-500 h-6 w-6" />
          <h1 className="font-heading font-bold text-xl text-neutral-900">PropertyPulse</h1>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <span className="font-medium">
                {user ? getInitials(user.name) : "?"}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-sm">{user?.name || "Guest"}</h3>
              <p className="text-xs text-neutral-500">{user?.role || "Not logged in"}</p>
            </div>
          </div>
        </div>
        
        <nav>
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Management</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/dashboard" 
              icon={<GaugeCircle className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={location === "/dashboard"} 
            />
            <SidebarLink 
              href="/properties" 
              icon={<Home className="h-5 w-5" />} 
              label="Properties" 
              isActive={location === "/properties"} 
            />
            <SidebarLink 
              href="/tenants" 
              icon={<Users className="h-5 w-5" />} 
              label="Tenants" 
              isActive={location === "/tenants"} 
            />
            <SidebarLink 
              href="/billing" 
              icon={<File className="h-5 w-5" />} 
              label="Billing" 
              isActive={location === "/billing"} 
            />
          </ul>
          
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Maintenance</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/maintenance-tracker" 
              icon={<Wrench className="h-5 w-5" />} 
              label="Maintenance Tracker" 
              isActive={location === "/maintenance-tracker"} 
              badge={4}
            />
            <SidebarLink 
              href="/vendors" 
              icon={<Truck className="h-5 w-5" />} 
              label="Vendors" 
              isActive={location === "/vendors"} 
            />
          </ul>
          
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Communication</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/communication-center" 
              icon={<MessageCircle className="h-5 w-5" />} 
              label="Messaging Center" 
              isActive={location === "/communication-center"} 
              badge={3}
            />
          </ul>
          
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Reports</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/financial-analytics" 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="Financial Analytics" 
              isActive={location === "/financial-analytics"} 
            />
            <SidebarLink 
              href="/advanced-analytics" 
              icon={<TrendingUp className="h-5 w-5" />} 
              label="Advanced Analytics" 
              isActive={location === "/advanced-analytics"} 
            />
            <SidebarLink 
              href="/reports" 
              icon={<File className="h-5 w-5" />} 
              label="Reports" 
              isActive={location === "/reports"} 
            />
            <SidebarLink 
              href="/documents" 
              icon={<FolderOpen className="h-5 w-5" />} 
              label="Documents" 
              isActive={location === "/documents"} 
            />
          </ul>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <SidebarLink 
          href="/settings" 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          isActive={location === "/settings"} 
        />
        <button 
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

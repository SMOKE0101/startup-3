import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { 
  Home, 
  FileText, 
  Wrench, 
  MessageCircle, 
  Settings, 
  LogOut, 
  DollarSign,
  Calendar,
  User,
  Bell
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

export function TenantSidebar({ onClose }: SidebarProps) {
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
          <Home className="text-primary-500 h-6 w-6" />
          <h1 className="font-heading font-bold text-xl text-neutral-900">TenantPortal</h1>
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
              <p className="text-xs text-neutral-500">Tenant</p>
            </div>
          </div>
        </div>
        
        <nav>
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">My Home</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/tenant-dashboard" 
              icon={<Home className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={location === "/tenant-dashboard"} 
            />
            <SidebarLink 
              href="/tenant-payments" 
              icon={<DollarSign className="h-5 w-5" />} 
              label="Payments" 
              isActive={location === "/tenant-payments"} 
            />
            <SidebarLink 
              href="/tenant-expenses" 
              icon={<DollarSign className="h-5 w-5" />} 
              label="My Expenses" 
              isActive={location === "/tenant-expenses"} 
            />
            <SidebarLink 
              href="/tenant-maintenance" 
              icon={<Wrench className="h-5 w-5" />} 
              label="Maintenance" 
              isActive={location === "/tenant-maintenance"} 
              badge={2}
            />
          </ul>
          
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Documents</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/tenant-documents" 
              icon={<FileText className="h-5 w-5" />} 
              label="Documents" 
              isActive={location === "/tenant-documents"} 
            />
            <SidebarLink 
              href="/tenant-notices" 
              icon={<Bell className="h-5 w-5" />} 
              label="Notices" 
              isActive={location === "/tenant-notices"} 
            />
          </ul>
          
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase">Communication</p>
          <ul className="space-y-1 mb-6">
            <SidebarLink 
              href="/communication-center" 
              icon={<MessageCircle className="h-5 w-5" />} 
              label="Messages" 
              isActive={location === "/communication-center"} 
              badge={1}
            />
            <SidebarLink 
              href="/tenant-events" 
              icon={<Calendar className="h-5 w-5" />} 
              label="Community Events" 
              isActive={location === "/tenant-events"} 
            />
          </ul>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <SidebarLink 
          href="/tenant-profile" 
          icon={<User className="h-5 w-5" />} 
          label="My Profile" 
          isActive={location === "/tenant-profile"} 
        />
        <SidebarLink 
          href="/tenant-settings" 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          isActive={location === "/tenant-settings"} 
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
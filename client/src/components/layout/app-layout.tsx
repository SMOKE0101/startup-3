import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-neutral-50">
        <Header />
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

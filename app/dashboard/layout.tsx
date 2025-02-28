'use client';

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import AdminAuth from "@/components/admin/AdminAuth";
import { EasterEgg } from "@/components/easter-egg";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminAuth>
      <div className="flex h-screen overflow-hidden bg-muted/10">
        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-background transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="flex-1 overflow-auto">
            <main className="h-full">
              <div className="container max-w-[1400px] py-4 px-4 mx-auto">
                {children}
              </div>
      </main>
    </div>
        </div>
        <EasterEgg />
      </div>
    </AdminAuth>
  );
}

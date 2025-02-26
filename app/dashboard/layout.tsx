'use client';

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import AdminAuth from "@/components/admin/AdminAuth";
import { EasterEgg } from "@/components/easter-egg";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="flex h-screen overflow-hidden bg-muted/10">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
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

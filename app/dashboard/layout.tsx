import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <main className="lg:pl-[240px]">
        <div className="h-full p-8">{children}</div>
      </main>
    </div>
  );
}
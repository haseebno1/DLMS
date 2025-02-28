"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Plus,
  ChevronRight,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname() || '';

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Licenses",
      icon: FileText,
      href: "/dashboard/licenses",
      active: pathname.startsWith("/dashboard/licenses") && pathname !== "/dashboard/licenses/new",
    },
    {
      label: "New License",
      icon: Plus,
      href: "/dashboard/licenses/new",
      active: pathname === "/dashboard/licenses/new",
    },
  ];

  return (
    <div className={cn("relative h-full border-r bg-card flex flex-col", className)}>
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-accent lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">DLMS</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 px-4 py-6",
                  "text-muted-foreground hover:text-foreground",
                  "bg-transparent hover:bg-accent/50",
                  "transition-all duration-200",
                  route.active && "bg-accent/50 text-foreground"
                )}
              >
                <route.icon className={cn(
                  "h-5 w-5",
                  route.active ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="text-base font-medium">{route.label}</span>
                {route.active && (
                  <div className="ml-auto">
                    <ChevronRight className="h-5 w-5 text-primary" />
                  </div>
                )}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-border/30">
        <LogoutButton 
          variant="ghost" 
          size="lg"
          className="w-full justify-start gap-4 px-4 py-6 text-base font-medium text-muted-foreground hover:text-foreground"
        />
      </div>
    </div>
  );
}
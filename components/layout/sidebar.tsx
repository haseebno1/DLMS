"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Plus,
  ChevronRight,
  Menu,
  Moon,
  Sun,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { LogoutButton } from "@/components/auth/logout-button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
      active: pathname?.startsWith("/dashboard/licenses") && pathname !== "/dashboard/licenses/new",
    },
    {
      label: "New License",
      icon: Plus,
      href: "/dashboard/licenses/new",
      active: pathname === "/dashboard/licenses/new",
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed left-4 top-3 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent routes={routes} pathname={pathname} />
        </SheetContent>
      </Sheet>

      <nav
        className={cn(
          "hidden lg:block h-screen w-64 flex-shrink-0",
          "bg-gradient-to-b from-background to-background/95 dark:from-background/95 dark:to-background/90",
          "border-r border-border/30 backdrop-blur-sm",
          className
        )}
      >
        <SidebarContent routes={routes} pathname={pathname} />
      </nav>
    </>
  );
}

function SidebarContent({
  routes,
  pathname,
}: {
  routes: any[];
  pathname: string | null;
}) {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="flex flex-col h-full">
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
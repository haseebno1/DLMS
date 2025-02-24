"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Car,
  ChevronRight,
  FileText,
  Home,
  Menu,
  Moon,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Licenses",
      icon: FileText,
      href: "/dashboard/licenses",
    },
    {
      label: "New License",
      icon: Car,
      href: "/dashboard/licenses/new",
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon" className="fixed left-4 top-4">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent routes={routes} pathname={pathname} />
        </SheetContent>
      </Sheet>

      <nav
        className={cn(
          "hidden lg:block border-r bg-background h-screen w-[240px]",
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
  pathname: string;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="px-3 py-2">
        <Link href="/dashboard">
          <div className="flex items-center pl-3 mb-14">
            <Car className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold ml-2">DLMS</h1>
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "bg-primary/10 text-primary" : ""
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-4 w-4 mr-3")} />
                {route.label}
              </div>
              <ChevronRight
                className={cn(
                  "ml-auto h-4 w-4 transition-transform",
                  pathname === route.href ? "rotate-90" : ""
                )}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Bell, Search, Moon, Sun, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void;
  adminName?: string;
  adminInitials?: string;
  adminImageUrl?: string;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
  }>;
}

export function TopBar({ 
  className, 
  onMenuClick,
  adminName = "Admin", 
  adminInitials = "AD",
  adminImageUrl,
  notifications = [],
}: TopBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-14 items-center px-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 rounded-md hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="flex-1">
          <form className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search licenses..."
                className="w-[300px] pl-9 pr-8 shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
} 
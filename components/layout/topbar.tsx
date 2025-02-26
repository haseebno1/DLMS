"use client";

import { useState } from "react";
import { Bell, Search, Moon, Sun } from "lucide-react";
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

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
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
  adminName = "Admin", 
  adminInitials = "AD",
  adminImageUrl,
  notifications = [],
}: TopBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "h-16 px-6 flex items-center justify-between",
        "bg-gradient-to-r from-background via-background/95 to-background/90",
        "border-b border-border/30 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex-1 flex items-center gap-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 bg-accent/50 border-accent-foreground/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl bg-accent/50 hover:bg-accent"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl bg-accent/50 hover:bg-accent">
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              {notifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-medium"
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover/95 backdrop-blur-sm">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider font-medium">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-accent/50 hover:bg-accent p-0">
              <Avatar>
                <AvatarImage src={adminImageUrl} alt={adminName} />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {adminInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover/95 backdrop-blur-sm" align="end">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider font-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-2">Profile</DropdownMenuItem>
            <DropdownMenuItem className="py-2">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutButton 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 
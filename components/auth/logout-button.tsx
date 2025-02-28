"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from 'js-cookie';

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function LogoutButton({ variant = "ghost", size = "sm", className }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    try {
      // Clear auth state
      localStorage.removeItem('isAdmin');
      Cookies.remove('isAdmin', { path: '/' });
      
      // Pre-fetch home route
      router.prefetch('/');
      
      // Use replace for immediate navigation
      router.replace('/');
      
      // Show success message after a small delay
      setTimeout(() => {
        toast.success("Logged out successfully");
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      <LogOut className="h-4 w-4 mr-2" />
      <span>Logout</span>
    </Button>
  );
}
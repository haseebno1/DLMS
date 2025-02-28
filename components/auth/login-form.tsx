"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { Heart } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple admin authentication
      if (email === 'admin@dlms.com' && password === 'admin123') {
        // Set auth state
        localStorage.setItem('isAdmin', 'true');
        Cookies.set('isAdmin', 'true', { 
          expires: 7,
          sameSite: 'lax',
          secure: window.location.protocol === 'https:'
        });

        // Show success message
        toast.success('Login successful');

        // Pre-fetch dashboard route
        router.prefetch('/dashboard');
        
        // Use replace instead of push for better navigation
        router.replace('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/10 px-4 py-8">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 sm:space-y-8 bg-card rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">Enter your credentials to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full"
                placeholder="Enter admin email"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full"
                placeholder="Enter admin password"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
      
      <div className="mt-8 sm:mt-16 flex items-center justify-center text-xs sm:text-sm text-muted-foreground px-4 text-center">
        <span>Design and Develop with</span>
        <Heart 
          className="mx-1 h-3 w-3 sm:h-4 sm:w-4 text-red-500" 
          fill="currentColor"
          style={{
            animation: "heartbeat 1.5s ease-in-out infinite",
          }}
        />
        <span>by Abdul Haseeb</span>
      </div>

      <style jsx global>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          40% { transform: scale(1); }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isAuthenticated, clearAuth } from '@/lib/auth';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated using the utility function
      if (!isAuthenticated()) {
        // Not authenticated, clear any invalid tokens and redirect to login
        clearAuth();
        toast.error('Please login to access this page');
        router.push('/');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <p className="ml-2">Verifying admin...</p>
      </div>
    );
  }

  return <>{children}</>;
} 
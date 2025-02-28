'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Simple admin check
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (!isAdmin) {
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
        <div className="w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        <p className="ml-2 text-muted-foreground">Verifying...</p>
      </div>
    );
  }

  return <>{children}</>;
} 
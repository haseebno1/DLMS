"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Signature() {
  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-2">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Design and Develop with</span>
        <Heart 
          className="h-4 w-4 text-red-500" 
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
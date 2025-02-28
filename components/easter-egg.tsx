"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function EasterEgg() {
  const [show, setShow] = useState(false);
  const [taps, setTaps] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    const handleKeySequence = (e: KeyboardEvent) => {
      if (!e?.key) return; // Guard against undefined key
      
      // Show easter egg when pressing 'e' three times quickly
      if (e.key.toLowerCase() === 'e') {
        const now = Date.now();
        if (now - lastTap < 500) { // 500ms between taps
          setTaps(prev => {
            if (prev === 2) { // Show on third tap
              setShow(true);
              setTimeout(() => setShow(false), 5000);
              return 0;
            }
            return prev + 1;
          });
        } else {
          setTaps(1);
        }
        setLastTap(now);
      }
    };

    const handleTouch = () => {
      const now = Date.now();
      if (now - lastTap < 500) {
        setTaps(prev => {
          if (prev === 2) {
            setShow(true);
            setTimeout(() => setShow(false), 5000);
            return 0;
          }
          return prev + 1;
        });
      } else {
        setTaps(1);
      }
      setLastTap(now);
    };

    window.addEventListener("keydown", handleKeySequence);
    window.addEventListener("touchend", handleTouch);
    
    return () => {
      window.removeEventListener("keydown", handleKeySequence);
      window.removeEventListener("touchend", handleTouch);
    };
  }, [lastTap]);

  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center",
      "bg-gradient-to-br from-background/95 via-background/90 to-background/95",
      "backdrop-blur-sm transition-all duration-500",
      "animate-in fade-in slide-in-from-bottom-4"
    )}>
      <div className="text-center space-y-6 scale-110">
        <div className="flex items-center justify-center space-x-3 text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            Design and Develop with
          </span>
          <Heart 
            className="h-8 w-8 text-red-500 animate-pulse" 
            fill="currentColor"
            style={{
              animation: "heartbeat 1.5s ease-in-out infinite",
            }}
          />
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            by Abdul Haseeb
          </span>
        </div>
        <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          Thanks for discovering this easter egg! 🎉
        </p>
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
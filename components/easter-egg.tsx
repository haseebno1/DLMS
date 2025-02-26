"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function EasterEgg() {
  const [show, setShow] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key];
      if (newKonami.length > konamiCode.length) {
        newKonami.shift();
      }
      setKonami(newKonami);

      if (newKonami.join(",") === konamiCode.join(",")) {
        setShow(true);
        setTimeout(() => setShow(false), 5000);
        setKonami([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konami]);

  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-gradient-to-br from-background/95 via-background/90 to-background/95",
        "backdrop-blur-sm transition-all duration-500",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
    >
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
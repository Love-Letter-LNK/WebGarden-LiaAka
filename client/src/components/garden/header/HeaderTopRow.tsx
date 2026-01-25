import type React from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function HeaderTopRow() {
  return (
    <div className="relative grid items-center gap-2 md:grid-cols-[1fr_auto_1fr]">
      {/* Left */}
      <div className="flex items-center justify-center md:justify-start gap-2">
        <span className="kawaii-ribbon">menu ✦</span>
      </div>

      {/* Center (true centered even when sides change) */}
      <nav className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <a className="pixel-chip header-chip story-link" href="#journey">
          Journey
        </a>
        <a className="pixel-chip header-chip story-link" href="#memories">
          Memories
        </a>
        <a className="pixel-chip header-chip story-link" href="#capsule">
          <span className="hidden sm:inline">Time Capsule</span>
          <span className="sm:hidden">Capsule</span>
        </a>
        <Link className="pixel-chip header-chip story-link" to="/guestbook">
          Guestbook
        </Link>
      </nav>

      {/* Right */}
      <div className="flex items-center justify-center md:justify-end gap-2">
        <Link className="pixel-chip header-chip story-link" to="/auth">
          <span className="inline-flex items-center gap-1">
            <LogIn className="h-3.5 w-3.5" /> Login
          </span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { useTheme } from "next-themes";

type StyleSwitcherProps = {
  onStyleChange: () => void;
};

export default function StyleSwitcher({ onStyleChange }: StyleSwitcherProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onStyleChange}
            className="absolute bottom-20 left-4 z-20 overflow-hidden bg-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:border-purple-500 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:border-blue-400 [@media(hover:hover)]:hover:bg-gray-100 [@media(hover:hover)]:dark:hover:bg-gray-700"
          >
            <div className="relative">
              <Sun
                className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
                  isDark
                    ? "rotate-0 scale-100 text-amber-500"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
              />
              <Moon
                className={`absolute top-0 h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
                  isDark
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 text-blue-500"
                }`}
              />
            </div>
            <span className="sr-only">
              Switch to {isDark ? "light" : "dark"} mode
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90"
        >
          <p className="text-sm font-medium">
            Switch to {isDark ? "light" : "dark"} mode
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

"use client"

import { cn } from "@/lib/utils"

interface SquareProps {
  value: string | null
  onSquareClick: () => void
  isWinningSquare?: boolean
}

export function Square({ value, onSquareClick, isWinningSquare = false }: SquareProps) {
  return (
    <button
      className={cn(
        "h-[70px] w-[70px] sm:h-20 sm:w-20 text-2xl sm:text-3xl font-bold flex items-center justify-center border-2 border-slate-300 dark:border-slate-700 rounded-md transition-all",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500",
        "active:scale-95 touch-manipulation",
        value === "X" && "text-rose-500",
        value === "O" && "text-sky-500",
        isWinningSquare && "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700",
      )}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

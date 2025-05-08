import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BOARD_COLS } from "@/global/constant"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function convertIndex(i: number){
  return { i : Math.floor(i / BOARD_COLS), j : i % BOARD_COLS }
}

export { cn, convertIndex }



"use client";

import { useEffect, useState } from "react";
import Board from "./board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Brain, Sparkles } from "lucide-react";
import { BOARD_ROWS, BOARD_COLS } from "@/global/constant";

export default function Game() {
  const [squares, setSquares] = useState(
    Array(BOARD_ROWS)
      .fill(0)
      .map(() => Array(BOARD_COLS).fill(0))
  );
  const [xIsNext, setXIsNext] = useState(true);
  const [modelLoaded] = useState(false);
  const [usePretrained, setUsePretrained] = useState(false);
  const [loading, setLoading] = useState(true);

  const startGame = async (trained: boolean) => {
    try {
      setLoading(true);
      await fetch(`/api/game/start?policy=${trained? 'true': 'false'}`, {
        method: "GET",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };
  useEffect(() => {
    startGame(usePretrained);
  }, []);

  async function handlePlay(nextSquares: number[][]) {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  async function resetGame(trained: boolean = usePretrained) {
    setSquares(
      Array(BOARD_ROWS)
        .fill(0)
        .map(() => Array(BOARD_COLS).fill(0))
    );
    setXIsNext(true);
    await startGame(trained);
  }

  async function handleToggle() {
    await resetGame(!usePretrained);
    setUsePretrained(!usePretrained);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg">starting game...</span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[min(100%,400px)] mx-auto px-2 ">
      <Card className="w-full bg-slate-50">
        <CardHeader className="pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="flex justify-between items-center text-xl">
            <span>Game Board</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => resetGame()}
              title="Reset Game"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay}/>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 justify-center mt-8 w-64">
        
        <Button
          onClick={handleToggle}
          className={`flex items-center gap-2 h-12 text-base ${usePretrained ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-900"} `}
          size="default"
        >
          {usePretrained ? (
            <Brain className="h-5 w-5 " />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          {usePretrained ? "Trained Policy" : "Random Policy"}
        </Button>
      </div>

      {modelLoaded && (
        <div className="text-center text-sm text-green-600 dark:text-green-400">
          Model is ready to use!
        </div>
      )}
    </div>
  );
}

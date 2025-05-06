"use client"

import { useState } from "react"
import Board from "./board"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Brain, Download } from "lucide-react"

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(0))
  const [xIsNext, setXIsNext] = useState(true)
  const [isTraining, setIsTraining] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  function handlePlay(nextSquares: (number | null)[]) {
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  function resetGame() {
    setSquares(Array(9).fill(0))
    setXIsNext(true)
  }

  function handleTraining() {
    setIsTraining(true)
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false)
      setModelLoaded(true)
      alert("Training completed!")
    }, 2000)
  }

  function handleLoadPretrained() {
    // Simulate loading a pretrained model
    setTimeout(() => {
      setModelLoaded(true)
      alert("Pretrained model loaded successfully!")
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[min(100%,400px)] mx-auto px-2">
      <Card className="w-full">
        <CardHeader className="pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
          <CardTitle className="flex justify-between items-center text-xl">
            <span>Game Board</span>
            <Button variant="ghost" size="icon" onClick={resetGame} title="Reset Game">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} />
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={handleTraining} disabled={isTraining} className="flex gap-2 h-12 text-base" size="lg">
          <Brain className="h-5 w-5" />
          {isTraining ? "Training..." : "Training"}
        </Button>
        <Button onClick={handleLoadPretrained} variant="outline" className="flex gap-2 h-12 text-base" size="lg">
          <Download className="h-5 w-5" />
          Load Pretrained
        </Button>
      </div>

      {modelLoaded && (
        <div className="text-center text-sm text-green-600 dark:text-green-400">Model is ready to use!</div>
      )}
    </div>
  )
}

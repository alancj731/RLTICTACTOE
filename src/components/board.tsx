import { Square } from "./square"
import { convertIndex } from "@/lib/utils"

interface BoardProps {
  xIsNext: boolean
  squares: number[][]
  onPlay: (squares: number[][]) => void
}

export default function Board({ xIsNext, squares, onPlay }: BoardProps) {
  console.log("squares", squares)
  function handleClick(index: number) {
    const { i, j } = convertIndex(index)
    if (calculateWinner(squares) || squares[i][j] !== 0) {
      return
    }

    const nextSquares = squares.slice()
    nextSquares[i][j] = xIsNext ? -1 : 1
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  let status

  if (winner) {
    status = winner === -1 ? "You win!" : "You lost!"
  } else if (squares.every((row) => row.every((item) => item !== 0))) {
    status = "A Tie!"
  } else {
    status = `Player: ${xIsNext ? " You" : " Bot"}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-base sm:text-lg font-medium text-center">{status}</div>
      <div className="grid grid-cols-3 gap-1 sm:gap-2 mx-auto">
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <Square
              key={index}
              value={squares[convertIndex(index).i][convertIndex(index).j]}
              onSquareClick={() => handleClick(index)}
              isWinningSquare={calculateWinner(squares) !== null}
            />
          ))}
      </div>
    </div>
  )
}

function calculateWinner(squares: number [][]) : number | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const flatSquares = squares.flat()
  for (const [a, b, c] of lines) {
    if (flatSquares[a] !== 0 && flatSquares[a] === flatSquares[b] && flatSquares[a] === flatSquares[c]) {
      return flatSquares[a]
    }
  }

  return null
}

function isWinningSquare(index: number, winner: number | null, squares: number[][]): boolean {
  if (!winner) return false

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return index === a || index === b || index === c
    }
  }

  return false
}

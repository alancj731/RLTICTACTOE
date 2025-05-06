import { Square } from "./square"

interface BoardProps {
  xIsNext: boolean
  squares: (string | null)[]
  onPlay: (squares: (string | null)[]) => void
}

export default function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? "X" : "O"
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  let status

  if (winner) {
    status = winner === "X" ? "You win!" : "You lost!"
  } else if (squares.every((square) => square !== null)) {
    status = "Tie Game"
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-base sm:text-lg font-medium text-center">{status}</div>
      <div className="grid grid-cols-3 gap-1 sm:gap-2 mx-auto">
        {Array(9)
          .fill(null)
          .map((_, i) => (
            <Square
              key={i}
              value={squares[i]}
              onSquareClick={() => handleClick(i)}
              isWinningSquare={isWinningSquare(i, calculateWinner(squares), squares)}
            />
          ))}
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[]) {
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
      return squares[a]
    }
  }

  return null
}

function isWinningSquare(index: number, winner: string | null, squares: (string | null)[]): boolean {
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

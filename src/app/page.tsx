import Game from "@/components/game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-slate-800 dark:text-slate-100">Tic-Tac-Toe</h1>
      <Game />
    </main>
  );
}

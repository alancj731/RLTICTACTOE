import Game from "@/components/game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-12 px-2 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8 sm:mt-4 mb-10 text-slate-800 dark:text-slate-100">Tic-Tac-Toe</h1>
      <Game />
    </main>
  );
}

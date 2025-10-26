import { Plus, StickyNote, RotateCcw } from 'lucide-react'

export default function Toolbar({ placingSticky, onTogglePlacing }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 dark:border-white/10 backdrop-blur bg-white/60 dark:bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">My Diary</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlacing}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm transition active:translate-y-px border ${placingSticky ? 'bg-yellow-300/90 text-black border-yellow-400' : 'bg-white/80 dark:bg-white/10 border-black/10 dark:border-white/10 hover:bg-white'}`}
            title="Add sticky note"
          >
            <StickyNote size={16} /> {placingSticky ? 'Click on page…' : 'Add Sticky'}
          </button>
          <a
            href="https://vercel.com/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 transition"
          >
            <Plus size={16} /> New
          </a>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:bg-white/80 transition"
            title="Reload"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

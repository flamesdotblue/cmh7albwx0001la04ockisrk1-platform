import { useEffect, useRef, useState } from 'react'
import Book from './components/Book'
import Toolbar from './components/Toolbar'
import StickyNotes from './components/StickyNotes'

export default function App() {
  const [placingSticky, setPlacingSticky] = useState(false)
  const bookRef = useRef(null)

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('diary-entries')
    if (saved) return JSON.parse(saved)
    // Initialize with 8 blank pages (4 spreads)
    return Array.from({ length: 8 }).map((_, idx) => ({ id: idx, text: '' }))
  })

  useEffect(() => {
    localStorage.setItem('diary-entries', JSON.stringify(entries))
  }, [entries])

  const handleUpdateEntry = (id, text) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, text } : e)))
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Toolbar
        placingSticky={placingSticky}
        onTogglePlacing={() => setPlacingSticky((v) => !v)}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-12">
        <div ref={bookRef} className="relative">
          <StickyNotes containerRef={bookRef} placing={placingSticky} onPlaced={() => setPlacingSticky(false)} />
          <Book entries={entries} onUpdateEntry={handleUpdateEntry} />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, GripVertical } from 'lucide-react'

const colors = [
  { bg: '#FEF08A', text: '#1f2937' }, // yellow
  { bg: '#A7F3D0', text: '#064e3b' }, // mint
  { bg: '#BFDBFE', text: '#1e3a8a' }, // sky
  { bg: '#FBCFE8', text: '#831843' }, // pink
]

export default function StickyNotes({ containerRef, placing, onPlaced }) {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('diary-sticky-notes')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('diary-sticky-notes', JSON.stringify(notes))
  }, [notes])

  // Click to place when placing mode is active
  useEffect(() => {
    const el = containerRef?.current
    if (!el) return
    const handler = (e) => {
      if (!placing) return
      const bounds = el.getBoundingClientRect()
      const x = e.clientX - bounds.left
      const y = e.clientY - bounds.top
      const color = colors[Math.floor(Math.random() * colors.length)]
      const id = crypto.randomUUID()
      setNotes((prev) => [
        ...prev,
        {
          id,
          x: Math.max(8, Math.min(x - 80, bounds.width - 160)),
          y: Math.max(8, Math.min(y - 80, bounds.height - 160)),
          text: '',
          color,
          r: (Math.random() - 0.5) * 8,
        },
      ])
      onPlaced?.()
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [containerRef, placing, onPlaced])

  const constraintsRef = useRef(null)

  useEffect(() => {
    constraintsRef.current = containerRef?.current
  }, [containerRef])

  const updateNote = (id, patch) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }
  const removeNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id))

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {notes.map((n) => (
        <motion.div
          key={n.id}
          drag
          dragMomentum={false}
          dragConstraints={constraintsRef}
          dragElastic={0}
          onDragEnd={(e, info) => updateNote(n.id, { x: info.point.x - constraintsRef.current.getBoundingClientRect().left - 80, y: info.point.y - constraintsRef.current.getBoundingClientRect().top - 80 })}
          initial={false}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: n.x,
            y: n.y,
            rotate: n.r,
          }}
          className="pointer-events-auto touch-none"
        >
          <div
            className="w-40 h-40 rounded shadow-md border border-black/10 relative"
            style={{ background: n.color.bg, color: n.color.text }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/10 rounded-sm rotate-2" />
            <div className="flex items-center justify-between px-2 py-1 text-xs opacity-70">
              <span className="inline-flex items-center gap-1"><GripVertical size={14} /> Drag</span>
              <button onClick={() => removeNote(n.id)} className="rounded p-1 hover:bg-black/10">
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              value={n.text}
              onChange={(e) => updateNote(n.id, { text: e.target.value })}
              className="w-full h-[120px] p-2 bg-transparent outline-none text-sm"
              placeholder="Sticky note..."
            />
          </div>
        </motion.div>
      ))}

      {placing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-pulse grid place-items-center">
            <div className="pointer-events-none rounded-md bg-yellow-300/70 text-black text-sm px-3 py-1 shadow">
              Click anywhere on the page to place the sticky
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

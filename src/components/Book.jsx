import { useEffect, useMemo, useRef, useState } from 'react'
import Page from './Page'

export default function Book({ entries, onUpdateEntry }) {
  // current spread's left page index (even numbers: 0,2,4,...)
  const [leftIndex, setLeftIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState(null) // 'forward' | 'backward'
  const flipRef = useRef(null)

  const canBack = leftIndex > 0
  const canForward = leftIndex + 1 < entries.length - 1

  const spread = useMemo(() => ({ left: entries[leftIndex], right: entries[leftIndex + 1] }), [entries, leftIndex])

  const doFlip = (dir) => {
    if (isFlipping) return
    if (dir === 'forward' && !canForward) return
    if (dir === 'backward' && !canBack) return

    setFlipDir(dir)
    setIsFlipping(true)
  }

  useEffect(() => {
    if (!isFlipping) return
    const el = flipRef.current
    if (!el) return
    const handler = () => {
      setIsFlipping(false)
      setFlipDir(null)
      setLeftIndex((idx) => (flipDir === 'forward' ? idx + 2 : idx - 2))
    }
    el.addEventListener('transitionend', handler, { once: true })
    // start next tick to ensure transition
    const t = setTimeout(() => {
      el.classList.add('flip-go')
    }, 20)
    return () => clearTimeout(t)
  }, [isFlipping, flipDir])

  // Determine pages used in flip overlay
  const nextIndices = useMemo(() => {
    if (flipDir === 'forward') {
      return { from: leftIndex + 1, to: leftIndex + 2 }
    }
    if (flipDir === 'backward') {
      return { from: leftIndex, to: leftIndex - 1 }
    }
    return null
  }, [flipDir, leftIndex])

  return (
    <div className="relative mx-auto mt-6 select-none">
      <div className="relative mx-auto h-[70vh] min-h-[520px] max-h-[840px] w-full max-w-5xl">
        <div className="absolute inset-0 -z-10 rounded-xl bg-[#e6dac3] shadow-[0_40px_100px_rgba(0,0,0,0.25)]" />

        <div className="relative h-full w-full rounded-xl overflow-hidden [perspective:2000px]">
          <div className="absolute inset-0">
            <Page side="left" page={spread.left} onChange={onUpdateEntry} />
            <Page side="right" page={spread.right} onChange={onUpdateEntry} />
          </div>

          {isFlipping && nextIndices && (
            <FlipOverlay
              ref={flipRef}
              dir={flipDir}
              fromPage={entries[nextIndices.from]}
              toPage={entries[nextIndices.to]}
              onChange={onUpdateEntry}
            />
          )}

          <PageNumbers left={leftIndex} right={leftIndex + 1} />
        </div>

        <nav className="pointer-events-none absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={() => doFlip('backward')}
            className={`pointer-events-auto rounded-md px-4 py-2 text-sm font-medium shadow-sm border transition ${canBack ? 'bg-white/80 dark:bg-white/10 border-black/10 dark:border-white/10 hover:bg-white' : 'opacity-50 cursor-not-allowed bg-white/30'}`}
          >
            ‹ Prev
          </button>
          <button
            onClick={() => doFlip('forward')}
            className={`pointer-events-auto rounded-md px-4 py-2 text-sm font-medium shadow-sm border transition ${canForward ? 'bg-white/80 dark:bg-white/10 border-black/10 dark:border-white/10 hover:bg-white' : 'opacity-50 cursor-not-allowed bg-white/30'}`}
          >
            Next ›
          </button>
        </nav>
      </div>
    </div>
  )
}

function PageNumbers({ left, right }) {
  return (
    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-12 text-xs text-neutral-500">
      <span>{left + 1}</span>
      <span>{right + 1}</span>
    </div>
  )
}

const FlipOverlay = ({ dir, fromPage, toPage, onChange }, ref) => {
  // This overlay simulates the turning sheet
  // forward: right page turns to left
  // backward: left page turns back to right
  const isForward = dir === 'forward'
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        ref={ref}
        className={`absolute inset-0 will-change-transform [transform-style:preserve-3d] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isForward ? 'origin-left' : 'origin-right'} flip-sheet`}
        style={{
          transform: isForward ? 'rotateY(0deg)' : 'rotateY(-180deg)'
        }}
      >
        {/* front side of flipping sheet */}
        <div className={`absolute inset-0 ${isForward ? 'left-0' : 'right-0'} w-1/2 p-6 [backface-visibility:hidden]`}
          style={{ transform: 'rotateY(0deg)' }}
        >
          <div className="h-full w-full rounded-md bg-[#f9f4ea] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.08)]">
            <textarea
              value={fromPage?.text || ''}
              onChange={(e) => onChange(fromPage.id, e.target.value)}
              className="h-full w-full resize-none outline-none bg-transparent text-neutral-900/90 text-[15px] leading-relaxed"
              placeholder="Write your day..."
            />
          </div>
        </div>
        {/* back side of flipping sheet */}
        <div className={`absolute inset-0 ${isForward ? 'left-0' : 'right-0'} w-1/2 p-6 [backface-visibility:hidden]`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="h-full w-full rounded-md bg-[#f5ebd7] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.08)]">
            <textarea
              value={toPage?.text || ''}
              onChange={(e) => onChange(toPage.id, e.target.value)}
              className="h-full w-full resize-none outline-none bg-transparent text-neutral-900/90 text-[15px] leading-relaxed"
              placeholder="Write your day..."
            />
          </div>
        </div>
      </div>
      <style>{`
        .flip-go.flip-sheet { transform: ${isForward ? 'rotateY(-180deg)' : 'rotateY(0deg)'}; }
      `}</style>
    </div>
  )
}

export { FlipOverlay as _FlipOverlay }

FlipOverlay.displayName = 'FlipOverlay'

// forwardRef shim
import React from 'react'
const _FlipOverlayForward = React.forwardRef(FlipOverlay)
export { _FlipOverlayForward as FlipOverlay }

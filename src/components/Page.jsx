export default function Page({ side = 'left', page, onChange }) {
  return (
    <div
      className={`absolute inset-0 ${side === 'left' ? 'origin-right' : 'origin-left'} [transform-style:preserve-3d]`}
    >
      <div
        className={`absolute inset-0 ${side === 'left' ? 'right-0' : 'left-0'} w-1/2 p-6 [backface-visibility:hidden]`}
      >
        <div className="h-full w-full rounded-md bg-[#f9f4ea] bg-[radial-gradient(transparent_1px,#f9f4ea_1px)] [background-size:6px_6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.08)] relative overflow-hidden">
          <div className={`absolute inset-y-0 ${side === 'left' ? 'right-0' : 'left-0'} w-8 bg-gradient-to-${side === 'left' ? 'l' : 'r'} from-black/5 to-transparent pointer-events-none`} />
          <div className="h-full w-full">
            <textarea
              value={page.text}
              onChange={(e) => onChange(page.id, e.target.value)}
              className="h-full w-full resize-none outline-none bg-transparent text-neutral-900/90 placeholder:text-neutral-400 text-[15px] leading-relaxed"
              placeholder="Write your day..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

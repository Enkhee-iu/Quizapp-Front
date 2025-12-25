"use client"


export default function SideLeftBar({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <aside className="fixed left-[72px] top-0 h-screen w-[260px] border-r border-zinc-200 bg-white">
      {/* Close button */}
      <button
        onClick={onClose}
        className="p-4 text-zinc-600 hover:text-zinc-900"
      >
        ✕ Close
      </button>

      {/* History */}
      <div className="px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-600">
            History
          </span>
          <span className="text-zinc-400 text-sm">🕒</span>
        </div>

        <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-120px)] pr-1">
          {historyItems.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer rounded-md px-2 py-2 text-sm text-zinc-800 hover:bg-zinc-100"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

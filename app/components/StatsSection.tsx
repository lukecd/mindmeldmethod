export default function StatsSection() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="rounded-3xl border border-white/10 bg-mindmeld-navy p-12 flex flex-col justify-center">
        <div className="text-white/50 text-lg">Traditional Methods</div>
        <div className="text-white/80 text-xl mt-2">Flashcards are boring.</div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-mindmeld-navy p-12 flex flex-col items-center justify-center">
        <div className="text-6xl font-scifi text-white mb-2">2.5x</div>
        <div className="text-white/50">Faster Learning</div>
      </div>
    </div>
  )
} 
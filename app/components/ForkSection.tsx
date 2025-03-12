export default function ForkSection() {
  return (
    <section className="bg-[color:var(--color-bg-main)] py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* Main heading card */}
          <div className="col-span-12 lg:col-span-8 bg-[color:var(--color-bg-nav)] p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-title text-[color:var(--color-text-inverse)] mb-4">
                Traditional language flashcards are boring.
              </h2>
              <p className="text-2xl md:text-4xl font-title text-[color:var(--color-text-inverse)]/80">
                It&apos;s time for a fork.
              </p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4">
            <div className="bg-[color:var(--color-bg-card)] p-4 border border-[color:var(--color-border-light)]">
              <div className="text-4xl font-title text-[color:var(--color-accent-secondary)] mb-2">69.42%</div>
              <div className="text-[color:var(--color-text-on-dark)]/80">Faster vocabulary retention</div>
            </div>
            <div className="bg-[color:var(--color-bg-card)] p-4 border border-[color:var(--color-border-light)]">
              <div className="text-4xl font-title text-[color:var(--color-accent-secondary)] mb-2">420x</div>
              <div className="text-[color:var(--color-text-on-dark)]/80">More engaging than traditional methods</div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="col-span-6 lg:col-span-4 bg-[color:var(--color-accent-primary)] p-4">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-title text-[color:var(--color-text-inverse)] mb-2">Memory Tricks</h3>
            <p className="text-[color:var(--color-text-inverse)]/80">Visual associations that stick in your mind</p>
          </div>

          <div className="col-span-6 lg:col-span-4 bg-[color:var(--color-button-primary)] p-4">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-title text-[color:var(--color-text-inverse)] mb-2">Targeted Learning</h3>
            <p className="text-[color:var(--color-text-inverse)]/80">Focus on what matters most</p>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-[color:var(--color-accent-secondary)] p-4">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-title text-[color:var(--color-text-inverse)] mb-2">Rapid Progress</h3>
            <p className="text-[color:var(--color-text-inverse)]/80">See results in days, not weeks</p>
          </div>
        </div>
      </div>
    </section>
  )
} 
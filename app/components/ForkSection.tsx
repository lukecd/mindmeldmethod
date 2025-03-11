export default function ForkSection() {
  return (
    <section className="bg-[#2D1B36] py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* Main heading card */}
          <div className="col-span-12 lg:col-span-8 bg-[#E94F37] p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-scifi text-[#F6E8EA] mb-4">
                Traditional language flashcards are boring.
              </h2>
              <p className="text-2xl md:text-4xl font-scifi text-[#F6E8EA]/80">
                It&apos;s time for a fork.
              </p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="col-span-12 lg:col-span-4 grid grid-rows-2 gap-4">
            <div className="bg-[#2D1B36] p-4 border border-[#F6E8EA]/10">
              <div className="text-4xl font-scifi text-[#F7A072] mb-2">69.42%</div>
              <div className="text-[#F6E8EA]/80">Faster vocabulary retention</div>
            </div>
            <div className="bg-[#2D1B36] p-4 border border-[#F6E8EA]/10">
              <div className="text-4xl font-scifi text-[#F7A072] mb-2">420x</div>
              <div className="text-[#F6E8EA]/80">More engaging than traditional methods</div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="col-span-6 lg:col-span-4 bg-[#F7A072] p-4">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-scifi text-[#2D1B36] mb-2">Memory Tricks</h3>
            <p className="text-[#2D1B36]/80">Visual associations that stick in your mind</p>
          </div>

          <div className="col-span-6 lg:col-span-4 bg-[#F26B3C] p-4">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-scifi text-[#2D1B36] mb-2">Targeted Learning</h3>
            <p className="text-[#2D1B36]/80">Focus on what matters most</p>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-[#E94F37] p-4">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-scifi text-[#2D1B36] mb-2">Rapid Progress</h3>
            <p className="text-[#2D1B36]/80">See results in days, not weeks</p>
          </div>
        </div>
      </div>
    </section>
  )
} 
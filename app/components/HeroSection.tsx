'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[color:var(--color-bg-main)] py-20 px-4">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20"
      >
        <source src="/videos/mainBG.mp4" type="video/mp4" />
      </video> 

      <div className="container mx-auto relative z-10 mt-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="text-4xl md:text-6xl font-title text-[color:var(--color-text-primary)] mb-4">
              Devconnect is coming ...
            </h1>
            <p className="text-[color:var(--color-text-secondary)] text-xl mb-8">
              Don't be "that dude" who walks around asking for for things in progressively louder English. Learn some Spanish and 10x your trip.
              </p>
              <p className="text-[color:var(--color-text-secondary)] text-xl mb-8">

              Visual memory hacks, real-world crypto content, and onchain progress tracking.
            </p>
            <Link 
              href="/basics/unit-1" 
              className="inline-block bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] px-8 py-4 text-xl hover:bg-[color:var(--color-button-hover)] transition-colors"
            >
              Start Learning →
            </Link>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-[color:var(--color-bg-highlight)] p-6">
              <h3 className="text-2xl font-title text-[color:var(--color-text-inverse)] mb-4">Start Learning Now</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-[color:var(--color-text-primary)] flex items-center justify-center text-2xl">
                    🧠
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[color:var(--color-text-inverse)] font-title mb-2">Visual Learning</h4>
                    <p className="text-[color:var(--color-text-inverse)]/80">Memory tricks that actually work</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-[color:var(--color-text-primary)] flex items-center justify-center text-2xl">
                    🎥
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[color:var(--color-text-inverse)] font-title mb-2">Realworld Spanish</h4>
                    <p className="text-[color:var(--color-text-inverse)]/80">Learn from crypto content</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-[color:var(--color-text-primary)] flex items-center justify-center text-2xl">
                    📈
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[color:var(--color-text-inverse)] font-title mb-2">Track Progress</h4>
                    <p className="text-[color:var(--color-text-inverse)]/80">See your improvement</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
'use client'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4">
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

      {/* Content */}
      <div className="relative z-10 container mx-auto">
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {/* Title Box */}
          <div className="bg-mindmeld-coral p-8 rounded-lg">
            <h1 className="text-4xl md:text-6xl font-scifi text-mindmeld-navy mb-4">
              Devconnect Is Coming        
            </h1>
            <h2 className="text-2xl md:text-3xl text-mindmeld-navy/80">
              Time To Learn Spanish        
            </h2>
          </div>

          {/* Quick Start Box */}
          {/* <Link href="/basics" className="bg-mindmeld-navy-dark p-8 rounded-lg hover:bg-mindmeld-navy-darker transition-colors group">
            <h3 className="text-2xl font-scifi text-mindmeld-coral mb-4">Start Learning Now</h3>
            <p className="text-white/80 mb-6">Jump straight into Spanish basics with our interactive lessons.</p>
            <div className="flex items-center gap-2 text-mindmeld-coral group-hover:translate-x-2 transition-transform">
              Begin Journey <span className="text-xl">→</span>
            </div>
          </Link> */}

          {/* Features Box */}
          {/* <div className="bg-mindmeld-navy-dark p-8 rounded-lg md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="text-mindmeld-coral font-scifi mb-2">Visual Learning</h4>
                <p className="text-white/80">Master Spanish through memorable images and associations</p>
              </div>
              <div className="text-center">
                <h4 className="text-mindmeld-coral font-scifi mb-2">Realworld Spanish</h4>
                <p className="text-white/80">Learn the Spanish we need with crypto podcasts</p>
              </div>
              <div className="text-center">
                <h4 className="text-mindmeld-coral font-scifi mb-2">Track Progress</h4>
                <p className="text-white/80">Watch your Spanish skills grow with detailed progress tracking</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
} 
'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CryptoPodcastsPage() {
  return (
    <div className="min-h-screen bg-[#2D1B36]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#E94F37] mb-10">
          <h1 className="text-4xl md:text-5xl font-scifi text-[#F6E8EA] text-center">
            Crypto en Español
          </h1>
          <p className="text-[#F6E8EA]/80 text-xl text-center">
            Learn the Spanish you actually need for Devconnect
          </p>
        </div>

        {/* Intro Section */}
        <div className="bg-[#F7A072] p-6 mb-10">
          <p className="text-[#2D1B36] text-lg">
            Forget ordering coffee or asking for directions - here you&apos;ll learn the Spanish vocabulary you really need for Devconnect. 
            From blockchain basics to DeFi discussions, we&apos;ve curated Spanish content that matters for crypto developers and enthusiasts.
          </p>
          <p className="text-[#2D1B36] text-lg mt-4">
            We&apos;ll be adding more Spanish crypto content soon!
            Don&apos;t miss out on the latest updates.
          </p>
        </div>

        {/* Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Link href="/crypto-podcasts/bbc-bitcoin-basics" className="block">
            <div className="bg-[#2D1B36] border border-[#F6E8EA]/10 hover:border-[#F7A072] transition-colors">
              {/* Video Thumbnail */}
              <div className="aspect-video relative">
                <Image 
                  src="https://img.youtube.com/vi/C-3aYnhF6Io/maxresdefault.jpg"
                  alt="BBC Bitcoin Basics Video Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-[#F7A072] text-xl font-scifi mb-2">Bitcoin Basics</h3>
                <p className="text-[#F6E8EA]/80">
                  A clear, beginner-friendly explanation of Bitcoin in Spanish. Learn essential crypto vocabulary while understanding the fundamentals of blockchain technology.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[#F6E8EA]/60">
                  <span>🎥 BBC</span>
                  <span>⏱️ 2:33</span>
                  <span>🔤 A2-B1</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 
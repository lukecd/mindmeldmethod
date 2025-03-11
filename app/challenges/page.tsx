'use client'

import Link from 'next/link'

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-[#2D1B36] pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[#E94F37] mb-10">
          <h1 className="text-4xl md:text-5xl font-scifi text-[#F6E8EA] text-center py-4">
            Language Challenges
          </h1>
          <p className="text-[#F6E8EA]/80 text-xl text-center pb-4 font-mono">
            Proof of Español.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-10">
          <Link 
            href="/challenges/current" 
            className="inline-block bg-[#F7A072] text-[#2D1B36] font-mono px-8 py-4 text-xl hover:opacity-90 transition-opacity"
          >
            Soon™
          </Link>
        </div>
      </div>
    </div>
  )
} 
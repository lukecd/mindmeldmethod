'use client'

import Link from 'next/link'

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-[color:var(--color-bg-nav)] mb-10">
          <h1 className="text-4xl md:text-5xl font-title text-[color:var(--color-text-inverse)] text-center py-4">
            Language Challenges
          </h1>
          <p className="text-[color:var(--color-text-inverse)]/80 text-xl text-center pb-4 font-mono">
            Proof of Español.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-10">
          <Link 
            href="/challenges/current" 
            className="inline-block bg-[color:var(--color-accent-secondary)] text-[color:var(--color-text-inverse)] font-mono px-8 py-4 text-xl hover:opacity-90 transition-opacity"
          >
            Soon™
          </Link>
        </div>
      </div>
    </div>
  )
} 
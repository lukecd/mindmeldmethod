'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#2D1B36] pt-20 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-[#E94F37] p-8 mb-8">
          <h1 className="text-center text-4xl md:text-5xl font-scifi text-[#F6E8EA] mb-4">
            About Mind Meld Method
          </h1>
          <p className="text-xl text-center text-[#F6E8EA]/80">
            Learn Spanish like a dev. No more &quot;¿Dónde está la biblioteca?&quot; - let&apos;s talk about blockchains.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-[#F6E8EA]">
          {/* Intro Section */}
          <div className="bg-[#2D1B36] p-6 border border-[#F6E8EA]/10">
            <p className="text-lg mb-4">
              gm. Mind Meld Method started with a simple observation: traditional language learning 
              apps are great if you want to order coffee, but what if you need to explain 
              zero-knowledge proofs in Spanish? 🤔
            </p>
            <p className="text-lg">
              We&apos;re building the language learning stack we all need to get ready for Devconnect in Buenos Aires. Think of it as npm for your brain ... or pnpm ... or whatever is better.
            </p>
          </div>

          {/* Core Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#2D1B36] p-6 border border-[#F6E8EA]/10">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-scifi text-[#F7A072] mb-2">Visual Flashcards</h3>
              <p className="text-[#F6E8EA]/80">
                Using the science-backed techniques from Fluent Forever, our flashcards help you 
                memorize the top 500 Spanish words through visual associations. It&apos;s like 
                creating pointer references in your brain.
              </p>
            </div>

            <div className="bg-[#2D1B36] p-6 border border-[#F6E8EA]/10">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-xl font-scifi text-[#F7A072] mb-2">Crypto Content</h3>
              <p className="text-[#F6E8EA]/80">
                Learn Spanish through annotated crypto videos and podcasts. No more 
                &quot;El bolígrafo está sobre la mesa&quot; - we&apos;re talking DeFi, NFTs, and blockchain 
                fundamentals.
              </p>
            </div>

            <div className="bg-[#2D1B36] p-6 border border-[#F6E8EA]/10">
              <div className="text-3xl mb-4">⛓️</div>
              <h3 className="text-xl font-scifi text-[#F7A072] mb-2">Onchain Challenges</h3>
              <p className="text-[#F6E8EA]/80">
                <span className="text-[#F7A072]">Coming soon™</span> - Practice your Spanish by 
                completing onchain challenges. Because why shouldn&apos;t language learning be 
                trustless and verifiable?
              </p>
            </div>

            <div className="bg-[#2D1B36] p-6 border border-[#F6E8EA]/10">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-xl font-scifi text-[#F7A072] mb-2">Personal Flashcards</h3>
              <p className="text-[#F6E8EA]/80">
                <span className="text-[#F7A072]">Coming soon™</span> - Create your own flashcards 
                with our visual memory system. Fork our base deck and add your own commits.
              </p>
            </div>
          </div>

          {/* Credits Section */}
          <div className="bg-[#2D1B36] p-6 border border-[#F6E8EA]/10">
            <h2 className="text-2xl font-scifi text-[#F7A072] mb-4">Credits & Inspiration</h2>
            <p className="text-lg mb-4">
              Our visual flashcard system is inspired by{' '}
              <a 
                href="https://fluent-forever.com/book/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#F7A072] hover:underline"
              >
                Fluent Forever
              </a>
              , the groundbreaking book by Gabriel Wyner that revolutionized language learning 
              through neuroscience and visual memory techniques.
            </p>
            <p className="text-lg">
              We&apos;ve taken these proven methods and optimized them for the Web3 community, 
              because we believe the future of global collaboration needs a better way to break 
              down language barriers.
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-[#F7A072] p-8 text-center">
            <h2 className="text-2xl font-scifi text-[#2D1B36] mb-4">
              Ready to npm install some Spanish?
            </h2>
            <Link 
              href="/basics/unit-1" 
              className="inline-block bg-[#2D1B36] text-[#F6E8EA] px-6 py-3 rounded hover:bg-[#3D5A80] transition-colors"
            >
              Start Learning →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
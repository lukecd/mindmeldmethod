'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-[color:var(--color-bg-nav)] p-8 mb-8">
          <h1 className="text-center text-4xl md:text-5xl font-title text-[color:var(--color-text-inverse)] mb-4">
            About Mind Meld Method
          </h1>
          <p className="text-xl text-center text-[color:var(--color-text-inverse)]/80">
            Learn Spanish like a dev. No more &quot;¿Dónde está la biblioteca?&quot; - let&apos;s talk about blockchains.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 text-[color:var(--color-text-on-dark)]">
          {/* Intro Section */}
          <div className="bg-[color:var(--color-bg-card)] p-6 border border-[color:var(--color-text-on-dark)]/10">
            <p className="text-lg mb-4">
              gm. Mind Meld Method started with a simple observation: traditional language learning 
              apps are great if you want to order coffee, but what if you need to explain 
              zero-knowledge proofs in Spanish? 🤔
            </p>
            <p className="text-lg">
              We&apos;re building the language learning stack we all need to get ready for Devconnect in Buenos Aires. Think of it as npm for your brain ... or pnpm ... or whatever is better.
            </p>
          </div>

          {/* Learning Technique Section */}
          <div className="bg-[color:var(--color-bg-card)] p-6 border border-[color:var(--color-text-on-dark)]/10">
            <h2 className="text-2xl font-title text-[color:var(--color-accent-primary)] mb-4">Our Learning Architecture</h2>
            
            {/* Visual Flashcards */}
            <div className="mb-6">
              <h3 className="text-xl font-title text-[color:var(--color-accent-secondary)] mb-2">Visual Flashcards</h3>
              <p className="mb-3">
                Our system implements the visual memory techniques from Gabriel Wyner's <i>Fluent Forever</i>. 
                Rather than relying on direct translations (which create a dependency on your native language), 
                we use images to create direct neural pathways between concepts and Spanish words.
              </p>
              <p>
                This approach bypasses the translation layer, similar to how compiled languages skip the interpreter. 
                The result is faster recall and more native-like processing of the language. Each flashcard contains 
                visual cues that help form these direct neural connections, optimizing for both memory efficiency and retrieval speed.
              </p>
            </div>
            
            {/* Spaced Repetition */}
            <div className="mb-6">
              <h3 className="text-xl font-title text-[color:var(--color-accent-secondary)] mb-2">Spaced Repetition System (SRS)</h3>
              <p className="mb-3">
                Our implementation uses a modified version of the SM-2 algorithm, originally developed for SuperMemo and later 
                forked by Anki. The algorithm calculates optimal review intervals based on your performance:
              </p>
              <div className="bg-[color:var(--color-bg-main)] p-4 rounded font-mono text-sm mb-3 overflow-x-auto">
                <pre>{`// Simplified SM-2 algorithm implementation
function calculateNextInterval(card, quality) {
  if (quality < 3) {
    // Failed recall - reset repetitions
    card.repetitions = 0;
    return 1; // Review again in 1 day
  } else {
    // Successful recall
    if (card.repetitions === 0) {
      return 1; // First success: review in 1 day
    } else if (card.repetitions === 1) {
      return 6; // Second success: review in 6 days
    } else {
      // Calculate new interval based on previous interval and ease factor
      return Math.round(card.interval * card.easeFactor);
    }
  }
}`}</pre>
              </div>
              <p>
                Each card maintains state variables including <code>interval</code> (days until next review), 
                <code>easeFactor</code> (multiplier for interval growth), and <code>repetitions</code> (successful recall count). 
                These variables are updated after each review based on your performance, creating a personalized review schedule 
                that optimizes for long-term retention with minimal time investment.
              </p>
            </div>
            
            {/* The Forgetting Curve */}
            <div>
              <h3 className="text-xl font-title text-[color:var(--color-accent-secondary)] mb-2">Exploiting the Forgetting Curve</h3>
              <p className="mb-3">
                Our system leverages Ebbinghaus's Forgetting Curve and the concept of the "retrieval practice effect" 
                (sometimes called "desirable difficulty" or "the spacing effect"). The key insight is that memory 
                retention is maximized when information is recalled just before it would otherwise be forgotten.
              </p>
              <p className="mb-3">
                This creates what cognitive scientists call the "spacing effect" - the phenomenon where learning is more 
                effective when study sessions are spaced out over time. By scheduling reviews at increasing intervals, 
                we force your brain to work harder to retrieve the information, which paradoxically strengthens the neural pathways.
              </p>
              <p>
                Think of it as stress-testing your memory: each successful retrieval under difficulty strengthens the connection, 
                similar to how distributed systems become more resilient through chaos engineering. The algorithm intentionally 
                pushes you to the edge of forgetting, creating just enough cognitive friction to optimize for long-term retention.
              </p>
            </div>
          </div>

          {/* Credits Section */}
          <div className="bg-[color:var(--color-bg-card)] p-6 border border-[color:var(--color-text-on-dark)]/10">
            <h2 className="text-2xl font-title text-[color:var(--color-accent-primary)] mb-4">Credits & Inspiration</h2>
            <p className="text-lg mb-4">
              Our visual flashcard system is inspired by{' '}
              <a 
                href="https://fluent-forever.com/book/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[color:var(--color-accent-primary)] hover:underline"
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
          <div className="bg-[color:var(--color-accent-primary)] p-8 text-center">
            <h2 className="text-2xl font-title text-[color:var(--color-text-inverse)] mb-4">
              Ready to npm install some Spanish?
            </h2>
            <Link 
              href="/basics/" 
              className="inline-block bg-[color:var(--color-bg-card)] text-[color:var(--color-text-on-dark)] px-6 py-3 rounded hover:bg-[color:var(--color-bg-nav)] transition-colors"
            >
              Start Learning →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
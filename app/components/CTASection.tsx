import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="bg-[color:var(--color-bg-highlight)] py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-title text-[color:var(--color-text-inverse)] mb-6">
          Ready to Start Learning?
        </h2>
        <p className="text-[color:var(--color-text-inverse)]/80 text-xl mb-8 max-w-2xl mx-auto">
          Join us on this journey to master Spanish through a developer&apos;s mindset. 
          Start with the basics and work your way up to understanding crypto content in Spanish.
        </p>
        <Link 
          href="/basics/unit-1" 
          className="inline-block bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] px-8 py-4 text-xl hover:bg-[color:var(--color-button-hover)] transition-colors"
        >
          Begin Your Journey →
        </Link>
      </div>
    </section>
  )
} 
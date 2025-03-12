import Image from 'next/image'

export default function VisualCuesSection() {
  return (
    <section className="bg-[color:var(--color-bg-main)] py-12 px-4">
      <div className="container mx-auto relative">
        {/* Main content grid */}
        <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* Title card */}
          <div className="col-span-12 lg:col-span-12 bg-[color:var(--color-bg-nav)] p-6">
            <h2 className="text-center text-3xl md:text-4xl font-title text-[color:var(--color-text-inverse)] leading-tight">
              Our flashcards use visual cues to help trick your brain into memorizing faster.
            </h2>
          </div>

          {/* Image card */}
          <div className="col-span-12 lg:col-span-8 relative aspect-[16/9] overflow-hidden bg-[color:var(--color-bg-card)]">
            <Image
              src="/images/nouns/dia.webp"
              alt="Visual representation of 'día' using a deer"
              fill
              className="object-cover"
            />
          </div>

          {/* Explanation card */}
          <div className="col-span-12 lg:col-span-4 bg-[color:var(--color-accent-primary)] p-6 flex flex-col justify-center">
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 bg-[color:var(--color-text-inverse)] flex items-center justify-center text-2xl">
                🦌
              </div>
              <div className="w-12 h-12 bg-[color:var(--color-text-inverse)] flex items-center justify-center text-2xl">
                ☀️
              </div>
            </div>
            <p className="text-xl text-[color:var(--color-text-inverse)] font-medium mb-4">
              <span className="font-title">DEER</span> = <span className="font-title">DÍA</span>
            </p>
            <p className="text-[color:var(--color-text-inverse)]/80 text-lg">
              A deer leaping over the rising sun represents &quot;día&quot; (day) in Spanish. The word &quot;deer&quot; in English sounds just like &quot;día&quot; in Spanish!
            </p>
          </div>

          <div className="col-span-12 lg:col-span-12 bg-[color:var(--color-bg-nav)] p-6">
            <div className="text-[color:var(--color-text-inverse)]/60 text-sm text-center mt-2">
              Visual learning technique inspired by{' '}
              <a href="https://www.amazon.com/Fluent-Forever-Learn-Language-Forget/dp/0385348118" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[color:var(--color-text-inverse)]/80 hover:underline">
                Fluent Forever
              </a>
              {' '}and{' '}
              <a href="https://www.youtube.com/watch?v=29tITqtnJU4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--color-text-inverse)]/80 hover:underline">
                LanguageJones
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
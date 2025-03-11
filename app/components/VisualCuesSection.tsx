import Image from 'next/image'

export default function VisualCuesSection() {
  return (
    <section className="bg-[#2D1B36] py-12 px-4">
      <div className="container mx-auto relative">
        {/* Main content grid */}
        <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* Title card */}
          <div className="col-span-12 lg:col-span-12 bg-[#E94F37] p-6">
            <h2 className="text-center text-3xl md:text-4xl font-scifi text-[#F6E8EA] leading-tight">
              Our flashcards use visual cues to help trick your brain into memorizing faster.
            </h2>
          </div>

          {/* Image card */}
          <div className="col-span-12 lg:col-span-8 relative aspect-[16/9] overflow-hidden bg-[#2D1B36]">
            <Image
              src="/images/nouns/dia.webp"
              alt="Visual representation of 'día' using a deer"
              fill
              className="object-cover"
            />
          </div>

          {/* Explanation card */}
          <div className="col-span-12 lg:col-span-4 bg-[#F7A072] p-6 flex flex-col justify-center">
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F6E8EA] flex items-center justify-center text-2xl">
                🦌
              </div>
              <div className="w-12 h-12 bg-[#F6E8EA] flex items-center justify-center text-2xl">
                ☀️
              </div>
            </div>
            <p className="text-xl text-[#2D1B36] font-medium mb-4">
              <span className="font-scifi">DEER</span> = <span className="font-scifi">DÍA</span>
            </p>
            <p className="text-[#2D1B36]/80 text-lg">
              A deer leaping over the rising sun represents &quot;día&quot; (day) in Spanish. The word &quot;deer&quot; in English sounds just like &quot;día&quot; in Spanish!
            </p>
          </div>

          <div className="col-span-12 lg:col-span-12 bg-[#E94F37] p-6">
            <div className="text-[#F6E8EA]/60 text-sm text-center mt-2">
              Visual learning technique inspired by{' '}
              <a href="https://www.amazon.com/Fluent-Forever-Learn-Language-Forget/dp/0385348118" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#F6E8EA]/80 hover:underline">
                Fluent Forever
              </a>
              {' '}and{' '}
              <a href="https://www.youtube.com/watch?v=29tITqtnJU4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F6E8EA]/80 hover:underline">
                LanguageJones
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
} 
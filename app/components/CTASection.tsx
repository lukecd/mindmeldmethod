import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="bg-[#2D1B36] py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#E94F37] p-12 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-scifi text-[#F6E8EA] text-center mb-8">
              Ready to Start Learning?
            </h2>
            <Link 
              href="/basics" 
              className="bg-[#2D1B36] p-6 text-2xl font-scifi text-[#F7A072] hover:text-[#E94F37] transition-colors"
            >
              Start Learning Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 
import Link from 'next/link'

const units = [
  {
    id: 1,
    title: "Unit 1",
    subtitle: "Essential Basics",
    isActive: true,
    progress: 0
  },
  ...Array(9).fill(null).map((_, i) => ({
    id: i + 2,
    title: `Unit ${i + 2}`,
    subtitle: "Locked",
    isActive: false,
    progress: 0
  }))
]

export default function BasicsPage() {
  return (
    <div className="min-h-screen bg-[#2D1B36] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#E94F37] p-6 mb-8 mt-10">
          <h1 className="text-5xl font-scifi text-[#F6E8EA] text-center mb-4">Learning Path</h1>
          <p className="text-[#F6E8EA]/80 max-w-2xl mx-auto text-center">
            Brains need to be tricked into memorizing. We got you covered.
          </p>
        </div>
        
        {/* Units Grid */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#F26B3C] -translate-x-1/2" />
          
          {/* Units */}
          <div className="relative space-y-4">
            {units.map((unit, index) => (
              <div key={unit.id} className="relative">
                {/* Connection dot */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full ${unit.isActive ? 'bg-[#F7A072]' : 'bg-[#F6E8EA]/20'}`} />
                  {unit.isActive && (
                    <div className="absolute w-10 h-10 rounded-full bg-[#F7A072] opacity-50 animate-ping" />
                  )}
                </div>
                
                {/* Unit card */}
                <div 
                  className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}
                    p-4 shadow-lg transition-all hover:scale-105
                    ${unit.isActive 
                      ? 'bg-[#2D1B36] border-2 border-[#F26B3C]' 
                      : 'bg-[#2D1B36] border border-[#F6E8EA]/10'} 
                    ${index % 2 === 0 ? 'hover:translate-x-2' : 'hover:-translate-x-2'}
                  `}
                >
                  {unit.isActive ? (
                    <Link href={`/basics/unit-${unit.id}`} className="block group">
                      <div className="bg-[#E94F37] p-4 mb-4">
                        <h2 className="text-3xl font-scifi text-[#F6E8EA]">{unit.title}</h2>
                        <p className="text-[#F6E8EA]/80 font-medium">{unit.subtitle}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-[#2D1B36] p-4 border border-[#F6E8EA]/10">
                        <div className="text-[#F7A072] group-hover:text-[#E94F37] transition-colors">Begin Journey →</div>
                        <div className="flex-1 h-3 bg-[#F6E8EA]/5 overflow-hidden">
                          <div 
                            className="h-full bg-[#F7A072] transition-all duration-300" 
                            style={{ width: `${unit.progress}%` }} 
                          />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="opacity-80">
                      <div className="bg-[#2D1B36] p-4 mb-4 border border-[#F6E8EA]/10">
                        <h2 className="text-2xl font-scifi text-[#F6E8EA]/60">{unit.title}</h2>
                        <p className="text-[#F6E8EA]/40">{unit.subtitle}</p>
                      </div>
                      <div className="bg-[#2D1B36] p-4 flex items-center gap-3 border border-[#F6E8EA]/10">
                        <span className="text-[#F6E8EA]/40">🔒</span>
                        <span className="text-[#F6E8EA]/40 text-sm">Complete previous unit to unlock</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
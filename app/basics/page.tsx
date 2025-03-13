'use client'

import Link from 'next/link'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { useEffect, useState, useMemo } from 'react'
import { useAddress } from '@chopinframework/react'

interface Unit {
  id: number
  title: string
  subtitle: string
  isActive: boolean
  progress: number
}

const UNIT_SUBTITLES = {
  1: "Essential Basics",
  2: "Building Vocabulary",
  3: "Common Phrases",
  4: "Daily Conversations",
  5: "Travel & Directions",
  6: "Food & Dining",
  7: "Work & Business",
  8: "Social Situations",
  9: "Culture & Entertainment",
  10: "Advanced Topics"
}

export default function BasicsPage() {
  const { address } = useAddress()
  const { getHighestCompletedUnit } = useSpacedRepetition(address)
  const [units, setUnits] = useState<Unit[]>([])

  // Get the highest completed unit
  const highestCompleted = useMemo(() => {
    return getHighestCompletedUnit()
  }, [getHighestCompletedUnit])

  // Create units array
  useEffect(() => {
    console.log('🔓 Setting up units based on completion:', { highestCompleted })

    const newUnits: Unit[] = Array(10).fill(null).map((_, i) => {
      const id = i + 1
      return {
        id,
        title: `Unit ${id}`,
        subtitle: UNIT_SUBTITLES[id as keyof typeof UNIT_SUBTITLES],
        isActive: id === 1 || id <= highestCompleted + 1,
        progress: 0 // TODO: Calculate actual progress
      }
    })

    setUnits(newUnits)
  }, [highestCompleted]) // Only depend on highestCompleted, not the function

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-[color:var(--color-bg-nav)] p-6 mb-8 mt-10">
          <h1 className="text-4xl font-title text-[color:var(--color-text-inverse)] text-center mb-4">Aprendiendo las 300 palabras principales en español</h1>
          <p className="text-[color:var(--color-text-inverse)]/80 max-w-2xl mx-auto text-center">
            Brains need to be tricked into memorizing. We got you covered.
          </p>
        </div>
        
        {/* Units Grid */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[color:var(--color-accent-primary)] -translate-x-1/2" />
          
          {/* Units */}
          <div className="relative space-y-4">
            {units.map((unit, index) => (
              <div key={unit.id} className="relative">
                {/* Connection dot */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full ${unit.isActive ? 'bg-[color:var(--color-accent-primary)]' : 'bg-[color:var(--color-text-inverse)]/20'}`} />
                  {unit.isActive && (
                    <div className="absolute w-10 h-10 rounded-full bg-[color:var(--color-accent-primary)] opacity-50 animate-ping" />
                  )}
                </div>
                
                {/* Unit card */}
                <div 
                  className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}
                    p-4 shadow-lg transition-all hover:scale-105
                    ${unit.isActive 
                      ? 'bg-[color:var(--color-bg-card)] border-2 border-[color:var(--color-accent-primary)]' 
                      : 'bg-[color:var(--color-bg-card)] border border-[color:var(--color-text-on-dark)]/10'} 
                    ${index % 2 === 0 ? 'hover:translate-x-2' : 'hover:-translate-x-2'}
                  `}
                >
                  {unit.isActive ? (
                    <Link href={`/basics/unit/${unit.id}`} className="block group">
                      <div className="bg-[color:var(--color-bg-nav)] p-4 mb-4">
                        <h2 className="text-3xl font-title text-[color:var(--color-text-inverse)]">{unit.title}</h2>
                        <p className="text-[color:var(--color-text-inverse)]/80 font-medium">{unit.subtitle}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-[color:var(--color-bg-card)] p-4 border border-[color:var(--color-text-on-dark)]/10">
                        <div className="text-[color:var(--color-accent-secondary)] group-hover:text-[color:var(--color-bg-nav)] transition-colors">Begin Journey →</div>
                        <div className="flex-1 h-3 bg-[color:var(--color-text-on-dark)]/5 overflow-hidden">
                          <div 
                            className="h-full bg-[color:var(--color-accent-primary)] transition-all duration-300" 
                            style={{ width: `${unit.progress}%` }} 
                          />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="opacity-80">
                      <div className="bg-[color:var(--color-bg-card)] p-4 mb-4 border border-[color:var(--color-text-on-dark)]/10">
                        <h2 className="text-2xl font-title text-[color:var(--color-text-on-dark)]/60">{unit.title}</h2>
                        <p className="text-[color:var(--color-text-on-dark)]/40">{unit.subtitle}</p>
                      </div>
                      <div className="bg-[color:var(--color-bg-card)] p-4 flex items-center gap-3 border border-[color:var(--color-text-on-dark)]/10">
                        <span className="text-[color:var(--color-text-on-dark)]/40">🔒</span>
                        <span className="text-[color:var(--color-text-on-dark)]/40 text-sm">Complete previous unit to unlock</span>
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
'use client'

import Link from 'next/link'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { useEffect, useState } from 'react'
import { useAddress } from '@chopinframework/react'
import LoadingSpinner from '../components/LoadingSpinner'

interface Unit {
  id: number
  title: string
  isActive: boolean
  progress: number
  completedWords: number
  totalWords: number
}


export default function BasicsPage() {
  const { address } = useAddress()
  const { deck } = useSpacedRepetition(address)
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isDeckLoading = !deck

  // Determine unit access and progress directly from the deck
  useEffect(() => {
    if (isDeckLoading) {
      return; // Wait until deck is loaded
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔍 DEBUG - Loading units from deck:', {
        deckLoaded: Boolean(deck),
        userId: deck?.userId,
        totalCards: deck?.cards.length || 0,
        completedUnits: deck?.completedUnits || []
      });
      
      // Create units array with data from the deck
      const newUnits: Unit[] = Array(10).fill(null).map((_, i) => {
        const id = i + 1;
        
        // Get cards for this unit
        const unitCards = deck?.cards.filter(card => card.unit === id) || [];
        const completedWords = unitCards.filter(card => card.repetitions > 0).length;
        const totalWords = unitCards.length;
        const progressPercentage = totalWords > 0 
          ? Math.round((completedWords / totalWords) * 100) 
          : 0;
        
        // Determine if this unit is accessible
        let isActive = false;
        
        if (id === 1) {
          // Unit 1 is always accessible, but only if not completed
          const isUnitCompleted = deck.completedUnits && deck.completedUnits.includes(id);
          isActive = !isUnitCompleted;
        } else if (deck) {
          // For other units, check if the previous unit is completed
          const previousUnitId = id - 1;
          
          // First check if this unit is already completed
          const isUnitCompleted = deck.completedUnits && deck.completedUnits.includes(id);
          
          if (isUnitCompleted) {
            // If the unit is completed, it's not active (not clickable)
            isActive = false;
          } else {
            // Check if previous unit is in completedUnits array
            if (deck.completedUnits && deck.completedUnits.includes(previousUnitId)) {
              isActive = true;
            } else {
              // Check if all cards in previous unit have repetitions > 0
              const previousUnitCards = deck.cards.filter(card => card.unit === previousUnitId);
              const allPreviousUnitCardsCompleted = previousUnitCards.length > 0 && 
                previousUnitCards.every(card => card.repetitions > 0);
              
              if (allPreviousUnitCardsCompleted) {
                isActive = true;
              }
            }
            
            // Only allow access to the next unit after the highest started unit
            const highestStartedUnit = Math.max(1, ...deck.cards.map(card => card.unit));
            if (id > highestStartedUnit + 1) {
              isActive = false;
            }
          }
        }
        
        // Log detailed information for debugging
        if (id <= 3) {
          console.log(`🔍 DEBUG - Unit ${id} access check:`, {
            id,
            isActive,
            totalWords,
            completedWords,
            progressPercentage,
            isPreviousUnitCompleted: id > 1 ? deck?.completedUnits?.includes(id - 1) : true,
            allPreviousUnitCardsCompleted: id > 1 ? deck?.cards.filter(card => card.unit === id - 1).every(card => card.repetitions > 0) : true,
            completedUnits: deck?.completedUnits
          });
        }
        
        return {
          id,
          title: `Unit ${id}`,
          isActive,
          progress: progressPercentage,
          completedWords,
          totalWords
        };
      });
      
      // Log the final units array for debugging
      console.log('🔍 DEBUG - Final units array:', newUnits.map(unit => ({
        id: unit.id,
        isActive: unit.isActive,
        progress: unit.progress,
        completedWords: unit.completedWords,
        totalWords: unit.totalWords
      })));
      
      setUnits(newUnits);
    } catch (error) {
      console.error('Error determining unit access:', error);
    } finally {
      setIsLoading(false);
    }
  }, [deck, isDeckLoading]);

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
        
        {/* Loading state */}
        {(isLoading || isDeckLoading) && (
          <div className="flex justify-center items-center py-20 h-64">
            <LoadingSpinner />
          </div>
        )}
        
        {/* Units Grid */}
        {!isLoading && !isDeckLoading && (
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
                      unit.progress === 100 ? (
                        // For completed units, show a non-clickable div instead of a link
                        <div className="block group">
                          <div className="bg-[color:var(--color-bg-nav)] p-4 mb-4">
                            <h2 className="text-3xl font-title text-[color:var(--color-text-inverse)]">{unit.title}</h2>
                          </div>
                          
                          <div className="flex flex-col gap-2 bg-[color:var(--color-bg-card)] p-4 border border-[color:var(--color-text-on-dark)]/10">
                            <div className="text-[color:var(--color-accent-secondary)]">
                              Unit Completed ✓
                            </div>
                            <div className="flex-1 h-3 bg-[color:var(--color-text-on-dark)]/5 overflow-hidden">
                              <div 
                                className="h-full bg-[color:var(--color-accent-primary)] transition-all duration-300" 
                                style={{ width: `${unit.progress}%` }}
                              />
                            </div>
                            <div className="text-sm text-[color:var(--color-text-primary)]">
                              {unit.completedWords} of {unit.totalWords} words completed
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link href={`/basics/unit/${unit.id}`} className="block group">
                          <div className="bg-[color:var(--color-bg-nav)] p-4 mb-4">
                            <h2 className="text-3xl font-title text-[color:var(--color-text-inverse)]">{unit.title}</h2>
                          </div>
                          
                          <div className="flex flex-col gap-2 bg-[color:var(--color-bg-card)] p-4 border border-[color:var(--color-text-on-dark)]/10">
                            <div className="text-[color:var(--color-accent-secondary)] group-hover:text-[color:var(--color-bg-nav)] transition-colors">
                              {unit.completedWords > 0 ? 'Continue Learning →' : 'Begin Journey →'}
                            </div>
                            <div className="flex-1 h-3 bg-[color:var(--color-text-on-dark)]/5 overflow-hidden">
                              <div 
                                className="h-full bg-[color:var(--color-accent-primary)] transition-all duration-300" 
                                style={{ width: `${unit.progress}%` }} 
                              />
                            </div>
                            <div className="text-sm text-[color:var(--color-text-primary)]">
                              {unit.completedWords} of {unit.totalWords} words completed
                            </div>
                          </div>
                        </Link>
                      )
                    ) : (
                      <div className="opacity-80">
                        <div className="bg-[color:var(--color-bg-card)] p-4 mb-4 border border-[color:var(--color-text-on-dark)]/10">
                          <h2 className="text-2xl font-title text-[color:var(--color-text-on-dark)]/60">{unit.title}</h2>
                        </div>
                        <div className="bg-[color:var(--color-bg-card)] p-4 flex flex-col gap-2 border border-[color:var(--color-text-on-dark)]/10">
                          <div className="flex items-center gap-3">
                            <span className="text-[color:var(--color-text-on-dark)]/40">🔒</span>
                            <span className="text-[color:var(--color-text-on-dark)]/40 text-sm">Complete all words in Unit {unit.id - 1} to unlock</span>
                          </div>
                          {unit.id > 1 && units[unit.id - 2] && (
                            <div className="text-xs text-[color:var(--color-text-on-dark)]/40 mt-1">
                              Progress: {units[unit.id - 2].completedWords} of {units[unit.id - 2].totalWords} words completed in previous unit
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
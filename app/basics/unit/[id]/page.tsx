'use client'

import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import UnitContent from './UnitContent'
import { useSpacedRepetition } from '../../../hooks/useSpacedRepetition'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { useAddress } from '@chopinframework/react'

const UNIT_TITLES = {
  '1': 'Essential Basics',
  '2': 'Building Vocabulary',
  '3': 'Common Phrases',
  '4': 'Daily Conversations',
  '5': 'Travel & Directions',
  '6': 'Food & Dining',
  '7': 'Work & Business',
  '8': 'Social Situations',
  '9': 'Culture & Entertainment',
  '10': 'Advanced Topics'
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function UnitPage({ params }: PageProps) {
  const { id: unitId } = use(params)
  const router = useRouter()
  const { address } = useAddress()
  const { deck } = useSpacedRepetition(address)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unitAccess, setUnitAccess] = useState<{
    isStarted: boolean
    completedWords: number
    totalWords: number
    canAccess: boolean
    previousUnitCompletion: number
  } | null>(null)

  const unitTitle = UNIT_TITLES[unitId as keyof typeof UNIT_TITLES]

  // Validate unit ID
  if (!unitTitle || isNaN(Number(unitId)) || Number(unitId) < 1 || Number(unitId) > 10) {
    console.log('🚫 Invalid unit ID:', unitId)
    notFound()
  }

  // Check unit access directly from the deck
  useEffect(() => {
    let isMounted = true

    function checkUnitAccess() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to get the deck directly from localStorage if it's not available from the hook
        let localDeck = deck;
        
        if (!localDeck && address && typeof window !== 'undefined') {
          try {
            const key = `deck-${address}`;
            const saved = localStorage.getItem(key);
            if (saved) {
              localDeck = JSON.parse(saved);
              console.log('🔍 DEBUG - Found deck in localStorage:', { 
                userId: localDeck?.userId, 
                totalCards: localDeck?.cards?.length || 0,
                completedUnits: localDeck?.completedUnits || [] 
              });
            }
          } catch (error) {
            console.error('Error reading localStorage:', error);
          }
        }
        
        // Add more detailed debugging
        console.log('🔍 DETAILED DEBUG - Unit access check:', {
          unitId,
          address,
          deckLoaded: Boolean(localDeck),
          deckUserId: localDeck?.userId,
          totalCards: localDeck?.cards?.length || 0,
          completedUnits: localDeck?.completedUnits || [],
          unit1Cards: localDeck?.cards ? localDeck.cards.filter(c => c.unit === 1).length : 0,
          unit1CompletedCards: localDeck?.cards ? localDeck.cards.filter(c => c.unit === 1 && c.repetitions > 0).length : 0,
          unit1AllCompleted: localDeck?.cards && localDeck.cards.filter(c => c.unit === 1).length > 0 ? 
            localDeck.cards.filter(c => c.unit === 1).every(c => c.repetitions > 0) : false,
          unit1InCompletedUnits: localDeck?.completedUnits?.includes(1)
        });
        
        // Default values
        let isStarted = false;
        let completedWords = 0;
        let totalWords = 0;
        let canAccess = Number(unitId) === 1; // Unit 1 is always accessible
        let previousUnitCompletion = 0;
        
        if (localDeck) {
          // Get cards for this unit
          const unitCards = localDeck.cards.filter(card => card.unit === Number(unitId));
          isStarted = unitCards.length > 0;
          totalWords = unitCards.length;
          completedWords = unitCards.filter(card => card.repetitions > 0).length;
          
          if (Number(unitId) > 1) {
            const previousUnitId = Number(unitId) - 1;
            
            // Check if previous unit is in completedUnits array
            if (localDeck.completedUnits && localDeck.completedUnits.includes(previousUnitId)) {
              canAccess = true;
              previousUnitCompletion = 1.0;
            } else {
              // Check if all cards in previous unit have repetitions > 0
              const previousUnitCards = localDeck.cards.filter(card => card.unit === previousUnitId);
              
              if (previousUnitCards.length > 0) {
                const completedCardsInPreviousUnit = previousUnitCards.filter(card => card.repetitions > 0).length;
                previousUnitCompletion = completedCardsInPreviousUnit / previousUnitCards.length;
                
                // If all cards in previous unit are completed, allow access
                if (previousUnitCards.every(card => card.repetitions > 0)) {
                  canAccess = true;
                }
              }
            }
            
            // Only allow access to the next unit after the highest started unit
            const highestStartedUnit = Math.max(1, ...localDeck.cards.map(card => card.unit));
            if (Number(unitId) > highestStartedUnit + 1) {
              canAccess = false;
            }
          }
        }
        
        const accessData = {
          isStarted,
          completedWords,
          totalWords,
          canAccess,
          previousUnitCompletion
        };
        
        console.log('🔍 DEBUG - Unit access result:', {
          unitId,
          ...accessData,
          reason: canAccess ? 'Access granted' : 'Access denied'
        });
        
        if (!isMounted) return
        
        setUnitAccess(accessData)
        setIsLoading(false)

        // Redirect if no access - after a short delay to show the message
        if (!canAccess) {
          console.log('🚫 Access denied, redirecting to basics page')
          setTimeout(() => {
            router.push('/basics')
          }, 3000) // Redirect after 3 seconds
        }
      } catch (error) {
        if (!isMounted) return
        console.error('Error checking unit access:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
        setIsLoading(false)
      }
    }

    checkUnitAccess()

    return () => {
      isMounted = false
    }
  }, [unitId, router, deck, address])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-[color:var(--color-text-inverse)]">Loading unit {unitId}...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-[color:var(--color-text-inverse)]">Error: {error}</div>
      </div>
    )
  }

  // Show access denied state
  if (!unitAccess || !unitAccess.canAccess) {
    const prevUnitId = Number(unitId) - 1;
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-title text-[color:var(--color-text-inverse)] mb-4">Access Denied</h1>
          <p className="text-[color:var(--color-text-inverse)] mb-6">
            {Number(unitId) > 1 
              ? `You need to complete Unit ${prevUnitId} before accessing Unit ${unitId}.`
              : 'You cannot access this unit yet.'}
          </p>
          {unitAccess && Number(unitId) > 1 && (
            <div className="mb-6">
              <p className="text-[color:var(--color-text-inverse)] mb-2">Current progress:</p>
              <div className="w-full h-4 bg-[color:var(--color-text-inverse)]/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[color:var(--color-accent-primary)]" 
                  style={{ width: `${unitAccess.previousUnitCompletion * 100}%` }}
                ></div>
              </div>
              <p className="text-[color:var(--color-text-inverse)] mt-2">
                {Math.round(unitAccess.previousUnitCompletion * 100)}% complete
              </p>
            </div>
          )}
          <p className="text-[color:var(--color-text-inverse)] mb-4">
            Redirecting to the units page...
          </p>
          <Link 
            href="/basics" 
            className="inline-block bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] px-6 py-2"
          >
            Return to Units
          </Link>
        </div>
      </div>
    );
  }

  return <UnitContent unitId={unitId} unitTitle={unitTitle} />
} 
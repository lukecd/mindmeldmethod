import { useState, useEffect } from 'react'
import { UserDeck, UserCard, DeckStats } from '../types/deck'

const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

function formatInterval(days: number): string {
  if (days === 1) return '1 day'
  if (days < 7) return `${days} days`
  if (days === 7) return '1 week'
  if (days < 30) return `${Math.round(days/7)} weeks`
  if (days === 30) return '1 month'
  return `${Math.round(days/30)} months`
}

export function useDeck(userId: string | null) {
  const [deck, setDeck] = useState<UserDeck | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load deck from API
  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    async function loadDeck() {
      try {
        // First check localStorage for existing deck
        let localDeck: UserDeck | null = null;
        if (typeof window !== 'undefined') {
          try {
            const key = `deck-${userId}`
            const saved = localStorage.getItem(key)
            if (saved) {
              localDeck = JSON.parse(saved) as UserDeck
              console.log('Found deck in localStorage:', { userId, xp: localDeck.xp })
            }
          } catch (error) {
            console.error('Error reading localStorage:', error)
          }
        }

        // If we have a valid local deck, use it
        if (localDeck && localDeck.userId === userId) {
          setDeck(localDeck)
          setIsLoading(false)
          return
        }
        
        // Otherwise, try to fetch from API
        const response = await fetch(`/api/deck/${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to load deck')
        }
        
        const data = await response.json()
        console.log('Loaded deck from API:', { userId, xp: data.xp })
        setDeck(data)
      } catch (error) {
        console.error('Error loading deck:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
        
        // If API fails, create a new deck
        if (typeof window !== 'undefined') {
          const newDeck: UserDeck = {
            userId: userId as string, // userId is guaranteed to be non-null here
            cards: [],
            xp: 0,
            completedUnits: [],
            lastSyncedAt: Date.now()
          }
          
          setDeck(newDeck)
          
          // Save to localStorage
          try {
            const key = `deck-${userId}`
            localStorage.setItem(key, JSON.stringify(newDeck))
          } catch (storageError) {
            console.error('Failed to save new deck to localStorage:', storageError)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDeck()
  }, [userId])

  // Save deck to API
  const saveDeck = async (updatedDeck: UserDeck) => {
    if (!userId) return

    try {
      const response = await fetch(`/api/deck/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDeck)
      })

      if (!response.ok) throw new Error('Failed to save deck')
      
      console.log('💾 Saved deck:', {
        userId: updatedDeck.userId,
        totalCards: updatedDeck.cards.length,
        cardsByUnit: updatedDeck.cards.reduce((acc: Record<number, number>, card: UserCard) => {
          acc[card.unit] = (acc[card.unit] || 0) + 1
          return acc
        }, {}),
        timestamp: formatDate(Date.now())
      })
    } catch (err) {
      console.error('Error saving deck:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err // Propagate error to recordAnswer
    }
  }

  // Return early if no userId
  if (!userId) {
    return {
      deck: null,
      isLoading: false,
      error: null,
      addUnit: () => {},
      getDueCards: () => [],
      recordAnswer: () => {},
      getStats: () => ({
        totalCards: 0,
        cardsPerUnit: {},
        totalReviews: 0,
        masteredCards: 0
      }),
      hasStartedUnit: () => false,
      getHighestStartedUnit: () => 0
    }
  }

  const addUnit = async (unitNumber: number) => {
    if (!deck) return

    // Load unit words from JSON
    const response = await fetch(`/data/${String(unitNumber).padStart(2, '0')}_words.json`)
    const data = await response.json()
    const unitWords: { id: string; unit: number; spanish: string }[] = data.words

    const newCards: UserCard[] = unitWords.map(word => ({
      wordId: word.id,
      addedAt: Date.now(),
      unit: unitNumber,
      easeFactor: DEFAULT_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReview: Date.now(),
      lastReview: 0
    }))

    console.log('➕ Adding cards to deck:', {
      userId: deck.userId,
      unit: unitNumber,
      newCards: newCards.length,
      words: unitWords.map(w => ({ id: w.id, spanish: w.spanish }))
    })

    const updatedDeck = {
      ...deck,
      cards: [...deck.cards, ...newCards],
      lastSyncedAt: Date.now()
    }

    await saveDeck(updatedDeck)
  }

  // Get cards that are due for review
  const getDueCards = (unitNumber?: number) => {
    if (!deck) return []
    
    const now = Date.now()
    const dueCards = deck.cards.filter(card => {
      const isDue = card.nextReview <= now
      const isInUnit = unitNumber ? card.unit === unitNumber : true
      return isDue && isInUnit
    })

    console.log('🔍 Due cards:', {
      userId: deck.userId,
      unit: unitNumber || 'all',
      totalDue: dueCards.length,
      dueCards: dueCards.map(card => ({
        wordId: card.wordId,
        unit: card.unit,
        repetitions: card.repetitions,
        nextReview: formatDate(card.nextReview)
      }))
    })

    return dueCards
  }

  // Record an answer for a card
  const recordAnswer = async (wordId: string, quality: number, xpAward: number) => {
    if (!deck) return

    console.log('📊 Recording answer:', {
      wordId,
      quality,
      xpAward,
      currentXP: deck.xp
    })

    const oldCard = deck.cards.find(c => c.wordId === wordId)
    const oldUnit = oldCard?.unit

    // Check if this completes a unit
    const isUnitComplete = oldUnit && !deck.completedUnits.includes(oldUnit) && 
      deck.cards
        .filter(c => c.unit === oldUnit)
        .every(c => c.repetitions > 0)

    // Create a completely new deck object to ensure React detects the change
    const updatedDeck = {
      userId: deck.userId,
      cards: deck.cards.map(card => {
        if (card.wordId !== wordId) return card

        // Calculate new interval using SM2 algorithm
        let nextInterval: number
        let nextEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        nextEaseFactor = Math.max(MIN_EASE_FACTOR, nextEaseFactor)

        if (quality < 3) {
          card.repetitions = 0
          nextInterval = 1
        } else {
          if (card.repetitions === 0) nextInterval = 1
          else if (card.repetitions === 1) nextInterval = 6
          else nextInterval = Math.round(card.interval * card.easeFactor)
          card.repetitions += 1
        }

        const nextReview = Date.now() + nextInterval * 24 * 60 * 60 * 1000

        return {
          ...card,
          interval: nextInterval,
          easeFactor: nextEaseFactor,
          lastReview: Date.now(),
          nextReview
        }
      }),
      xp: deck.xp + xpAward,
      completedUnits: isUnitComplete ? [...deck.completedUnits, oldUnit] : deck.completedUnits,
      lastSyncedAt: Date.now()
    }

    console.log('📊 Updating deck with new XP:', {
      oldXP: deck.xp,
      xpAward,
      newXP: updatedDeck.xp
    })

    // 1. Update React state immediately (optimistic update)
    setDeck(updatedDeck)

    // 2. Save to localStorage for persistence IMMEDIATELY
    if (typeof window !== 'undefined') {
      try {
        const key = `deck-${deck.userId}`
        localStorage.setItem(key, JSON.stringify(updatedDeck))
        console.log('📊 Saved to localStorage with XP:', updatedDeck.xp)
        
        // Force a DOM update by dispatching a custom event
        window.dispatchEvent(new CustomEvent('xp-updated', { detail: { xp: updatedDeck.xp } }))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    }

    // 3. Save to API
    try {
      await saveDeck(updatedDeck)
      console.log('📊 Answer recorded successfully:', {
        wordId,
        newXP: updatedDeck.xp
      })
      return updatedDeck
    } catch (error) {
      // If API save fails, we keep the optimistic update
      console.error('Failed to save deck to API:', error)
      return updatedDeck
    }
  }

  // Get statistics about the deck
  const getStats = (): DeckStats => {
    if (!deck) return {
      totalCards: 0,
      cardsPerUnit: {},
      totalReviews: 0,
      masteredCards: 0,
      totalXP: 0
    }

    const stats: DeckStats = {
      totalCards: deck.cards.length,
      cardsPerUnit: {},
      totalReviews: deck.cards.reduce((sum, card) => sum + card.repetitions, 0),
      masteredCards: deck.cards.filter(card => card.interval >= 30).length,
      totalXP: deck.xp
    }

    deck.cards.forEach(card => {
      stats.cardsPerUnit[card.unit] = (stats.cardsPerUnit[card.unit] || 0) + 1
    })

    return stats
  }

  // Check if a unit has been started
  const hasStartedUnit = (unitNumber: number): boolean => {
    if (!deck) return false
    return deck.cards.some(card => card.unit === unitNumber)
  }

  // Get the highest completed unit
  const getHighestStartedUnit = (): number => {
    if (!deck) return 0
    const unitNumbers = deck.cards.map(card => card.unit)
    return Math.max(0, ...unitNumbers)
  }

  return {
    deck,
    isLoading,
    error,
    addUnit,
    getDueCards,
    recordAnswer,
    getStats,
    hasStartedUnit,
    getHighestStartedUnit
  }
} 
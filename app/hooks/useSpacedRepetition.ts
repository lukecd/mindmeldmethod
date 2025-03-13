import { useState, useEffect, useCallback } from 'react'
import { useDeck } from './useDeck'
import { logger } from '../lib/logger'

interface WordItem {
  id: string
  spanish: string
  english: string
  imagePath: string
  unit: number
  clue: string
}

interface UserProgress {
  wordId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: number
  lastReview: number
}

const MIN_EASE_FACTOR = 1.3
const DEFAULT_EASE_FACTOR = 2.5
const MIN_REPETITIONS_TO_COMPLETE = 1

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

export function useSpacedRepetition(userId: string | null) {
  const [forceUpdate, setForceUpdate] = useState(0)
  
  const {
    deck,
    addUnit,
    getDueCards,
    recordAnswer: originalRecordAnswer,
    getStats,
    hasStartedUnit,
    getHighestStartedUnit
  } = useDeck(userId)

  const getHighestCompletedUnit = useCallback(() => {
    if (!userId) return 0
    return getHighestStartedUnit()
  }, [userId, getHighestStartedUnit])

  const startUnit = useCallback((unitNumber: number) => {
    if (!userId) return
    if (hasStartedUnit(unitNumber)) {
      console.log('Unit already started:', unitNumber)
      return
    }

    console.log('Starting unit:', unitNumber)
    addUnit(unitNumber)
  }, [userId, hasStartedUnit, addUnit])

  const getDueWords = useCallback(async (unit: number) => {
    if (!userId) return []
    const dueCards = getDueCards(unit)
    
    try {
      const response = await fetch(`/data/${String(unit).padStart(2, '0')}_words.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch words for unit ${unit}`)
      }
      const data = await response.json()
      const words: WordItem[] = data.words

      return dueCards.map(card => {
        const word = words.find(w => w.id === card.wordId)
        if (!word) {
          logger.warning('Word not found for card', { cardId: card.wordId, unit })
          return null
        }
        return word
      }).filter((word): word is WordItem => word !== null)
    } catch (error) {
      logger.error('Failed to fetch words', error)
      return []
    }
  }, [userId, getDueCards])

  // Wrap recordAnswer to ensure it returns a Promise and triggers a forceUpdate
  const wrappedRecordAnswer = useCallback(async (wordId: string, quality: number, xpAward: number) => {
    try {
      const result = await originalRecordAnswer(wordId, quality, xpAward);
      // Force a re-render of all components using this hook
      setForceUpdate(prev => prev + 1);
      return result;
    } catch (error) {
      console.error('Error in wrappedRecordAnswer:', error);
      throw error;
    }
  }, [originalRecordAnswer]);

  if (!userId) {
    return {
      deck: null,
      startUnit: () => {},
      recordAnswer: async () => {},
      getDueWords: async () => [],
      getHighestCompletedUnit: () => 0,
      getStats: () => ({ totalCards: 0, completedCards: 0, unitProgress: new Map() })
    }
  }

  return {
    deck,
    startUnit,
    recordAnswer: wrappedRecordAnswer,
    getDueWords,
    getHighestCompletedUnit,
    getStats,
    forceUpdate
  }
} 
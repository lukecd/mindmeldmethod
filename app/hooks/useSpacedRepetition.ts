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
  nextReview?: number
  isDue?: boolean
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
    getHighestStartedUnit,
    finalizeSession: originalFinalizeSession
  } = useDeck(userId)

  const getHighestCompletedUnit = useCallback(() => {
    if (!userId) return 0
    return getHighestStartedUnit()
  }, [userId, getHighestStartedUnit])

  const startUnit = useCallback(async (unitNumber: number) => {
    if (!userId) return null;
    
    // Check if unit has already been started
    const unitAlreadyStarted = hasStartedUnit(unitNumber);
    console.log(`startUnit: Unit ${unitNumber} already started: ${unitAlreadyStarted}`);
    
    // Check if there are any cards for this unit
    const existingCards = deck?.cards.filter(card => card.unit === unitNumber) || [];
    console.log(`startUnit: Found ${existingCards.length} existing cards for unit ${unitNumber}`);
    
    // If the unit has cards but none are due, we might need to reset them
    // This helps after a reset when cards exist but aren't properly scheduled
    if (unitAlreadyStarted && existingCards.length > 0) {
      const dueCards = getDueCards(unitNumber);
      console.log(`startUnit: Found ${dueCards.length} due cards out of ${existingCards.length} total for unit ${unitNumber}`);
      
      // If no cards are due, we need to force them to be due
      if (dueCards.length === 0 && deck) {
        console.log(`startUnit: No due cards found for unit ${unitNumber}, forcing all cards to be due`);
        
        try {
          // Calculate a time in the past to make cards due
          const now = Date.now();
          const pastTime = now - (60 * 60 * 1000); // 1 hour in the past
          
          // Create an updated deck with all cards for this unit set to be due
          const updatedDeck = {
            ...deck,
            cards: deck.cards.map(card => {
              if (card.unit === unitNumber) {
                return {
                  ...card,
                  nextReview: pastTime, // Set to 1 hour in the past to ensure they're due
                };
              }
              return card;
            }),
            lastSyncedAt: now
          };
          
          // Save to localStorage immediately
          if (typeof window !== 'undefined') {
            try {
              const key = `deck-${deck.userId}`;
              localStorage.setItem(key, JSON.stringify(updatedDeck));
              console.log(`startUnit: Saved updated deck to localStorage with ${updatedDeck.cards.filter(c => c.unit === unitNumber).length} cards for unit ${unitNumber} set to be due`);
            } catch (error) {
              console.error('Failed to save to localStorage:', error);
            }
          }
          
          // Force update to ensure components re-render
          setForceUpdate(prev => prev + 1);
          
          return updatedDeck;
        } catch (error) {
          console.error(`startUnit: Error forcing cards to be due for unit ${unitNumber}:`, error);
        }
      }
      
      return deck; // Return the current deck if cards are already due
    }

    console.log(`startUnit: Adding unit ${unitNumber} to deck`);
    try {
      // Add unit and get updated deck
      const updatedDeck = await addUnit(unitNumber);
      
      if (!updatedDeck) {
        console.error(`startUnit: Failed to add unit ${unitNumber} - no deck returned`);
        return null;
      }
      
      console.log(`startUnit: Successfully added unit ${unitNumber} with ${updatedDeck.cards.filter(c => c.unit === unitNumber).length} cards`);
      
      // Verify that cards are now due
      const now = Date.now();
      const dueCards = updatedDeck.cards.filter(card => 
        card.unit === unitNumber && card.nextReview <= now
      );
      console.log(`startUnit: After adding unit, ${dueCards.length} cards are due for unit ${unitNumber}`);
      
      // If no cards are due, force them to be due
      if (dueCards.length === 0) {
        console.log(`startUnit: No cards are due after adding unit ${unitNumber}, forcing them to be due`);
        
        const pastTime = now - (60 * 60 * 1000); // 1 hour in the past
        const fixedDeck = {
          ...updatedDeck,
          cards: updatedDeck.cards.map(card => {
            if (card.unit === unitNumber) {
              return {
                ...card,
                nextReview: pastTime, // Set to 1 hour in the past to ensure they're due
              };
            }
            return card;
          }),
          lastSyncedAt: now
        };
        
        // Save to localStorage immediately
        if (typeof window !== 'undefined') {
          try {
            const key = `deck-${updatedDeck.userId}`;
            localStorage.setItem(key, JSON.stringify(fixedDeck));
            console.log(`startUnit: Saved fixed deck to localStorage with all cards for unit ${unitNumber} set to be due`);
          } catch (error) {
            console.error('Failed to save fixed deck to localStorage:', error);
          }
        }
        
        // Force update to ensure components re-render
        setForceUpdate(prev => prev + 1);
        
        return fixedDeck;
      }
      
      // Force update to ensure components re-render
      setForceUpdate(prev => prev + 1);
      
      return updatedDeck;
    } catch (error) {
      console.error(`startUnit: Error adding unit ${unitNumber}:`, error);
      return null;
    }
  }, [userId, hasStartedUnit, addUnit, deck, getDueCards]);

  const getDueWords = useCallback(async (unit: number) => {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`getDueWords[${requestId}]: Getting due words for unit ${unit}`);
    
    // Log the current time for comparison with nextReview times
    const now = Date.now();
    console.log(`getDueWords[${requestId}]: Current time: ${new Date(now).toLocaleString()}`);
    
    console.log(`getDueWords[${requestId}]: Current deck state:`, deck ? {
      userId: deck.userId,
      totalCards: deck.cards.length,
      unitCards: deck.cards.filter(card => card.unit === unit).length,
      dueCards: deck.cards.filter(card => card.unit === unit && card.nextReview <= now).length
    } : 'No deck');
    
    // If we have a deck, log more details about the cards for this unit
    if (deck) {
      const unitCards = deck.cards.filter(card => card.unit === unit);
      console.log(`getDueWords[${requestId}]: Unit ${unit} cards:`, unitCards.map(card => ({
        wordId: card.wordId,
        nextReview: new Date(card.nextReview).toLocaleString(),
        isDue: card.nextReview <= now,
        timeDifference: card.nextReview - now
      })));
    }
    
    // Helper function to fetch words from JSON
    const fetchWordsFromJson = async () => {
      const url = `/data/${String(unit).padStart(2, '0')}_words.json`;
      console.log(`getDueWords[${requestId}]: Fetching words from ${url}`);
      
      // Add cache busting to prevent caching issues
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(url + cacheBuster, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch words for unit ${unit} (status: ${response.status})`);
      }
      
      const data = await response.json();
      if (!data || !data.words || !Array.isArray(data.words)) {
        throw new Error(`Invalid data format for unit ${unit}`);
      }
      
      return data.words as WordItem[];
    };
    
    // If there's no deck or no cards for this unit, we need to fetch the words directly
    if (!deck || deck.cards.filter(card => card.unit === unit).length === 0) {
      console.log(`getDueWords[${requestId}]: No deck or no cards for unit ${unit}, fetching words directly`);
      
      try {
        const words = await fetchWordsFromJson();
        console.log(`getDueWords[${requestId}]: Loaded ${words.length} words directly from JSON`);
        return words;
      } catch (error) {
        console.error(`getDueWords[${requestId}]: Error fetching words directly:`, error);
        return [];
      }
    }
    
    try {
      // Get due cards for this unit
      const dueCards = getDueCards(unit);
      
      if (!dueCards || dueCards.length === 0) {
        console.log(`getDueWords[${requestId}]: No due cards found for unit ${unit}`);
        
        // Remove the fallback that returns all cards for a unit
        // Instead, just return an empty array when no cards are due
        console.log(`getDueWords[${requestId}]: Returning empty array since no cards are due`);
        return [];
      }
      
      console.log(`getDueWords[${requestId}]: Found ${dueCards.length} due cards for unit ${unit}`);
      console.log(`getDueWords[${requestId}]: Due card IDs:`, dueCards.map(card => card.wordId));
      
      // Fetch the word data for these cards
      try {
        const words = await fetchWordsFromJson();
        console.log(`getDueWords[${requestId}]: Loaded ${words.length} words from JSON`);
        
        // Map due cards to their corresponding words
        const dueWords = dueCards.map(card => {
          const word = words.find(w => w.id === card.wordId);
          if (!word) {
            console.warn(`getDueWords[${requestId}]: Word not found for card ${card.wordId}`);
            return null;
          }
          return word;
        }).filter((word): word is WordItem => word !== null);
        
        console.log(`getDueWords[${requestId}]: Mapped ${dueWords.length} due words for unit ${unit}`);
        
        // If we have due words, return them
        if (dueWords.length > 0) {
          return dueWords;
        } else {
          console.warn(`getDueWords[${requestId}]: No words could be mapped for unit ${unit}`);
          return words; // Return all words as a fallback
        }
      } catch (error) {
        console.error(`getDueWords[${requestId}]: Failed to fetch words for unit ${unit}`, error);
        // Rethrow the error to be handled by the caller
        throw error;
      }
    } catch (error) {
      console.error(`getDueWords[${requestId}]: Error in getDueWords for unit ${unit}`, error);
      throw error;
    }
  }, [userId, getDueCards, deck]);

  // Wrap recordAnswer to ensure it returns a Promise and triggers a forceUpdate
  const wrappedRecordAnswer = useCallback(async (wordId: string, quality: number, xpAward: number, keepInSession = true) => {
    try {
      const result = await originalRecordAnswer(wordId, quality, xpAward, keepInSession);
      // Force a re-render of all components using this hook
      setForceUpdate(prev => prev + 1);
      return result;
    } catch (error) {
      console.error('Error in wrappedRecordAnswer:', error);
      throw error;
    }
  }, [originalRecordAnswer]);

  // Wrap finalizeSession to ensure it triggers a forceUpdate
  const wrappedFinalizeSession = useCallback(async (unitNumber?: number) => {
    if (!originalFinalizeSession) return null;
    
    try {
      const result = await originalFinalizeSession(unitNumber);
      // Force a re-render of all components using this hook
      setForceUpdate(prev => prev + 1);
      return result;
    } catch (error) {
      console.error('Error in wrappedFinalizeSession:', error);
      throw error;
    }
  }, [originalFinalizeSession]);

  if (!userId) {
    return {
      deck: null,
      startUnit: () => {},
      recordAnswer: async () => {},
      getDueWords: async () => [],
      getHighestCompletedUnit: () => 0,
      getStats: () => ({ totalCards: 0, completedCards: 0, unitProgress: new Map() }),
      finalizeSession: async () => null,
      addUnit: async () => null
    }
  }

  return {
    deck,
    startUnit,
    recordAnswer: wrappedRecordAnswer,
    getDueWords,
    getHighestCompletedUnit,
    getStats,
    forceUpdate,
    finalizeSession: wrappedFinalizeSession,
    addUnit
  }
} 
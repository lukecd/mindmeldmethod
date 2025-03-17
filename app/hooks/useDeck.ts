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
        console.log('🔄 DEBUG - Loading deck for user:', userId);
        
        // First check localStorage for existing deck
        let localDeck: UserDeck | null = null;
        if (typeof window !== 'undefined') {
          try {
            const key = `deck-${userId}`
            const saved = localStorage.getItem(key)
            if (saved) {
              localDeck = JSON.parse(saved) as UserDeck
              console.log('🔄 DEBUG - Found deck in localStorage:', { 
                userId, 
                xp: localDeck.xp,
                totalCards: localDeck.cards.length,
                completedCards: localDeck.cards.filter(c => c.repetitions > 0).length,
                completedUnits: localDeck.completedUnits,
                timestamp: new Date().toISOString()
              })
            } else {
              console.log('🔄 DEBUG - No deck found in localStorage for user:', userId);
            }
          } catch (error) {
            console.error('Error reading localStorage:', error)
          }
        }

        // If we have a valid local deck, use it
        if (localDeck && localDeck.userId === userId) {
          console.log('🔄 DEBUG - Using deck from localStorage:', {
            userId,
            xp: localDeck.xp,
            totalCards: localDeck.cards.length,
            completedUnits: localDeck.completedUnits
          });
          setDeck(localDeck)
          setIsLoading(false)
          
          // IMPORTANT: Save the localStorage deck to API to ensure it's synced
          try {
            await saveDeck(localDeck);
            console.log('🔄 DEBUG - Synced localStorage deck to API on initial load');
          } catch (syncError) {
            console.error('Error syncing localStorage deck to API on initial load:', syncError);
          }
          
          return
        }
        
        // Otherwise, try to fetch from API
        try {
          console.log('🔄 DEBUG - Fetching deck from API for user:', userId);
          const response = await fetch(`/api/deck/${userId}`)
          
          if (!response.ok) {
            console.log('🔄 DEBUG - API response not OK:', response.status, response.statusText);
            throw new Error('Failed to load deck')
          }
          
          const data = await response.json()
          console.log('🔄 DEBUG - Loaded deck from API:', { 
            userId, 
            xp: data.xp,
            totalCards: data.cards.length,
            completedUnits: data.completedUnits
          })
          
          // IMPORTANT: Compare with localStorage deck before setting
          if (localDeck) {
            console.log('🔄 DEBUG - Comparing API deck with localStorage deck:', {
              apiXP: data.xp,
              localXP: localDeck.xp,
              apiCards: data.cards.length,
              localCards: localDeck.cards.length,
              apiCompletedUnits: data.completedUnits,
              localCompletedUnits: localDeck.completedUnits
            });
            
            // If localStorage deck has more XP or cards, use that instead
            if (localDeck.xp > data.xp || localDeck.cards.length > data.cards.length) {
              console.log('🔄 DEBUG - localStorage deck has more progress, using that instead');
              setDeck(localDeck);
              
              // Save the localStorage deck to API to sync it
              try {
                await saveDeck(localDeck);
                console.log('🔄 DEBUG - Synced localStorage deck to API');
              } catch (syncError) {
                console.error('Error syncing localStorage deck to API:', syncError);
              }
              
              setIsLoading(false);
              return;
            }
          }
          
          setDeck(data)
        } catch (apiError) {
          console.error('Error loading deck from API:', apiError)
          
          // Create a new deck if API fails or returns no deck
          console.log('🔄 DEBUG - API failed, creating new deck for user:', userId)
          
          // IMPORTANT: Check if we have a localStorage deck before creating a new one
          if (localDeck) {
            console.log('🔄 DEBUG - Using existing localStorage deck instead of creating new one');
            setDeck(localDeck);
            setIsLoading(false);
            return;
          }
          
          const newDeck: UserDeck = {
            userId: userId as string,
            cards: [],
            xp: 0,
            completedUnits: [],
            lastSyncedAt: Date.now()
          }
          
          console.log('🔄 DEBUG - Created new empty deck:', {
            userId,
            timestamp: new Date().toISOString()
          });
          
          setDeck(newDeck)
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            try {
              const key = `deck-${userId}`
              localStorage.setItem(key, JSON.stringify(newDeck))
              console.log('🔄 DEBUG - Saved new empty deck to localStorage:', { 
                userId, 
                timestamp: new Date().toISOString() 
              })
            } catch (storageError) {
              console.error('Failed to save new deck to localStorage:', storageError)
            }
          }
        }
      } catch (error) {
        console.error('Error in loadDeck:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
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
      // IMPORTANT: Before saving, check if localStorage has a more advanced deck
      if (typeof window !== 'undefined') {
        try {
          const key = `deck-${userId}`
          const saved = localStorage.getItem(key)
          if (saved) {
            const localDeck = JSON.parse(saved) as UserDeck
            
            // Compare the decks to see which has more progress
            const localProgress = {
              xp: localDeck.xp,
              totalCards: localDeck.cards.length,
              completedCards: localDeck.cards.filter(c => c.repetitions > 0).length,
              completedUnits: localDeck.completedUnits.length
            };
            
            const updatedProgress = {
              xp: updatedDeck.xp,
              totalCards: updatedDeck.cards.length,
              completedCards: updatedDeck.cards.filter(c => c.repetitions > 0).length,
              completedUnits: updatedDeck.completedUnits.length
            };
            
            console.log('💾 DEBUG - Comparing decks before saving:', {
              localProgress,
              updatedProgress,
              timestamp: new Date().toISOString()
            });
            
            // If the local deck has more progress, don't overwrite it
            if (localProgress.xp > updatedProgress.xp || 
                localProgress.completedCards > updatedProgress.completedCards ||
                localProgress.completedUnits > updatedProgress.completedUnits) {
              console.warn('💾 WARNING - Preventing deck downgrade! Local deck has more progress than the one being saved.');
              
              // Use the local deck instead
              setDeck(localDeck);
              return;
            }
          }
        } catch (error) {
          console.error('Error checking localStorage before saving:', error);
        }
      }

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
    if (!deck) {
      console.log('addUnit: No deck available');
      
      // Create a new deck if one doesn't exist yet
      if (userId) {
        console.log(`addUnit: Creating new deck for user ${userId} to add unit ${unitNumber}`);
        const newDeck: UserDeck = {
          userId: userId as string,
          cards: [],
          xp: 0,
          completedUnits: [],
          lastSyncedAt: Date.now()
        };
        
        // Update state immediately
        setDeck(newDeck);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            const key = `deck-${userId}`;
            localStorage.setItem(key, JSON.stringify(newDeck));
            console.log(`addUnit: Saved new deck to localStorage for user ${userId}`);
          } catch (error) {
            console.error('Failed to save new deck to localStorage:', error);
          }
        }
        
        // Now continue with adding the unit to this new deck
        return addUnitToExistingDeck(newDeck, unitNumber);
      }
      
      return null;
    }

    return addUnitToExistingDeck(deck, unitNumber);
  }
  
  // Helper function to add a unit to an existing deck
  const addUnitToExistingDeck = async (existingDeck: UserDeck, unitNumber: number) => {
    try {
      console.log(`addUnit: Loading words for unit ${unitNumber}`);
      // Load unit words from JSON
      const response = await fetch(`/data/${String(unitNumber).padStart(2, '0')}_words.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch words for unit ${unitNumber} (status: ${response.status})`);
      }
      
      const data = await response.json();
      
      if (!data || !data.words || !Array.isArray(data.words)) {
        throw new Error(`Invalid data format for unit ${unitNumber}`);
      }
      
      const unitWords: { id: string; unit: number; spanish: string }[] = data.words;
      console.log(`addUnit: Loaded ${unitWords.length} words for unit ${unitNumber}`);

      // Current time to make cards immediately available
      const now = Date.now();
      // Set to 1 hour in the past to ensure they're due
      const pastTime = now - (60 * 60 * 1000);

      const newCards: UserCard[] = unitWords.map(word => ({
        wordId: word.id,
        addedAt: now,
        unit: unitNumber,
        easeFactor: DEFAULT_EASE_FACTOR,
        interval: 0,
        repetitions: 0,
        nextReview: pastTime, // Set to 1 hour in the past so cards are immediately due
        lastReview: 0
      }));

      console.log('➕ Adding cards to deck:', {
        userId: existingDeck.userId,
        unit: unitNumber,
        newCards: newCards.length,
        words: unitWords.map(w => ({ id: w.id, spanish: w.spanish }))
      });

      // Check if we already have cards for this unit
      const existingCardIds = existingDeck.cards
        .filter(card => card.unit === unitNumber)
        .map(card => card.wordId);
      
      // Filter out cards that already exist
      const cardsToAdd = newCards.filter(card => !existingCardIds.includes(card.wordId));
      
      if (cardsToAdd.length === 0) {
        console.log(`addUnit: All ${newCards.length} cards for unit ${unitNumber} already exist in deck`);
        
        // If all cards already exist, make sure they're due
        const updatedDeck = {
          ...existingDeck,
          cards: existingDeck.cards.map(card => {
            if (card.unit === unitNumber) {
              return {
                ...card,
                nextReview: pastTime, // Set to 1 hour in the past so cards are immediately due
              };
            }
            return card;
          }),
          lastSyncedAt: now
        };
        
        // Update state immediately
        setDeck(updatedDeck);
        
        // Save to localStorage immediately
        if (typeof window !== 'undefined') {
          try {
            const key = `deck-${existingDeck.userId}`;
            localStorage.setItem(key, JSON.stringify(updatedDeck));
            console.log(`addUnit: Saved updated deck to localStorage with all cards for unit ${unitNumber} set to be due`);
          } catch (error) {
            console.error('Failed to save to localStorage:', error);
          }
        }
        
        // Then save to API
        await saveDeck(updatedDeck);
        
        console.log(`addUnit: Updated ${existingCardIds.length} existing cards for unit ${unitNumber} to be due`);
        
        // Verify that cards are now due
        const dueCards = updatedDeck.cards.filter(card => 
          card.unit === unitNumber && card.nextReview <= now
        );
        console.log(`addUnit: After update, ${dueCards.length} cards are due for unit ${unitNumber}`);
        
        return updatedDeck;
      }

      const updatedDeck = {
        ...existingDeck,
        cards: [...existingDeck.cards, ...cardsToAdd],
        lastSyncedAt: now
      };

      console.log(`addUnit: Added ${cardsToAdd.length} new cards to deck for unit ${unitNumber}`);

      // Update state immediately
      setDeck(updatedDeck);

      // Save to localStorage immediately
      if (typeof window !== 'undefined') {
        try {
          const key = `deck-${existingDeck.userId}`;
          localStorage.setItem(key, JSON.stringify(updatedDeck));
          console.log(`addUnit: Saved updated deck to localStorage with ${updatedDeck.cards.length} total cards`);
        } catch (error) {
          console.error('Failed to save to localStorage:', error);
        }
      }

      // Then save to API
      await saveDeck(updatedDeck);
      
      // Verify that cards are now due
      const dueCards = updatedDeck.cards.filter(card => 
        card.unit === unitNumber && card.nextReview <= now
      );
      console.log(`addUnit: After adding, ${dueCards.length} cards are due for unit ${unitNumber}`);
      
      // Return the updated deck
      return updatedDeck;
    } catch (error) {
      console.error(`addUnit: Error adding unit ${unitNumber}:`, error);
      return null;
    }
  }

  // Get cards that are due for review
  const getDueCards = (unitNumber?: number) => {
    if (!deck) {
      console.log('getDueCards: No deck available');
      return [];
    }
    
    const now = Date.now();
    console.log(`getDueCards: Current time is ${new Date(now).toLocaleString()}`);
    
    // First, check if there are any cards for this unit
    const unitCards = unitNumber 
      ? deck.cards.filter(card => card.unit === unitNumber)
      : deck.cards;
      
    if (unitCards.length === 0) {
      console.log(`getDueCards: No cards found for unit ${unitNumber || 'all'}`);
      return [];
    }
    
    console.log(`getDueCards: Found ${unitCards.length} total cards for unit ${unitNumber || 'all'}`);
    
    // Log detailed information about each card's due status
    unitCards.forEach(card => {
      const isDue = card.nextReview <= now;
      const timeDiff = card.nextReview - now;
      console.log(`Card ${card.wordId} (Unit ${card.unit}): nextReview=${new Date(card.nextReview).toLocaleString()}, isDue=${isDue}, timeDiff=${timeDiff}ms`);
    });
    
    // Then filter for due cards
    const dueCards = unitCards.filter(card => {
      const isDue = card.nextReview <= now;
      return isDue;
    });

    console.log('🔍 Due cards:', {
      userId: deck.userId,
      unit: unitNumber || 'all',
      totalCards: unitCards.length,
      totalDue: dueCards.length,
      dueCards: dueCards.map(card => ({
        wordId: card.wordId,
        unit: card.unit,
        repetitions: card.repetitions,
        nextReview: formatDate(card.nextReview),
        isDue: card.nextReview <= now,
        timeUntilDue: card.nextReview > now ? formatInterval(Math.floor((card.nextReview - now) / (24 * 60 * 60 * 1000))) : 'due now'
      }))
    });

    // If we're looking for a specific unit and no cards are due,
    // check if this is the first time the user is studying this unit
    if (unitNumber !== undefined && dueCards.length === 0 && unitCards.length > 0) {
      // Check if any cards in this unit have been reviewed before
      const anyReviewed = unitCards.some(card => card.repetitions > 0);
      
      // If no cards have been reviewed yet, force them all to be due
      if (!anyReviewed) {
        console.log(`getDueCards: No cards have been reviewed for unit ${unitNumber} yet, forcing all to be due`);
        
        // Return all cards for this unit to ensure the user can start studying
        return unitCards;
      }
    }

    return dueCards;
  }

  // Record an answer for a card
  const recordAnswer = async (wordId: string, quality: number, xpAward: number, keepInSession = true) => {
    if (!deck) return

    console.log('📊 Recording answer:', {
      wordId,
      quality,
      xpAward,
      keepInSession,
      currentXP: deck.xp
    })

    const oldCard = deck.cards.find(c => c.wordId === wordId)
    const oldUnit = oldCard?.unit

    // Check if this completes a unit - FIXED VERSION with more detailed logging
    let isUnitComplete = false;
    let oldCompletedUnits = [...deck.completedUnits];
    
    if (oldUnit && !deck.completedUnits.includes(oldUnit)) {
      const unitCards = deck.cards.filter(c => c.unit === oldUnit);
      
      // Check if this card is the last one to be completed in the unit
      const willBeCompleted = quality >= 3 && oldCard?.repetitions === 0;
      
      // Check if all other cards in the unit have repetitions > 0
      const otherCardsCompleted = unitCards.filter(c => c.wordId !== wordId).every(c => c.repetitions > 0);
      
      // If this card will be completed and all others are already completed, mark unit as complete
      isUnitComplete = willBeCompleted && otherCardsCompleted;
      
      // Also check if all cards (including this one) already have repetitions > 0
      const allCardsAlreadyCompleted = unitCards.every(c => {
        if (c.wordId === wordId) {
          return c.repetitions > 0 || quality >= 3;
        }
        return c.repetitions > 0;
      });
      
      if (allCardsAlreadyCompleted) {
        isUnitComplete = true;
      }
      
      console.log('🔍 DETAILED Unit completion check:', {
        unit: oldUnit,
        totalCardsInUnit: unitCards.length,
        cardsWithRepetitions: unitCards.filter(c => c.repetitions > 0).length,
        thisCardWillBeCompleted: willBeCompleted,
        otherCardsCompleted,
        allCardsAlreadyCompleted,
        isUnitComplete,
        currentCompletedUnits: deck.completedUnits
      });
    }

    // Create a completely new deck object to ensure React detects the change
    const updatedDeck = {
      userId: deck.userId,
      cards: deck.cards.map(card => {
        if (card.wordId !== wordId) return card

        // Calculate new interval using SM2 algorithm
        let nextInterval: number
        let nextEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        nextEaseFactor = Math.max(MIN_EASE_FACTOR, nextEaseFactor)

        let newRepetitions = card.repetitions;
        
        if (quality < 3) {
          // "No Idea" - Reset repetitions
          newRepetitions = 0;
          nextInterval = 1;
        } else {
          // "Got One" or "Got Both"
          if (card.repetitions === 0) {
            nextInterval = 1;
          } else if (card.repetitions === 1) {
            nextInterval = 6;
          } else {
            nextInterval = Math.round(card.interval * card.easeFactor);
          }
          
          // Increment repetitions by 1 for "Got One" (quality 3)
          // Increment repetitions by 2 for "Got Both" (quality 5)
          newRepetitions += (quality === 5) ? 2 : 1;
        }

        // Calculate the actual next review time
        const actualNextReview = Date.now() + nextInterval * 24 * 60 * 60 * 1000;
        
        // If keepInSession is true, we'll store the actual next review time in a separate property
        // but set the nextReview to a time in the future but still within the current session
        const nextReview = keepInSession 
          ? Date.now() + 30 * 60 * 1000 // 30 minutes in the future (still within session)
          : actualNextReview;

        return {
          ...card,
          interval: nextInterval,
          easeFactor: nextEaseFactor,
          repetitions: newRepetitions,
          lastReview: Date.now(),
          nextReview,
          actualNextReview: keepInSession ? actualNextReview : undefined
        }
      }),
      xp: deck.xp + xpAward,
      completedUnits: isUnitComplete ? [...deck.completedUnits, oldUnit as number] : deck.completedUnits,
      lastSyncedAt: Date.now()
    }

    // Log the updated completed units
    console.log('🔍 Updated completed units:', {
      oldCompletedUnits,
      newCompletedUnits: updatedDeck.completedUnits,
      unitMarkedComplete: isUnitComplete ? oldUnit : null
    });

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

  // Finalize a study session by updating cards with their actual next review times
  const finalizeSession = async (unitNumber?: number) => {
    if (!deck) return null;
    
    console.log('🏁 Finalizing session:', unitNumber ? `for unit ${unitNumber}` : 'for all units');
    
    // Find cards that have an actualNextReview property (meaning they were kept in session)
    const cardsToUpdate = deck.cards.filter(card => {
      const isInUnit = unitNumber ? card.unit === unitNumber : true;
      return isInUnit && card.actualNextReview !== undefined;
    });
    
    if (cardsToUpdate.length === 0) {
      console.log('🏁 No cards to finalize');
      return deck;
    }
    
    console.log(`🏁 Finalizing ${cardsToUpdate.length} cards`);
    
    // Create a new deck with updated nextReview times
    const updatedDeck = {
      ...deck,
      cards: deck.cards.map(card => {
        if ((unitNumber ? card.unit === unitNumber : true) && card.actualNextReview !== undefined) {
          // Update the nextReview time to the actual next review time
          return {
            ...card,
            nextReview: card.actualNextReview,
            actualNextReview: undefined // Remove the temporary property
          };
        }
        return card;
      }),
      lastSyncedAt: Date.now()
    };
    
    // Update state immediately
    setDeck(updatedDeck);
    
    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      try {
        const key = `deck-${deck.userId}`;
        localStorage.setItem(key, JSON.stringify(updatedDeck));
        console.log('🏁 Saved finalized session to localStorage');
      } catch (error) {
        console.error('Failed to save finalized session to localStorage:', error);
      }
    }
    
    // Then save to API
    try {
      await saveDeck(updatedDeck);
      console.log('🏁 Saved finalized session to API');
      return updatedDeck;
    } catch (error) {
      console.error('Failed to save finalized session to API:', error);
      return updatedDeck;
    }
  };

  // Manually mark a unit as completed
  const markUnitAsCompleted = async (unitNumber: number) => {
    if (!deck) {
      console.log('markUnitAsCompleted: No deck available');
      return null;
    }
    
    // Check if the unit is already marked as completed
    if (deck.completedUnits.includes(unitNumber)) {
      console.log(`markUnitAsCompleted: Unit ${unitNumber} is already marked as completed`);
      return deck;
    }
    
    console.log(`markUnitAsCompleted: Marking unit ${unitNumber} as completed`);
    
    // Create a new deck with the unit added to completedUnits
    const updatedDeck = {
      ...deck,
      completedUnits: [...deck.completedUnits, unitNumber],
      lastSyncedAt: Date.now()
    };
    
    // Update state immediately
    setDeck(updatedDeck);
    
    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      try {
        const key = `deck-${deck.userId}`;
        localStorage.setItem(key, JSON.stringify(updatedDeck));
        console.log(`markUnitAsCompleted: Saved updated deck to localStorage with unit ${unitNumber} marked as completed`);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }
    
    // Then save to API
    try {
      await saveDeck(updatedDeck);
      console.log(`markUnitAsCompleted: Saved updated deck to API with unit ${unitNumber} marked as completed`);
      return updatedDeck;
    } catch (error) {
      console.error('Failed to save to API:', error);
      return updatedDeck;
    }
  };

  return {
    deck,
    isLoading,
    error,
    addUnit,
    getDueCards,
    recordAnswer,
    getStats,
    hasStartedUnit,
    getHighestStartedUnit,
    finalizeSession,
    markUnitAsCompleted
  }
} 
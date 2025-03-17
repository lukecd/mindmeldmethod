'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { useAddress } from '@chopinframework/react'
import { useSpacedRepetition } from '../../../hooks/useSpacedRepetition'
import Flashcard from '../../../components/Flashcard'
import Confetti from 'react-confetti'

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface Flashcard {
  id: string
  english: string
  spanish: string
  imagePath: string
  clue: string
  unit?: number
  nextReview?: number
  actualNextReview?: number
}

interface WordsData {
  words: Flashcard[]
}

interface UnitContentProps {
  unitId: string
  unitTitle: string
}

export default function UnitContent({ unitId, unitTitle }: UnitContentProps) {
  const { address } = useAddress()
  const { startUnit, recordAnswer, getDueWords, deck, finalizeSession, addUnit } = useSpacedRepetition(address)
  
  // Use refs to track initialization and finalization
  const hasInitialized = useRef(false)
  const hasFinalized = useRef(false)

  // Initialize flashcards in state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [ratings, setRatings] = useState<Record<number, string>>({})

  // Add state to track the next review time
  const [nextReviewTime, setNextReviewTime] = useState<string | null>(null);

  // Add state for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Start unit when address is available and load cards
  useEffect(() => {
    // Skip if already initialized
    if (hasInitialized.current) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    // Mark as initialized immediately to prevent multiple calls
    hasInitialized.current = true;
    
    // Add a timeout to prevent getting stuck in loading state
    const loadingTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('🚨 Loading timeout reached - forcing loading to complete');
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    const initializeUnit = async () => {
      try {
        console.log('🔄 Initializing unit:', unitId, 'with address:', address);
        
        if (!address) {
          console.log('🚨 No wallet address available - waiting for connection');
          // We'll continue loading but log this issue
        }
        
        console.log('🔄 Current deck state:', deck ? `Deck found with ${deck.cards.length} cards` : 'No deck found');
        
        // If there's no deck, log it but don't try to create one directly
        if (!deck && address) {
          console.log('🔄 No deck found, startUnit will create one');
        }
        
        // Start the unit (this will add cards if it hasn't been started yet)
        console.log('🔄 Starting unit:', unitId);
        const updatedDeck = await startUnit(parseInt(unitId));
        console.log('🔄 Unit initialization result:', updatedDeck ? `Updated deck received with ${updatedDeck.cards.length} cards` : 'No deck update needed');
        
        // Continue regardless of isMounted status - we'll check before updating state
        
        // Log detailed information about the deck state
        if (updatedDeck) {
          console.log('🔄 Updated deck details:', {
            userId: updatedDeck.userId,
            totalCards: updatedDeck.cards.length,
            unitCards: updatedDeck.cards.filter(card => card.unit === parseInt(unitId)).length,
            dueCards: updatedDeck.cards.filter(card => card.unit === parseInt(unitId) && card.nextReview <= Date.now()).length
          });
        } else {
          console.log('🚨 No updated deck received from startUnit');
        }
        
        // Get due cards for this unit - ALWAYS call this after startUnit
        try {
          console.log('🔄 Getting due words for unit:', unitId);
          console.log('🔄 Current deck state before getDueWords:', deck ? {
            userId: deck.userId,
            totalCards: deck.cards.length,
            unitCards: deck.cards.filter(card => card.unit === parseInt(unitId)).length,
            dueCards: deck.cards.filter(card => card.unit === parseInt(unitId) && card.nextReview <= Date.now()).length
          } : 'No deck');
          
          // Force a direct call to getDueWords here, don't skip this step
          try {
            console.log('🔄 Calling getDueWords with unitId:', parseInt(unitId));
            const dueWords = await getDueWords(parseInt(unitId));
            console.log('🔄 getDueWords returned successfully');
            console.log('🔄 Due words result:', dueWords ? `Found ${dueWords.length} due words` : 'No due words found');
            
              if (dueWords && dueWords.length > 0) {
                console.log(`📚 Loaded ${dueWords.length} due cards for unit ${unitId}`);
                const shuffled = shuffleArray(dueWords);
                console.log(`📚 Shuffled ${shuffled.length} cards for review`);
                console.log('📚 First few cards:', shuffled.slice(0, 3).map(card => ({ id: card.id, english: card.english, spanish: card.spanish })));
                setFlashcards(shuffled);
                setIsLoading(false);
                console.log('📚 Flashcards state set with', shuffled.length, 'cards');
            }
          } catch (dueWordsError) {
            console.error('🚨 Error in getDueWords:', dueWordsError);
            setFlashcards([]);
          }
        } catch (error) {
          console.error('Error getting due words:', error);
          setFlashcards([]);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error initializing unit:', error);
      } finally {
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setIsLoading(false);
          
          // Log the final state of flashcards after initialization
          console.log('🔄 Initialization complete. Flashcards state:', {
            count: flashcards.length,
            isLoading,
            hasCards: flashcards.length > 0,
            firstCard: flashcards.length > 0 ? {
              id: flashcards[0].id,
              english: flashcards[0].english,
              spanish: flashcards[0].spanish
            } : 'No cards'
          });
        }
      }
    };
    
    initializeUnit();
    
    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [unitId, address, startUnit, getDueWords, deck, addUnit]);

  // Add an effect to log when flashcards state changes
  useEffect(() => {
    console.log('📊 Flashcards state changed:', {
      count: flashcards.length,
      hasCards: flashcards.length > 0,
      currentCard,
      isLoading
    });
  }, [flashcards, currentCard, isLoading]);

  // Reset when unitId changes
  useEffect(() => {
    // Reset initialization and finalization state when unitId changes
    hasInitialized.current = false;
    hasFinalized.current = false;
    
    // Reset component state
    setFlashcards([]);
    setCurrentCard(0);
    setIsImageLoading(true);
    setIsLoading(true);
    setRatings({});
    
    // This will trigger the initialization effect
  }, [unitId]);

  // Finalize session when component unmounts
  useEffect(() => {
    return () => {
      // Skip if already finalized or no address/finalizeSession
      if (hasFinalized.current || !address || !finalizeSession) return;
      
      // Mark as finalized to prevent multiple calls
      hasFinalized.current = true;
      
      console.log('🏁 Finalizing session on unmount for unit:', unitId);
      finalizeSession(parseInt(unitId))
        .then(() => console.log('🏁 Session finalized successfully'))
        .catch(error => console.error('Error finalizing session:', error));
    };
  }, [address, unitId, finalizeSession]);

  // Add effect to update window size for confetti
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      // Set initial size
      handleResize();
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Add an effect to show confetti when there are no flashcards left
  useEffect(() => {
    // Check if we've just completed all cards
    if (flashcards.length === 0 && !isLoading && deck) {
      console.log('🎉 No flashcards left and not loading - session complete!');
      
      // Find cards for this unit
      const unitCards = deck.cards.filter(card => card.unit === parseInt(unitId));
      
      if (unitCards.length > 0) {
        // Find the card with the earliest next review time
        const nextReviewCard = unitCards.reduce((earliest, card) => {
          // Use actualNextReview if available, otherwise use nextReview
          const cardNextReview = card.actualNextReview || card.nextReview;
          const earliestNextReview = earliest.actualNextReview || earliest.nextReview;
          
          return cardNextReview < earliestNextReview ? card : earliest;
        });
        
        // Format the next review time
        const nextReviewTimestamp = nextReviewCard.actualNextReview || nextReviewCard.nextReview;
        const formattedTime = formatNextReviewTime(nextReviewTimestamp);
        
        console.log(`🔄 Next review available ${formattedTime} (${new Date(nextReviewTimestamp).toLocaleString()})`);
        
        // Set the next review time
        setNextReviewTime(formattedTime);
        
        // Show confetti
        setShowConfetti(true);
        
        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    }
  }, [flashcards.length, isLoading, deck, unitId]);

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleRate = (rating: 'no-clue' | 'got-one' | 'got-both') => {
    if (!flashcards.length || !flashcards[currentCard]) return

    // Map rating to SM2 quality score (0-5) and XP
    const ratingMap = {
      'no-clue': { quality: 1, xp: 3 },
      'got-one': { quality: 3, xp: 5 },
      'got-both': { quality: 5, xp: 9 }
    }

    console.log('🎮 UnitContent.handleRate - Before recordAnswer:', {
      wordId: flashcards[currentCard].id,
      quality: ratingMap[rating].quality,
      xpAward: ratingMap[rating].xp,
      currentDeckXP: deck?.xp
    })

    // Record the answer in spaced repetition system
    if (recordAnswer) {
      // Keep cards in session (true by default) so they remain available for review
      recordAnswer(flashcards[currentCard].id, ratingMap[rating].quality, ratingMap[rating].xp, true)
        .then((updatedDeck) => {
          console.log('🎮 UnitContent.handleRate - After recordAnswer:', {
            wordId: flashcards[currentCard].id,
            rating,
            newDeckXP: updatedDeck?.xp || deck?.xp
          });
          
          if (rating === 'no-clue') {
            // For "No Idea" ratings, move the current card to a later position in the deck
            // so the user will see it again later in the session
            console.log('🔄 Moving card to a later position for review:', flashcards[currentCard].id);
            
            // Get the current card
            const currentCardObj = flashcards[currentCard];
            
            // Create a new array without the current card
            const newFlashcards = [...flashcards];
            newFlashcards.splice(currentCard, 1);
            
            // Calculate a position to reinsert the card (2-4 cards later)
            // This ensures the user doesn't see the same card right away
            const minPosition = Math.min(currentCard + 2, newFlashcards.length);
            const maxPosition = Math.min(currentCard + 4, newFlashcards.length);
            const insertPosition = Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
            
            // Insert the card at the new position
            newFlashcards.splice(insertPosition, 0, currentCardObj);
            
            console.log(`🔄 Moved card from position ${currentCard} to position ${insertPosition}`);
            
            // Update the flashcards array
            setFlashcards(newFlashcards);
            
            // Move to the next card (which is now at the current position since we removed the current card)
            // No need to increment currentCard since the next card has shifted into the current position
            
            // Reset card state
            setIsImageLoading(true);
          } else {
            // For "Got One" or "Got Both" ratings, proceed as normal
            // After recording an answer, check if there are more cards
            if (currentCard < flashcards.length - 1) {
              // Move to next card
              setCurrentCard(prev => prev + 1);
              // Reset card state
              setIsImageLoading(true);
            } else {
              // No more cards in this session, reload due cards
              console.log('🔄 Reached end of current flashcards, checking for more due cards');
              getDueWords(parseInt(unitId)).then(dueWords => {
                console.log('🔍 DEBUG - getDueWords returned:', dueWords.length, 'cards');
                
                // Since getDueWords now only returns truly due cards, we don't need to filter
                console.log(`🔄 Found ${dueWords.length} due cards`);
                
                if (dueWords.length > 0) {
                  setFlashcards(shuffleArray(dueWords));
                  setCurrentCard(0);
                  setIsImageLoading(true);
                } else {
                  console.log('🎉 No more due cards - session complete!');
                  // No more due cards - calculate the next review time
                  if (updatedDeck && updatedDeck.cards.length > 0) {
                    // Find cards for this unit
                    const unitCards = updatedDeck.cards.filter(card => card.unit === parseInt(unitId));
                    
                    if (unitCards.length > 0) {
                      // Find the card with the earliest next review time
                      const nextReviewCard = unitCards.reduce((earliest, card) => {
                        // Use actualNextReview if available, otherwise use nextReview
                        const cardNextReview = card.actualNextReview || card.nextReview;
                        const earliestNextReview = earliest.actualNextReview || earliest.nextReview;
                        
                        return cardNextReview < earliestNextReview ? card : earliest;
                      });
                      
                      // Format the next review time
                      const nextReviewTimestamp = nextReviewCard.actualNextReview || nextReviewCard.nextReview;
                      const formattedTime = formatNextReviewTime(nextReviewTimestamp);
                      
                      console.log(`🔄 Next review available ${formattedTime} (${new Date(nextReviewTimestamp).toLocaleString()})`);
                      
                      // Set the next review time
                      setNextReviewTime(formattedTime);
                      
                      // Show confetti
                      setShowConfetti(true);
                      
                      // Hide confetti after 5 seconds
                      setTimeout(() => {
                        setShowConfetti(false);
                      }, 5000);
                    }
                  }
                  
                  // Set empty flashcards to show completion message
                  setFlashcards([]);
                }
              });
            }
          }
        })
        .catch((error: Error) => {
          console.error('Error recording answer:', error);
        });
    }

    // Store rating in local state
    setRatings(prev => ({
      ...prev,
      [currentCard]: rating
    }));
  }

  // Calculate progress percentage based on successfully learned cards in this session
  const successfullyLearnedCards = Object.values(ratings).filter(rating => rating === 'got-one' || rating === 'got-both').length;
  const totalUniqueCards = new Set(Object.keys(ratings).map(Number)).size;
  const progress = totalUniqueCards > 0 ? (successfullyLearnedCards / flashcards.length * 100) : 0;

  // Add a function to end the current session
  const handleEndSession = async () => {
    if (!address || !finalizeSession || hasFinalized.current) return;
    
    try {
      setIsLoading(true);
      console.log('🏁 Manually ending session for unit:', unitId);
      
      // Mark as finalized to prevent multiple calls
      hasFinalized.current = true;
      
      // Finalize the session to update card review times
      await finalizeSession(parseInt(unitId));
      
      // Navigate back to units page
      window.location.href = '/basics';
    } catch (error) {
      console.error('Error ending session:', error);
      setIsLoading(false);
      // Reset finalized flag if there was an error
      hasFinalized.current = false;
    }
  };

  // Add a function to manually fetch due words
  const fetchDueWords = async () => {
    if (!address) {
      console.log('No address available');
      return;
    }
    
    setIsLoading(true);
    console.log('🔄 Manually fetching due words for unit:', unitId);
    
    try {
      const dueWords = await getDueWords(parseInt(unitId));
      console.log('🔄 Due words result:', dueWords ? `Found ${dueWords.length} due words` : 'No due words found');
      
      // Since getDueWords now only returns truly due cards, we don't need to filter
      if (dueWords.length > 0) {
        const shuffled = shuffleArray(dueWords);
        console.log(`Set ${shuffled.length} flashcards for review`);
        setFlashcards(shuffled);
      } else {
        console.log('No due words found');
        
        // If no due words but we have a deck, try to force cards to be due
        if (deck && deck.cards.filter(card => card.unit === parseInt(unitId)).length > 0) {
          console.log(`Found cards in deck but none are due. Trying to force cards to be due...`);
          
          // Force cards to be due
          const unitCards = deck.cards.filter(card => card.unit === parseInt(unitId));
          console.log(`Found ${unitCards.length} cards for unit ${unitId}, forcing all to be due`);
          
          // Create a modified deck with all cards in this unit set to be due
          const now = Date.now();
          const pastTime = now - (60 * 60 * 1000); // 1 hour in the past
          const updatedDeck = {
            ...deck,
            cards: deck.cards.map(card => {
              if (card.unit === parseInt(unitId)) {
                return {
                  ...card,
                  nextReview: pastTime, // Set to 1 hour in the past to ensure they're due
                };
              }
              return card;
            })
          };
          
          // Save the updated deck to localStorage
          const key = `deck-${deck.userId}`;
          localStorage.setItem(key, JSON.stringify(updatedDeck));
          
          console.log(`Forced all ${unitCards.length} cards for unit ${unitId} to be due`);
          
          // Try getDueWords again after forcing cards to be due
          const forcedDueWords = await getDueWords(parseInt(unitId));
          console.log(`🔄 Found ${forcedDueWords.length} due cards after forcing`);
          
          // Since getDueWords now only returns truly due cards, we don't need to filter
          if (forcedDueWords.length > 0) {
            console.log(`Successfully loaded ${forcedDueWords.length} due cards after forcing`);
            const shuffled = shuffleArray(forcedDueWords);
            setFlashcards(shuffled);
          } else {
            console.log('Still no due cards after forcing');
            setFlashcards([]);
          }
        } else {
          setFlashcards([]);
        }
      }
    } catch (error) {
      console.error('Error fetching due words:', error);
      setFlashcards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to format the next review time
  const formatNextReviewTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = timestamp - now;
    
    // If the next review is in the past or less than 1 minute away, return "now"
    if (diff <= 60 * 1000) {
      return "Available now";
    }
    
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    if (days > 0) {
      return `Available in ${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      return `Available in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `Available in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  };

  // Render the component
  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 sm:px-6 md:px-8 lg:px-0">
      {/* Confetti animation */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          colors={['#36008D', '#00CB8B', '#FCD200', '#FFB3C1', '#FE5E54']}
        />
      )}
      
      {/* Debug info */}
      <div className="fixed top-0 left-0 bg-black bg-opacity-80 text-white p-2 text-xs z-50">
        Cards: {flashcards.length} | Current: {currentCard} | Loading: {isLoading ? 'Yes' : 'No'}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {/* Card display section */}
          {flashcards.length > 0 && currentCard < flashcards.length && (
            <>
              {/* Header */}
              <div className="mb-2 bg-[color:var(--color-bg-nav)] rounded-lg p-4">
                <h1 className="text-2xl font-title mb-1 text-[color:var(--color-text-primary)]">Unit {unitId}: Essential Basics</h1>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-body text-[color:var(--color-text-primary)]">Learning Progress</div>
                  <div className="flex-1 h-3 bg-[color:var(--color-accent-secondary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[color:var(--color-bg-card)] rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <div className="text-sm font-body text-[color:var(--color-text-primary)]">
                    {successfullyLearnedCards} / {flashcards.length} learned
                  </div>
                </div>
              </div>

              {/* Flashcard component */}
              <Flashcard
                imageUrl={flashcards[currentCard].imagePath}
                english={flashcards[currentCard].english}
                spanish={flashcards[currentCard].spanish}
                clue={flashcards[currentCard].clue}
                onRate={handleRate}
              />
            </>
          )}

          {/* Show completion message when all cards are done */}
          {(flashcards.length === 0 || currentCard >= flashcards.length) && !isLoading && (
            <div className="text-center py-8 bg-[color:var(--color-bg-nav)] rounded-lg p-6 shadow-lg">
              <div className="text-5xl font-title mb-4 text-[color:var(--color-text-primary)]">¡Felicidades!</div>
              <p className="mb-6 font-body text-[color:var(--color-text-primary)]">
                You've completed all the due cards for this unit.
              </p>
              
              {nextReviewTime && (
                <div className="mb-6 p-4 bg-[color:var(--color-bg-card)] rounded-lg">
                  <p className="font-body text-[color:var(--color-text-on-dark)] mb-2">
                    <span className="font-semibold">Your next review session will be available:</span>
                  </p>
                  <p className="text-2xl font-title text-[color:var(--color-accent-secondary)]">
                    {nextReviewTime}
                  </p>
                  <p className="text-sm mt-2 font-body text-[color:var(--color-text-on-dark)]">
                    Regular review is key to mastering a language. ¡Hasta pronto!
                  </p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Link
                  href="/basics"
                  className="px-6 py-3 bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] font-title rounded-lg hover:opacity-90 transition-opacity"
                >
                  Back to Units
                </Link>
                
                {/* Add a button to check unit completion status */}
                <button
                  onClick={() => {
                    if (!deck) return;
                    
                    // Check if Unit 1 is in completedUnits
                    const isUnit1Completed = deck.completedUnits.includes(1);
                    
                    // Count cards in Unit 1
                    const unit1Cards = deck.cards.filter(c => c.unit === 1);
                    const unit1CardsWithReps = unit1Cards.filter(c => c.repetitions > 0);
                    
                    // Log detailed information
                    console.log('🔍 UNIT 1 COMPLETION CHECK:', {
                      isUnit1Completed,
                      totalUnit1Cards: unit1Cards.length,
                      unit1CardsWithReps: unit1CardsWithReps.length,
                      allUnit1CardsHaveReps: unit1Cards.length > 0 && unit1Cards.every(c => c.repetitions > 0),
                      completedUnits: deck.completedUnits,
                      unit1CardDetails: unit1Cards.map(c => ({
                        wordId: c.wordId,
                        repetitions: c.repetitions,
                        hasReps: c.repetitions > 0
                      }))
                    });
                    
                    // Show an alert with the results
                    alert(`Unit 1 completion status:
                      - Is marked as completed: ${isUnit1Completed ? 'Yes' : 'No'}
                      - Total cards: ${unit1Cards.length}
                      - Cards with repetitions: ${unit1CardsWithReps.length}
                      - All cards have repetitions: ${unit1Cards.length > 0 && unit1Cards.every(c => c.repetitions > 0) ? 'Yes' : 'No'}
                      
                      Check the console for more details.`);
                  }}
                  className="px-6 py-3 bg-[color:var(--color-bg-card)] text-[color:var(--color-text-on-dark)] font-title rounded-lg hover:opacity-90 transition-opacity"
                >
                  Check Unit 1 Status
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
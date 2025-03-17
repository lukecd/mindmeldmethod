'use client'

import { useState, useEffect, useRef } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { useAddress } from '@chopinframework/react'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import Flashcard from './Flashcard'
import Confetti from 'react-confetti'
import Link from 'next/link'

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

interface Word {
  id: string
  english: string
  spanish: string
  imagePath: string
  clue: string
  unit: number
}

interface MyDeckProps {
  title?: string
  filterByUnit?: number
  words?: Word[]
}

export default function MyDeck({ title = "My Deck", filterByUnit, words }: MyDeckProps) {
  const { address } = useAddress()
  const { recordAnswer, getDueWords, deck, finalizeSession } = useSpacedRepetition(address)
  
  // Use refs to track initialization and finalization
  const hasInitialized = useRef<string | null>(null)
  const hasFinalized = useRef(false)

  // Initialize flashcards in state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [totalCardsRated, setTotalCardsRated] = useState(0)
  
  // Add state to track the next review time
  const [nextReviewTime, setNextReviewTime] = useState<string | null>(null);

  // Add state for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Calculate progress
  const successfullyLearnedCards = deck?.cards
    .filter(card => filterByUnit ? card.unit === filterByUnit : true)
    .filter(card => card.repetitions > 0)
    .length || 0;
    
  const totalCards = deck?.cards
    .filter(card => filterByUnit ? card.unit === filterByUnit : true)
    .length || 0;
    
  const progress = totalCards > 0 ? (successfullyLearnedCards / totalCards) * 100 : 0;

  // Load due cards when component mounts
  useEffect(() => {
    console.log("MyDeck::useEffect")
    
    // Include the unit number in the initialization key to ensure we reinitialize when changing units
    const unitNumber = filterByUnit || 0;
    const initKey = `${address}-unit${unitNumber}-${words ? 'withWords' : 'noWords'}`;
    
    console.log(`Initialization key: ${initKey}, current: ${hasInitialized.current}`);
    
    if (hasInitialized.current === initKey) {
      console.log("MyDeck: Already initialized with these props, skipping");
      return;
    }
    
    let isMounted = true;
    setIsLoading(true);
    
    // Mark as initialized with the current props
    hasInitialized.current = initKey;
    
    const loadDueCards = async () => {
      console.log("MyDeck::loadDueCards for unit", unitNumber)
      try {
        if (!address) return;
        
        // If words are passed as a prop, use them
        if (words && words.length > 0) {
          console.log(`Using ${words.length} words passed as props`);
          
          // Check for duplicates and add new words to the deck
          if (deck) {
            const existingIds = new Set(deck.cards.map(card => card.wordId));
            const newWords = words.filter(word => !existingIds.has(word.id));
            
            if (newWords.length > 0) {
              console.log(`Adding ${newWords.length} new words to the deck`);
              
              // Create new cards for the new words
              const now = Date.now();
              const newCards = newWords.map(word => ({
                wordId: word.id,
                addedAt: now,
                unit: word.unit,
                easeFactor: 2.5,
                interval: 0,
                repetitions: 0,
                nextReview: now - 1000, // Set to slightly in the past to make it due immediately
                lastReview: 0
              }));
              
              // Update the deck
              const updatedDeck = {
                ...deck,
                cards: [...deck.cards, ...newCards],
                lastSyncedAt: now
              };
              
              // Save to localStorage
              const key = `deck-${deck.userId}`;
              localStorage.setItem(key, JSON.stringify(updatedDeck));
              
              console.log(`Added ${newCards.length} new cards to the deck`);
            }
          }
          
          // Convert words to flashcards
          const flashcardsFromWords: Flashcard[] = words.map((word: Word) => ({
            id: word.id,
            english: word.english,
            spanish: word.spanish,
            imagePath: word.imagePath,
            clue: word.clue,
            unit: word.unit
          }));
          
          // Get due cards for this unit (if any)
          let dueCards: Flashcard[] = [];
          if (filterByUnit) {
            const dueWords = await getDueWords(filterByUnit);
            if (dueWords.length > 0) {
              console.log(`Found ${dueWords.length} due cards for unit ${filterByUnit}`);
              dueCards = dueWords;
            }
          }
          
          // Combine new words with due cards, removing duplicates
          const allCardIds = new Set(flashcardsFromWords.map(card => card.id));
          const uniqueDueCards = dueCards.filter(card => !allCardIds.has(card.id));
          
          const allCards = [...flashcardsFromWords, ...uniqueDueCards];
          console.log(`Total cards to review: ${allCards.length} (${flashcardsFromWords.length} new, ${uniqueDueCards.length} due)`);
          
          // Shuffle and set the flashcards
          const shuffled = shuffleArray(allCards);
          setFlashcards(shuffled);
          setIsLoading(false);
          return;
        }
        
        // If no words are passed, get due words for the specified unit or all units
        const dueWords = await getDueWords(filterByUnit || 0);
        
        if (!isMounted) return;
        
        if (dueWords.length > 0) {
          const shuffled = shuffleArray(dueWords);
          setFlashcards(shuffled);
        } else {
          // No due cards - show completion message
          setFlashcards([]);
        }
      } catch (error) {
        console.error('Error loading cards:', error);
        setFlashcards([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    console.log("MyDeck::loadDueCards::before")
    loadDueCards();
    console.log("MyDeck::loadDueCards::after")
    
    // Update window size for confetti
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => {
      isMounted = false;
      window.removeEventListener('resize', updateWindowSize);
      
      // Finalize the session when component unmounts
      if (!hasFinalized.current && finalizeSession && address) {
        hasFinalized.current = true;
        finalizeSession().catch(error => {
          console.error('Error finalizing session:', error);
        });
      }
    };
  }, [address, deck, getDueWords, finalizeSession, filterByUnit, words]);

  // Add an effect to show confetti when there are no flashcards left
  useEffect(() => {
    // Check if we've just completed all cards
    if (flashcards.length === 0 && !isLoading && deck) {
      // Find relevant cards
      const relevantCards = deck.cards.filter(card => 
        filterByUnit ? card.unit === filterByUnit : true
      );
      
      if (relevantCards.length > 0) {
        // Find the card with the earliest next review time
        const nextReviewCard = relevantCards.reduce((earliest, card) => {
          // Use actualNextReview if available, otherwise use nextReview
          const cardNextReview = card.actualNextReview || card.nextReview;
          const earliestNextReview = earliest.actualNextReview || earliest.nextReview;
          
          return cardNextReview < earliestNextReview ? card : earliest;
        });
        
        // Format the next review time
        const nextReviewTimestamp = nextReviewCard.actualNextReview || nextReviewCard.nextReview;
        const formattedTime = formatNextReviewTime(nextReviewTimestamp);
        
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
  }, [flashcards.length, isLoading, deck, filterByUnit]);

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

  // Define rating map for quality and XP
  const ratingMap = {
    'no-clue': { quality: 1, xp: 1 },
    'got-one': { quality: 3, xp: 3 },
    'got-both': { quality: 5, xp: 5 }
  };

  // Handle rating a card
  const handleRate = (rating: 'no-clue' | 'got-one' | 'got-both') => {
    // Increment total cards rated
    setTotalCardsRated(prev => prev + 1);
    
    // Record the answer in spaced repetition system
    if (recordAnswer) {
      // Keep cards in session (true by default) so they remain available for review
      recordAnswer(flashcards[currentCard].id, ratingMap[rating].quality, ratingMap[rating].xp, true)
        .then((updatedDeck) => {
          if (rating === 'no-clue') {
            // For "No Idea" ratings, move the current card to a later position in the deck
            // so the user will see it again later in the session
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
            
            // Update the flashcards array
            setFlashcards(newFlashcards);
            
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
              // No more cards in this session, check if there are any due cards
              getDueWords(filterByUnit || 0).then(dueWords => {
                if (dueWords.length > 0) {
                  setFlashcards(shuffleArray(dueWords));
                  setCurrentCard(0);
                  setIsImageLoading(true);
                } else {
                  // No more due cards, show completion message
                  setFlashcards([]);
                }
              });
            }
          }
        })
        .catch(error => {
          console.error('Error recording answer:', error);
        });
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
                <h1 className="text-2xl font-title mb-1 text-[color:var(--color-text-primary)]">{title}</h1>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-body text-[color:var(--color-text-primary)]">Learning Progress</div>
                  <div className="flex-1 h-3 bg-[color:var(--color-accent-secondary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[color:var(--color-bg-card)] rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <div className="text-sm font-body text-[color:var(--color-text-primary)]">
                    {successfullyLearnedCards} / {totalCards} learned
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
                You've completed all the due cards in your deck.
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
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  english: string
  spanish: string
  imagePath: string
  clue: string
}

interface WordsData {
  words: Flashcard[]
}

interface UnitContentProps {
  unitId: string
  unitTitle: string
}

export default function UnitContent({ unitId, unitTitle }: UnitContentProps) {
  // Load word data
  const [wordsData, setWordsData] = useState<WordsData | null>(null)
  useEffect(() => {
    fetch(`/data/${unitId.padStart(2, '0')}_words.json`)
      .then(res => res.json())
      .then(data => setWordsData(data))
      .catch(console.error)
  }, [unitId])

  // Initialize flashcards in state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [isEnglishFlipped, setIsEnglishFlipped] = useState(false)
  const [isSpanishFlipped, setIsSpanishFlipped] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [ratings, setRatings] = useState<Record<number, string>>({})

  // Shuffle cards when data is loaded
  useEffect(() => {
    if (wordsData?.words?.length) {
      setFlashcards(shuffleArray(wordsData.words))
    }
  }, [wordsData])

  const handleRate = (rating: 'no-idea' | 'got-one' | 'got-both') => {
    // Store the rating for the current card
    setRatings(prev => ({
      ...prev,
      [currentCard]: rating
    }))

    // Move to next card if not at the end
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setIsEnglishFlipped(false)
      setIsSpanishFlipped(false)
      setShowClue(false)
    }
  }

  // Calculate progress percentage
  const progress = flashcards.length ? ((currentCard + 1) / flashcards.length * 100) : 0

  if (!wordsData || !flashcards.length) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-[color:var(--color-text-inverse)]">Loading...</div>
      </div>
    )
  }

  const currentFlashcard = flashcards[currentCard]
  if (!currentFlashcard) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-[color:var(--color-text-inverse)]">Error loading flashcard data</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-2 bg-[color:var(--color-bg-nav)] p-4">
          <h1 className="text-2xl font-title text-[color:var(--color-text-inverse)] mb-2">Unit {unitId}: {unitTitle}</h1>
          <div className="flex items-center gap-2">
            <div className="text-[color:var(--color-text-inverse)]/80 text-sm">Progress</div>
            <div className="flex-1 h-2 bg-[color:var(--color-bg-card)]">
              <div 
                className="h-full bg-[color:var(--color-accent-secondary)] transition-all duration-300" 
                style={{ width: `${progress}%`, marginLeft: '0' }} 
              />
            </div>
            <div className="text-[color:var(--color-text-inverse)]/80 text-sm">{currentCard + 1} / {flashcards.length}</div>
          </div>
        </div>

        {/* Main Bento Box Layout */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left Column - Image */}
          <div className="aspect-square bg-[color:var(--color-bg-card)] relative">
            <Image 
              src={currentFlashcard.imagePath} 
              alt={currentFlashcard.english}
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column - Bento Box Grid */}
          <div className="grid grid-rows-[2fr,1fr,1fr] gap-2">
            {/* Clue Button */}
            <button 
              onClick={() => setShowClue(!showClue)}
              className="bg-[color:var(--color-accent-secondary)] p-4 text-center hover:bg-[color:var(--color-button-primary)] transition-colors"
            >
              <div className="text-lg font-bold text-[color:var(--color-text-inverse)] mb-2">
                {showClue ? 'Hide Clue' : 'Show Clue'}
              </div>
              {showClue && (
                <div className="text-[color:var(--color-text-inverse)] text-sm">{currentFlashcard.clue}</div>
              )}
            </button>

            {/* Language Buttons Row */}
            <div className="grid grid-cols-2 gap-2">
              {/* English Button */}
              <div 
                onClick={() => setIsEnglishFlipped(!isEnglishFlipped)}
                className="relative h-full [perspective:1000px] cursor-pointer"
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isEnglishFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div 
                    className="absolute w-full h-full bg-[color:var(--color-bg-nav)] p-2 flex items-center justify-center 
                             text-base font-bold text-[color:var(--color-text-inverse)] backface-hidden"
                  >
                    English
                  </div>
                  <div 
                    className="absolute w-full h-full bg-[color:var(--color-bg-nav)] p-2 flex items-center justify-center 
                             text-base font-bold text-[color:var(--color-text-inverse)] backface-hidden [transform:rotateY(180deg)]"
                  >
                    {currentFlashcard.english}
                  </div>
                </div>
              </div>

              {/* Spanish Button */}
              <div 
                onClick={() => setIsSpanishFlipped(!isSpanishFlipped)}
                className="relative h-full [perspective:1000px] cursor-pointer"
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isSpanishFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div 
                    className="absolute w-full h-full bg-[color:var(--color-bg-nav)] p-2 flex items-center justify-center 
                             text-base font-bold text-[color:var(--color-text-inverse)] backface-hidden"
                  >
                    Español
                  </div>
                  <div 
                    className="absolute w-full h-full bg-[color:var(--color-bg-nav)] p-2 flex items-center justify-center 
                             text-base font-bold text-[color:var(--color-text-inverse)] backface-hidden [transform:rotateY(180deg)]"
                  >
                    {currentFlashcard.spanish}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Buttons Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRate('no-idea')}
                className="bg-[color:var(--color-button-secondary)] text-[color:var(--color-text-inverse)] font-bold p-2"
              >
                No Idea
              </button>
              <button
                onClick={() => handleRate('got-one')}
                className="bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] font-bold p-2"
              >
                Got One
              </button>
              <button
                onClick={() => handleRate('got-both')}
                className="bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] font-bold p-2"
              >
                Got Both
              </button>
            </div>
          </div>
        </div>

        {/* Visual Cues Section */}
        <div className="mb-4">
          <div className="bg-[color:var(--color-bg-nav)] p-8 text-center mb-2 mt-3">
            <h2 className="text-xl font-title text-[color:var(--color-text-inverse)]">
              Our flashcards use visual cues to help trick your brain into memorizing faster.
            </h2>
          </div>
          <div className="text-[color:var(--color-text-inverse)]/60 text-xs text-center">
            Learn more about our method in the{' '}
            <Link href="/about" className="text-[color:var(--color-text-inverse)]/80 hover:underline">
              About page
            </Link>
          </div>
        </div>

        {/* Show completion message when all cards are done */}
        {currentCard === flashcards.length - 1 && Object.keys(ratings).length === flashcards.length && (
          <div className="mt-4 p-4 bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-inverse)] text-center">
            <h2 className="text-xl font-bold mb-2">Unit Complete!</h2>
            <p>You&apos;ve reviewed all {flashcards.length} words.</p>
          </div>
        )}
      </div>
    </div>
  )
} 
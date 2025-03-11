'use client'

import { useState } from 'react'
import Image from 'next/image'
import nounsData from '@/public/data/01_nouns.json'
import verbsData from '@/public/data/01_verbs.json'
import adjectivesData from '@/public/data/01_adjectives.json'
import Link from 'next/link'

// Combine all words from the three files
const flashcards = [
  ...nounsData.words,
  ...verbsData.words,
  ...adjectivesData.words
]

export default function Unit1Page() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isEnglishFlipped, setIsEnglishFlipped] = useState(false)
  const [isSpanishFlipped, setIsSpanishFlipped] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [ratings, setRatings] = useState<Record<number, string>>({})

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
  const progress = (currentCard / flashcards.length) * 100

  return (
    <div className="min-h-screen bg-[#2D1B36] pt-20 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-2 bg-[#E94F37] p-4">
          <h1 className="text-2xl font-scifi text-[#F6E8EA] mb-2">Unit 1: Essential Basics</h1>
          <div className="flex items-center gap-2">
            <div className="text-[#F6E8EA]/80 text-sm">Progress</div>
            <div className="flex-1 h-2 bg-[#2D1B36]">
              <div 
                className="h-full bg-[#F7A072] transition-all duration-300" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="text-[#F6E8EA]/80 text-sm">{currentCard + 1} / {flashcards.length}</div>
          </div>
        </div>

        {/* Main Bento Box Layout */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left Column - Image */}
          <div className="aspect-square bg-[#2D1B36] relative">
            <Image 
              src={flashcards[currentCard].imagePath} 
              alt={flashcards[currentCard].english}
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column - Bento Box Grid */}
          <div className="grid grid-rows-[2fr,1fr,1fr] gap-2">
            {/* Clue Button */}
            <button 
              onClick={() => setShowClue(!showClue)}
              className="bg-[#F7A072] p-4 text-center"
            >
              <div className="text-lg font-bold text-[#2D1B36] mb-2">
                {showClue ? 'Hide Clue' : 'Show Clue'}
              </div>
              {showClue && (
                <div className="text-[#2D1B36] text-sm">{flashcards[currentCard].clue}</div>
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
                    className="absolute w-full h-full bg-[#F6E8EA] p-2 flex items-center justify-center 
                             text-base font-bold text-[#2D1B36] backface-hidden"
                  >
                    English
                  </div>
                  <div 
                    className="absolute w-full h-full bg-[#F6E8EA] p-2 flex items-center justify-center 
                             text-base font-bold text-[#2D1B36] backface-hidden [transform:rotateY(180deg)]"
                  >
                    {flashcards[currentCard].english}
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
                    className="absolute w-full h-full bg-[#F6E8EA] p-2 flex items-center justify-center 
                             text-base font-bold text-[#2D1B36] backface-hidden"
                  >
                    Español
                  </div>
                  <div 
                    className="absolute w-full h-full bg-[#F6E8EA] p-2 flex items-center justify-center 
                             text-base font-bold text-[#2D1B36] backface-hidden [transform:rotateY(180deg)]"
                  >
                    {flashcards[currentCard].spanish}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Buttons Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRate('no-idea')}
                className="bg-[#E94F37] text-[#F6E8EA] text-sm p-2"
              >
                No Idea
              </button>
              <button
                onClick={() => handleRate('got-one')}
                className="bg-[#3D5A80] text-[#F6E8EA] text-sm p-2"
              >
                Got One
              </button>
              <button
                onClick={() => handleRate('got-both')}
                className="bg-[#F26B3C] text-[#F6E8EA] text-sm p-2"
              >
                Got Both
              </button>
            </div>
          </div>
        </div>

        {/* Visual Cues Section */}
        <div className="mb-4">
          <div className="bg-[#E94F37] p-8 text-center mb-2 mt-3">
            <h2 className="text-xl font-scifi text-[#F6E8EA]">
              Our flashcards use visual cues to help trick your brain into memorizing faster.
            </h2>
          </div>
          <div className="text-[#F6E8EA]/60 text-xs text-center">
            Learn more about our method in the{' '}
            <Link href="/about" className="text-[#F6E8EA]/80 hover:underline">
              About page
            </Link>
          </div>
        </div>

        {/* Show completion message when all cards are done */}
        {currentCard === flashcards.length - 1 && Object.keys(ratings).length === flashcards.length && (
          <div className="mt-4 p-4 bg-[#F7A072] text-[#2D1B36] text-center">
            <h2 className="text-xl font-bold mb-2">Unit Complete!</h2>
            <p>You&apos;ve reviewed all {flashcards.length} words.</p>
          </div>
        )}
      </div>
    </div>
  )
} 
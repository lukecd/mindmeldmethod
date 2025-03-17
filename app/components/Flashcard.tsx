'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoadingSpinner from './LoadingSpinner'

interface FlashcardProps {
  imageUrl: string
  english: string
  spanish: string
  clue?: string
  onRate: (rating: 'no-clue' | 'got-one' | 'got-both') => void
}

export default function Flashcard({ imageUrl, english, spanish, clue, onRate }: FlashcardProps) {
  const [isEnglishFlipped, setIsEnglishFlipped] = useState(false)
  const [isSpanishFlipped, setIsSpanishFlipped] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  // Reset flipped states when card content changes
  useEffect(() => {
    setIsEnglishFlipped(false)
    setIsSpanishFlipped(false)
    setShowClue(false)
    setImageLoading(true)
  }, [english, spanish, imageUrl])

  // Determine if rating buttons should be enabled
  const canRate = isEnglishFlipped && isSpanishFlipped

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header is handled by parent component */}
      
      {/* Main bento box layout */}
      <div className="grid grid-cols-12 gap-2">
        {/* Left column - Image (7 columns wide) */}
        <div className="col-span-7 bg-white overflow-hidden">
          <div className="relative aspect-square w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <LoadingSpinner />
              </div>
            )}
            <Image
              src={imageUrl}
              alt="Flashcard image"
              fill
              className="object-cover"
              onLoadingComplete={() => setImageLoading(false)}
              onLoad={() => setImageLoading(false)}
              priority
            />
          </div>
        </div>
        
        {/* Right column - Controls (5 columns wide) */}
        <div className="col-span-5 grid grid-rows-6 gap-2">
          {/* Show Clue button (2 rows tall) */}
          <div className="row-span-2">
            <button
              onClick={() => setShowClue(!showClue)}
              className="w-full h-full bg-[color:var(--color-bg-card)] text-white font-body hover:bg-opacity-90 transition-colors flex items-center justify-center"
            >
              {showClue && clue ? clue : "Show Clue"}
            </button>
          </div>
          
          {/* Language buttons (2 rows tall) */}
          <div className="row-span-2 grid grid-cols-2 gap-2">
            {/* English Button with flip effect */}
            <div className="relative h-full perspective">
              <div 
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  isEnglishFlipped ? 'rotate-y-180' : 'rotate-y-0'
                }`}
              >
                <button
                  onClick={() => setIsEnglishFlipped(!isEnglishFlipped)}
                  className="absolute w-full h-full bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] font-body hover:bg-opacity-90 transition-colors flex items-center justify-center backface-hidden"
                >
                  English
                </button>
                <div 
                  className="absolute w-full h-full bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] font-body flex items-center justify-center backface-hidden rotate-y-180"
                >
                  {english}
                </div>
              </div>
            </div>
            
            {/* Spanish Button with flip effect */}
            <div className="relative h-full perspective">
              <div 
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  isSpanishFlipped ? 'rotate-y-180' : 'rotate-y-0'
                }`}
              >
                <button
                  onClick={() => setIsSpanishFlipped(!isSpanishFlipped)}
                  className="absolute w-full h-full bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] font-body hover:bg-opacity-90 transition-colors flex items-center justify-center backface-hidden"
                >
                  Español
                </button>
                <div 
                  className="absolute w-full h-full bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] font-body flex items-center justify-center backface-hidden rotate-y-180"
                >
                  {spanish}
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating buttons (2 rows tall) */}
          <div className="row-span-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => onRate('no-clue')}
              disabled={!canRate}
              className={`h-full bg-pink-300 text-[color:var(--color-text-primary)] font-body flex items-center justify-center ${
                canRate 
                  ? 'hover:bg-opacity-90 transition-colors' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              No Idea
            </button>
            <button
              onClick={() => onRate('got-one')}
              disabled={!canRate}
              className={`h-full bg-[color:var(--color-button-primary)] text-white font-body flex items-center justify-center ${
                canRate 
                  ? 'hover:bg-opacity-90 transition-colors' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Got One
            </button>
            <button
              onClick={() => onRate('got-both')}
              disabled={!canRate}
              className={`h-full bg-[color:var(--color-button-primary)] text-white font-body flex items-center justify-center ${
                canRate 
                  ? 'hover:bg-opacity-90 transition-colors' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Got Both
            </button>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <div className="mt-2 py-3 bg-[color:var(--color-bg-nav)] text-center mb-2">
        <p className="font-title text-lg text-[color:var(--color-text-primary)]">Our flashcards use visual cues to help trick your brain into memorizing faster.</p>
      </div>
      
      <div className="text-center text-xs font-body text-[color:var(--color-text-muted)]">
        Learn more about our method in the <Link href="/about" className="text-[color:var(--color-text-primary)] hover:underline">About page</Link>
      </div>
    </div>
  )
} 
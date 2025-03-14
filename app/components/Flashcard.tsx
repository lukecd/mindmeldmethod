'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FlashcardProps {
  imageUrl: string
  english: string
  spanish: string
  clue?: string
  onRate: (rating: 'no-clue' | 'got-one' | 'got-both') => void
}

export default function Flashcard({ imageUrl, english, spanish, clue, onRate }: FlashcardProps) {
  const [flipped, setFlipped] = useState<'front' | 'english' | 'spanish'>('front')
  const [showClue, setShowClue] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Unit title and progress bar would be in the parent component */}
      
      {/* Main flashcard grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Left side - Image (3 columns on md+) */}
        <div className="md:col-span-3 relative aspect-[4/3] bg-mindmeld-navy rounded-3xl overflow-hidden">
          <Image
            src={imageUrl}
            alt="Flashcard image"
            fill
            className="object-contain"
          />
        </div>
        
        {/* Right side - Controls (2 columns on md+) */}
        <div className="md:col-span-2 grid grid-rows-4 gap-4">
          {/* Clue section */}
          <div 
            className="bg-mindmeld-yellow rounded-3xl flex items-center justify-center cursor-pointer"
            onClick={() => setShowClue(!showClue)}
          >
            <div className="text-mindmeld-navy font-title text-xl p-6 text-center">
              {showClue && clue ? clue : "Show Clue"}
            </div>
          </div>
          
          {/* Language buttons */}
          <div className="grid grid-cols-2 gap-4 row-span-2">
            {/* English button */}
            <div 
              className="bg-mindmeld-green rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => setFlipped(flipped === 'english' ? 'front' : 'english')}
            >
              <div className="text-center p-6">
                <div className="font-title text-xl">
                  {flipped === 'english' ? english : "English"}
                </div>
              </div>
            </div>
            
            {/* Spanish button */}
            <div 
              className="bg-mindmeld-green rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={() => setFlipped(flipped === 'spanish' ? 'front' : 'spanish')}
            >
              <div className="text-center p-6">
                <div className="font-title text-xl">
                  {flipped === 'spanish' ? spanish : "Español"}
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onRate('no-clue')}
              className="bg-pink-300 hover:bg-pink-400 text-mindmeld-navy py-3 rounded-xl font-title transition-colors"
            >
              No Idea
            </button>
            <button
              onClick={() => onRate('got-one')}
              className="bg-mindmeld-coral hover:bg-mindmeld-coral/80 text-white py-3 rounded-xl font-title transition-colors"
            >
              Got One
            </button>
            <button
              onClick={() => onRate('got-both')}
              className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-title transition-colors"
            >
              Got Both
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer message */}
      <div className="mt-8 bg-mindmeld-green rounded-3xl p-6 text-center">
        <p className="font-title text-xl">Our flashcards use visual cues to help trick your brain into memorizing faster.</p>
      </div>
    </div>
  )
} 
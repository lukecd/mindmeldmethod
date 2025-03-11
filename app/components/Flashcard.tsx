'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FlashcardProps {
  imageUrl: string
  english: string
  spanish: string
  onRate: (rating: 'no-clue' | 'got-one' | 'got-both') => void
}

export default function Flashcard({ imageUrl, english, spanish, onRate }: FlashcardProps) {
  const [flipped, setFlipped] = useState<'front' | 'english' | 'spanish'>('front')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-mindmeld-navy rounded-3xl p-6 border border-white/10">
        {/* Card content */}
        <div className="relative aspect-[4/3] mb-6">
          {flipped === 'front' ? (
            <>
              <Image
                src={imageUrl}
                alt="Flashcard image"
                fill
                className="object-contain rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 flex gap-4">
                <button
                  onClick={() => setFlipped('english')}
                  className="flex-1 bg-mindmeld-coral text-white py-3 rounded-xl font-scifi hover:bg-mindmeld-coral/80 transition-colors"
                >
                  English
                </button>
                <button
                  onClick={() => setFlipped('spanish')}
                  className="flex-1 bg-mindmeld-yellow text-mindmeld-navy py-3 rounded-xl font-scifi hover:bg-mindmeld-yellow/80 transition-colors"
                >
                  Español
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-scifi mb-4 text-white">
                  {flipped === 'english' ? english : spanish}
                </div>
                <button
                  onClick={() => setFlipped('front')}
                  className="text-mindmeld-coral hover:text-mindmeld-coral/80 transition-colors"
                >
                  ← Back to image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rating buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onRate('no-clue')}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors"
          >
            No Clue
          </button>
          <button
            onClick={() => onRate('got-one')}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors"
          >
            Got One
          </button>
          <button
            onClick={() => onRate('got-both')}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors"
          >
            Got Both
          </button>
        </div>
      </div>
    </div>
  )
} 
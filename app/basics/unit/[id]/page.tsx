'use client'

import { useState, useEffect, use } from 'react'
import { useAddress } from '@chopinframework/react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import MyDeck from '../../../components/MyDeck'

interface PageProps {
  params: Promise<{ id: string }>
}

interface Word {
  id: string
  spanish: string
  english: string
  imagePath: string
  unit: number
  clue: string
}

export default function UnitPage({ params }: PageProps) {
  const { id: unitId } = use(params)
  const { address } = useAddress()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unitWords, setUnitWords] = useState<Word[]>([])

  // Load the unit words when the component mounts
  useEffect(() => {
    const loadUnitWords = async () => {
      try {
        // Get the unit number
        const unitNumber = parseInt(unitId);
        
        // Fetch the unit words from the JSON file
        const response = await fetch(`/data/${unitNumber.toString().padStart(2, '0')}_words.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch unit ${unitNumber} data`);
        }
        
        const unitData = await response.json();
        console.log("Loaded unit data");
        console.log(unitData.words);
        setUnitWords(unitData.words);
        setIsLoading(false);
      } catch (e) {
        console.error('Error loading unit words:', e);
        setError('Failed to load unit words. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadUnitWords();
  }, [unitId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-[color:var(--color-text-inverse)]">Loading unit {unitId}...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-center text-[color:var(--color-text-inverse)]">
          <p className="text-xl mb-4">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Show the MyDeck component once the unit is loaded, passing the words directly
  return (
    <MyDeck
      title={`Unit ${unitId}`}
      filterByUnit={parseInt(unitId)}
      words={unitWords}
    />
  )
} 
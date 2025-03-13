'use client'

import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import UnitContent from './UnitContent'
import { useSpacedRepetition } from '../../../hooks/useSpacedRepetition'
import { useEffect, useState, use } from 'react'

const UNIT_TITLES = {
  '1': 'Essential Basics',
  '2': 'Building Vocabulary',
  '3': 'Common Phrases',
  '4': 'Daily Conversations',
  '5': 'Travel & Directions',
  '6': 'Food & Dining',
  '7': 'Work & Business',
  '8': 'Social Situations',
  '9': 'Culture & Entertainment',
  '10': 'Advanced Topics'
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function UnitPage({ params }: PageProps) {
  const { id: unitId } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unitAccess, setUnitAccess] = useState<{
    isStarted: boolean
    completedWords: number
    totalWords: number
    canAccess: boolean
  } | null>(null)

  const unitTitle = UNIT_TITLES[unitId as keyof typeof UNIT_TITLES]

  // Validate unit ID
  if (!unitTitle || isNaN(Number(unitId)) || Number(unitId) < 1 || Number(unitId) > 10) {
    console.log('🚫 Invalid unit ID:', unitId)
    notFound()
  }

  // Fetch unit access data
  useEffect(() => {
    let isMounted = true

    async function checkUnitAccess() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/units/${unitId}/progress`)
        if (!response.ok) {
          throw new Error('Failed to fetch unit access')
        }
        
        const data = await response.json()
        
        if (!isMounted) return
        
        setUnitAccess(data)
        setIsLoading(false)

        // Redirect if no access
        if (!data.canAccess) {
          console.log('🚫 Access denied, redirecting to basics page')
          router.push('/basics')
        }
      } catch (error) {
        if (!isMounted) return
        console.error('Error checking unit access:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
        setIsLoading(false)
      }
    }

    checkUnitAccess()

    return () => {
      isMounted = false
    }
  }, [unitId, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-[color:var(--color-text-inverse)]">Loading...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="text-[color:var(--color-text-inverse)]">Error: {error}</div>
      </div>
    )
  }

  // Show error state if no access
  if (!unitAccess) {
    return null // Will redirect
  }

  // Show error state if no access
  if (!unitAccess.canAccess) {
    return null // Will redirect
  }

  return <UnitContent unitId={unitId} unitTitle={unitTitle} />
} 
'use client'

import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import UnitContent from './UnitContent'
import { useSpacedRepetition } from '../../../hooks/useSpacedRepetition'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import LoadingSpinner from '../../../components/LoadingSpinner'

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
    previousUnitCompletion: number
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

        // Redirect if no access - after a short delay to show the message
        if (!data.canAccess) {
          console.log('🚫 Access denied, redirecting to basics page')
          setTimeout(() => {
            router.push('/basics')
          }, 3000) // Redirect after 3 seconds
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
        <div className="text-[color:var(--color-text-inverse)]">Error: {error}</div>
      </div>
    )
  }

  // Show access denied state
  if (!unitAccess || !unitAccess.canAccess) {
    const prevUnitId = Number(unitId) - 1;
    return (
      <div className="min-h-screen bg-[color:var(--color-bg-main)] pt-20 px-4 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-title text-[color:var(--color-text-inverse)] mb-4">Access Denied</h1>
          <p className="text-[color:var(--color-text-inverse)] mb-6">
            {Number(unitId) > 1 
              ? `You need to complete Unit ${prevUnitId} before accessing Unit ${unitId}.`
              : 'You cannot access this unit yet.'}
          </p>
          {unitAccess && Number(unitId) > 1 && (
            <div className="mb-6">
              <p className="text-[color:var(--color-text-inverse)] mb-2">Current progress:</p>
              <div className="w-full h-4 bg-[color:var(--color-text-inverse)]/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[color:var(--color-accent-primary)]" 
                  style={{ width: `${unitAccess.previousUnitCompletion * 100}%` }}
                ></div>
              </div>
              <p className="text-[color:var(--color-text-inverse)] mt-2">
                {Math.round(unitAccess.previousUnitCompletion * 100)}% complete
              </p>
            </div>
          )}
          <p className="text-[color:var(--color-text-inverse)] mb-4">
            Redirecting to the units page...
          </p>
          <Link 
            href="/basics" 
            className="inline-block bg-[color:var(--color-accent-primary)] text-[color:var(--color-text-primary)] px-6 py-2"
          >
            Return to Units
          </Link>
        </div>
      </div>
    );
  }

  return <UnitContent unitId={unitId} unitTitle={unitTitle} />
} 
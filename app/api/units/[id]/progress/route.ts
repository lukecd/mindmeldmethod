import { NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { logger } from '../../../../lib/logger'

const MIN_COMPLETION_THRESHOLD = 0.8 // 80% completion required to unlock next unit

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const userId = 'PLACEHOLDER_USER' // This will come from auth later
    const unitId = parseInt(id)
    
    if (isNaN(unitId) || unitId < 1 || unitId > 10) {
      logger.warning('Invalid unit ID requested', { userId, unitId })
      return NextResponse.json(
        { error: 'Invalid unit ID' },
        { status: 400 }
      )
    }

    const deck = await storage.getDeck(userId)
    if (!deck) {
      logger.info('No deck found for progress check', { userId, unitId })
      return NextResponse.json({
        isStarted: false,
        completedWords: 0,
        totalWords: 0,
        canAccess: unitId === 1,
        metrics: {
          completionRate: 0,
          averageRepetitions: 0,
          averageEaseFactor: 0
        }
      })
    }

    // Get unit stats
    const unitCards = deck.cards.filter(card => card.unit === unitId)
    const completedWords = unitCards.filter(card => card.repetitions > 0).length
    const totalWords = unitCards.length
    const completionRate = totalWords > 0 ? completedWords / totalWords : 0

    // Calculate metrics
    const metrics = {
      completionRate,
      averageRepetitions: unitCards.reduce((sum, card) => sum + card.repetitions, 0) / totalWords,
      averageEaseFactor: unitCards.reduce((sum, card) => sum + card.easeFactor, 0) / totalWords
    }

    // Calculate unit access
    const previousUnitCards = deck.cards.filter(card => card.unit === unitId - 1)
    const previousUnitCompletion = previousUnitCards.length > 0
      ? previousUnitCards.filter(card => card.repetitions > 0).length / previousUnitCards.length
      : 1

    const canAccess = unitId === 1 || 
      (previousUnitCompletion >= MIN_COMPLETION_THRESHOLD && unitId <= Math.max(1, ...deck.cards.map(card => card.unit)) + 1)

    logger.info('Unit progress calculated', {
      userId,
      unitId,
      completedWords,
      totalWords,
      completionRate: completionRate.toFixed(2),
      canAccess
    })

    return NextResponse.json({
      isStarted: totalWords > 0,
      completedWords,
      totalWords,
      canAccess,
      metrics,
      previousUnitCompletion
    })
  } catch (error) {
    const { id } = await context.params
    logger.error('Error fetching unit progress', error, { userId: 'PLACEHOLDER_USER', unitId: parseInt(id) })
    return NextResponse.json(
      { error: 'Failed to fetch unit progress' },
      { status: 500 }
    )
  }
} 
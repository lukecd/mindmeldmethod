import { NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { logger } from '../../../../lib/logger'

// Require 100% of cards to have at least "Got One" (repetitions > 0)
const MIN_COMPLETION_THRESHOLD = 1.0 

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
        canAccess: unitId === 1, // Only Unit 1 is accessible without a deck
        metrics: {
          completionRate: 0,
          averageRepetitions: 0,
          averageEaseFactor: 0
        },
        previousUnitCompletion: 0
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
      averageRepetitions: unitCards.length > 0 ? unitCards.reduce((sum, card) => sum + card.repetitions, 0) / totalWords : 0,
      averageEaseFactor: unitCards.length > 0 ? unitCards.reduce((sum, card) => sum + card.easeFactor, 0) / totalWords : 0
    }

    // Calculate unit access
    let canAccess = unitId === 1; // Unit 1 is always accessible
    let previousUnitCompletion = 0;
    
    if (unitId > 1) {
      // For units 2-10, check if previous unit exists and is completed
      const previousUnitCards = deck.cards.filter(card => card.unit === unitId - 1);
      
      // If previous unit has no cards, it hasn't been started yet
      if (previousUnitCards.length === 0) {
        previousUnitCompletion = 0;
        canAccess = false;
      } else {
        // Calculate completion percentage of previous unit
        const completedCardsInPreviousUnit = previousUnitCards.filter(card => card.repetitions > 0).length;
        previousUnitCompletion = previousUnitCards.length > 0 
          ? completedCardsInPreviousUnit / previousUnitCards.length 
          : 0;
        
        // Allow access only if previous unit is sufficiently completed
        canAccess = previousUnitCompletion >= MIN_COMPLETION_THRESHOLD;
        
        // If the previous unit is in the completedUnits array, always allow access
        if (deck.completedUnits && deck.completedUnits.includes(unitId - 1)) {
          canAccess = true;
          previousUnitCompletion = 1.0; // 100% completion
        }
      }
      
      // Additional check: only allow access to the next unit after the highest started unit
      const highestStartedUnit = Math.max(1, ...deck.cards.map(card => card.unit));
      if (unitId > highestStartedUnit + 1) {
        canAccess = false;
      }
    }

    logger.info('Unit progress calculated', {
      userId,
      unitId,
      completedWords,
      totalWords,
      completionRate: completionRate.toFixed(2),
      canAccess,
      previousUnitCompletion,
      completedUnits: deck.completedUnits || []
    })

    return NextResponse.json({
      isStarted: totalWords > 0,
      completedWords,
      totalWords,
      canAccess,
      metrics,
      previousUnitCompletion,
      completedUnits: deck.completedUnits || []
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
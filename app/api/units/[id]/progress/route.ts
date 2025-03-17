import { NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { logger } from '../../../../lib/logger'
import fs from 'fs'
import path from 'path'

// Require 100% of cards to have at least "Got One" (repetitions > 0)
const MIN_COMPLETION_THRESHOLD = 1.0 

// Helper function to get unit words from JSON file
async function getUnitWords(unitId: number) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', `${String(unitId).padStart(2, '0')}_words.json`);
    
    if (!fs.existsSync(filePath)) {
      logger.warning(`Unit words file not found: ${filePath}`);
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (!data || !data.words || !Array.isArray(data.words)) {
      logger.warning(`Invalid data format in unit words file: ${filePath}`);
      return null;
    }
    
    return data.words;
  } catch (error) {
    logger.error(`Error reading unit words file for unit ${unitId}`, error);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const unitId = parseInt(params.id);
    
    // Get the user ID from the request
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || 'PLACEHOLDER_USER';
    
    // Get the deck for this user
    const deck = await storage.getDeck(userId);
    
    // Debug log to check deck details
    console.log('🔍 DEBUG - Checking unit progress:', {
      userId,
      unitId,
      totalCards: deck?.cards?.length || 0,
      completedUnits: deck?.completedUnits || [],
      unit1Cards: deck?.cards?.filter(c => c.unit === 1).length || 0,
      unit1CompletedCards: deck?.cards?.filter(c => c.unit === 1 && c.repetitions > 0).length || 0,
      unit1AllCompleted: deck?.cards?.filter(c => c.unit === 1).length > 0 && 
        deck?.cards?.filter(c => c.unit === 1).every(c => c.repetitions > 0)
    });
    
    // TEMPORARY FIX: Check if all cards in Unit 1 have repetitions > 0
    // If so, force access to Unit 2
    const isUnit2 = unitId === 2;
    let forceAccessToUnit2 = false;
    
    if (isUnit2 && deck) {
      const unit1Cards = deck.cards.filter(c => c.unit === 1);
      const allUnit1CardsHaveRepetitions = unit1Cards.length > 0 && 
        unit1Cards.every(c => c.repetitions > 0);
      
      if (allUnit1CardsHaveRepetitions) {
        forceAccessToUnit2 = true;
        console.log('🔧 TEMPORARY FIX: Forcing access to Unit 2 because all Unit 1 cards have repetitions > 0');
        
        // Also add Unit 1 to completedUnits if it's not already there
        if (deck.completedUnits && !deck.completedUnits.includes(1)) {
          console.log('🔧 TEMPORARY FIX: Adding Unit 1 to completedUnits');
          
          // Update the deck in storage
          deck.completedUnits.push(1);
          
          // Save the updated deck
          try {
            await storage.saveDeck(deck);
            console.log('🔧 TEMPORARY FIX: Successfully saved updated deck with Unit 1 in completedUnits');
          } catch (error) {
            console.error('🔧 TEMPORARY FIX: Error saving updated deck', error);
          }
        }
      }
    }
    
    // Calculate the progress for this unit
    const unitWords = await getUnitWords(unitId);
    
    // If there are no words for this unit, return empty progress
    if (!unitWords || unitWords.length === 0) {
      return NextResponse.json({
        isStarted: false,
        completedWords: 0,
        totalWords: 0,
        canAccess: unitId === 1 || forceAccessToUnit2, // Allow access to Unit 1 or forced Unit 2
        metrics: {
          completionRate: 0,
          averageRepetitions: 0,
          averageEaseFactor: 0,
        },
        previousUnitCompletion: 0,
        completedUnits: deck?.completedUnits || [],
      });
    }
    
    // Get unit stats
    const unitCards = deck?.cards.filter(card => card.unit === unitId) || [];
    const completedWords = unitCards.filter(card => card.repetitions > 0).length;
    const totalWords = unitCards.length;
    const completionRate = totalWords > 0 ? completedWords / totalWords : 0;
  
    // Calculate metrics
    const metrics = {
      completionRate,
      averageRepetitions: unitCards.length > 0 ? unitCards.reduce((sum, card) => sum + card.repetitions, 0) / totalWords : 0,
      averageEaseFactor: unitCards.length > 0 ? unitCards.reduce((sum, card) => sum + card.easeFactor, 0) / totalWords : 0
    };
  
    // Check if the user can access this unit
    let accessReason = '';
    let canAccess = false;
    
    if (unitId === 1) {
      // Unit 1 is always accessible
      canAccess = true;
      accessReason = 'Unit 1 is always accessible';
    } else if (forceAccessToUnit2) {
      // TEMPORARY FIX: Force access to Unit 2
      canAccess = true;
      accessReason = 'TEMPORARY FIX: Forcing access to Unit 2';
    } else if (deck) {
      // For other units, check if the previous unit is completed
      const previousUnitId = unitId - 1;
      
      // If previous unit has no cards, it hasn't been started yet
      if (deck.cards.filter(card => card.unit === previousUnitId).length === 0) {
        accessReason = "previous_unit_not_started";
      } else {
        // Calculate completion percentage of previous unit
        const previousUnitCards = deck.cards.filter(card => card.unit === previousUnitId);
        const completedCardsInPreviousUnit = previousUnitCards.filter(card => card.repetitions > 0).length;
        const previousUnitCompletion = previousUnitCards.length > 0 
          ? completedCardsInPreviousUnit / previousUnitCards.length 
          : 0;
        
        // Check if previous unit is in completedUnits array
        const isPreviousUnitInCompletedUnits = deck.completedUnits && deck.completedUnits.includes(previousUnitId);
        
        // Debug log the previous unit completion
        console.log('🔍 DEBUG - Previous unit completion:', {
          userId,
          unitId,
          previousUnit: previousUnitId,
          totalCards: previousUnitCards.length,
          completedCards: completedCardsInPreviousUnit,
          completionPercentage: previousUnitCompletion,
          threshold: MIN_COMPLETION_THRESHOLD,
          meetsThreshold: previousUnitCompletion >= MIN_COMPLETION_THRESHOLD,
          isPreviousUnitInCompletedUnits,
          completedUnitsArray: deck?.completedUnits || [],
          cardsWithReps: previousUnitCards.map(c => ({ 
            id: (c as any).wordId || c.id, 
            repetitions: c.repetitions,
            isCompleted: c.repetitions > 0
          }))
        });
        
        // Allow access if previous unit is sufficiently completed
        if (previousUnitCompletion >= MIN_COMPLETION_THRESHOLD) {
          canAccess = true;
          accessReason = "previous_unit_completed_threshold";
        } else {
          canAccess = false;
          accessReason = "previous_unit_not_completed_threshold";
        }
        
        // If the previous unit is in the completedUnits array, always allow access
        if (deck.completedUnits && deck.completedUnits.includes(previousUnitId)) {
          canAccess = true;
          accessReason = "previous_unit_in_completed_units";
        }
      }
      
      // Additional check: only allow access to the next unit after the highest started unit
      const highestStartedUnit = Math.max(1, ...deck.cards.map(card => card.unit));
      if (unitId > highestStartedUnit + 1) {
        canAccess = false;
        accessReason = "beyond_highest_started_plus_one";
      }
    }
  
    logger.info('Unit progress calculated', {
      userId,
      unitId,
      completedWords,
      totalWords,
      completionRate: completionRate.toFixed(2),
      canAccess,
      accessReason
    });
  
    return NextResponse.json({
      isStarted: totalWords > 0,
      completedWords,
      totalWords,
      canAccess,
      metrics,
      previousUnitCompletion: canAccess ? 1.0 : 0,
      completedUnits: deck?.completedUnits || [],
      debug: {
        accessReason,
        deckHasCompletedUnits: Boolean(deck?.completedUnits && deck.completedUnits.length > 0),
        completedUnitsArray: deck?.completedUnits || [],
        unit1Status: {
          totalCards: deck?.cards?.filter(c => c.unit === 1).length || 0,
          completedCards: deck?.cards?.filter(c => c.unit === 1 && c.repetitions > 0).length || 0,
          allCompleted: deck?.cards?.filter(c => c.unit === 1).length > 0 && 
            deck?.cards?.filter(c => c.unit === 1).every(c => c.repetitions > 0)
        },
        unit2AccessDetails: unitId === 2 ? {
          canAccess,
          accessReason,
          isPreviousUnitInCompletedUnits: deck?.completedUnits?.includes(1),
          previousUnitCompletion: deck?.cards?.filter(c => c.unit === 1).length > 0 
            ? deck?.cards?.filter(c => c.unit === 1 && c.repetitions > 0).length / deck?.cards?.filter(c => c.unit === 1).length 
            : 0,
          completedUnitsArray: deck?.completedUnits || [],
          highestStartedUnit: deck?.cards?.length ? Math.max(1, ...deck.cards.map(card => card.unit)) : 1
        } : null
      }
    });
  } catch (error) {
    logger.error('Error fetching unit progress', error);
    return NextResponse.json(
      { error: 'Failed to fetch unit progress' },
      { status: 500 }
    );
  }
} 
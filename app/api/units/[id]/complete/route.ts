import { NextResponse } from 'next/server'
import { storage } from '../../../../lib/storage'
import { logger } from '../../../../lib/logger'

export async function POST(
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
    
    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }
    
    // Check if the unit is already marked as completed
    if (deck.completedUnits.includes(unitId)) {
      return NextResponse.json({
        message: `Unit ${unitId} is already marked as completed`,
        completedUnits: deck.completedUnits
      });
    }
    
    // Mark the unit as completed
    deck.completedUnits.push(unitId);
    
    // Save the updated deck
    await storage.saveDeck(deck);
    
    logger.info(`Unit ${unitId} marked as completed for user ${userId}`);
    
    return NextResponse.json({
      message: `Unit ${unitId} marked as completed`,
      completedUnits: deck.completedUnits
    });
  } catch (error) {
    logger.error('Error marking unit as completed', error);
    return NextResponse.json(
      { error: 'Failed to mark unit as completed' },
      { status: 500 }
    );
  }
} 
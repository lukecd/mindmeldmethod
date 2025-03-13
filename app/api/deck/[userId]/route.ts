import { NextResponse } from 'next/server'
import { storage } from '../../../lib/storage'
import { logger } from '../../../lib/logger'

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const deck = await storage.getDeck(userId)
    
    if (!deck) {
      logger.warning('Deck not found', { userId })
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    logger.info('Deck retrieved successfully', { userId })
    return NextResponse.json(deck)
  } catch (error) {
    const { userId } = await context.params
    logger.error('Error retrieving deck', error, { userId })
    return NextResponse.json(
      { error: 'Failed to retrieve deck' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const body = await request.json()

    if (body.userId !== userId) {
      logger.warning('User ID mismatch in deck creation', { 
        pathUserId: userId,
        bodyUserId: body.userId 
      })
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 400 }
      )
    }

    const deck = await storage.createDeck(body)
    logger.info('Deck created successfully', { userId })
    return NextResponse.json(deck)
  } catch (error) {
    const { userId } = await context.params
    logger.error('Error creating deck', error, { userId })
    return NextResponse.json(
      { error: 'Failed to create deck' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const body = await request.json()
    const deck = await storage.getDeck(userId)

    if (!deck) {
      logger.warning('Deck not found for update', { userId })
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Update only the cards array
    const updatedDeck = await storage.saveDeck({
      ...deck,
      cards: body.cards || deck.cards,
      lastSyncedAt: Date.now()
    })

    logger.info('Deck updated successfully', { userId })
    return NextResponse.json(updatedDeck)
  } catch (error) {
    const { userId } = await context.params
    logger.error('Error updating deck', error, { userId })
    return NextResponse.json(
      { error: 'Failed to update deck' },
      { status: 500 }
    )
  }
}
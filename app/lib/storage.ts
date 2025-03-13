import { logger } from './logger'
import fs from 'fs'
import path from 'path'

interface Card {
  id: string
  unit: number
  repetitions: number
  easeFactor: number
  interval: number
  nextReview: number
  lastReview?: number
}

interface Deck {
  userId: string
  cards: Card[]
  lastSyncedAt: number
  xp: number
  completedUnits: number[]
}

// Temporary server-side storage
const serverStorage = new Map<string, Deck>()

// Request deduplication
const pendingRequests = new Map<string, Promise<Deck | null>>()

class StorageService {
  private getStorageKey(userId: string): string {
    return `deck-${userId}`
  }

  private validateDeck(deck: any): deck is Deck {
    if (!deck || typeof deck !== 'object') return false
    if (typeof deck.userId !== 'string') return false
    if (!Array.isArray(deck.cards)) return false
    if (typeof deck.lastSyncedAt !== 'number') return false

    return deck.cards.every((card: any) => this.validateCard(card))
  }

  private validateCard(card: any): boolean {
    if (!card || typeof card !== 'object') return false
    if (typeof card.id !== 'string') return false
    if (typeof card.unit !== 'number') return false
    if (typeof card.repetitions !== 'number') return false
    if (typeof card.easeFactor !== 'number') return false
    if (typeof card.interval !== 'number') return false
    if (typeof card.nextReview !== 'number') return false
    return true
  }

  private async loadWordsFromJson(unit: number): Promise<{ id: string; unit: number }[]> {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', `${String(unit).padStart(2, '0')}_words.json`)
      const fileContent = await fs.promises.readFile(filePath, 'utf-8')
      const data = JSON.parse(fileContent)
      return data.words.map((word: any) => ({ id: word.id, unit: word.unit }))
    } catch (error) {
      logger.error(`Failed to load words for unit ${unit}`, error)
      return []
    }
  }

  private async loadAllWords(): Promise<{ id: string; unit: number }[]> {
    const units = Array.from({ length: 10 }, (_, i) => i + 1)
    const wordsPromises = units.map(unit => this.loadWordsFromJson(unit))
    const wordsArrays = await Promise.all(wordsPromises)
    return wordsArrays.flat()
  }

  private async getDeckFromStorage(userId: string): Promise<Deck | null> {
    // Check if there's a pending request
    const pendingRequest = pendingRequests.get(userId)
    if (pendingRequest) {
      logger.info('Using pending request for deck', { userId })
      return pendingRequest
    }

    const promise = (async () => {
      if (typeof window === 'undefined') {
        // Server-side: Use temporary Map storage
        const deck = serverStorage.get(userId)
        if (deck) {
          logger.info('Retrieved server-side deck', { userId })
          return deck
        }
        return null
      }

      const key = this.getStorageKey(userId)
      const saved = localStorage.getItem(key)
      
      if (!saved) {
        return null
      }

      try {
        const deck = JSON.parse(saved)
        if (!this.validateDeck(deck)) {
          logger.error('Invalid deck format in storage', new Error('Invalid deck format'), { userId })
          return null
        }

        logger.info('Successfully loaded deck', {
          userId,
          cardCount: deck.cards.length,
          lastSync: new Date(deck.lastSyncedAt).toISOString()
        })
        return deck
      } catch (error) {
        logger.error('Failed to parse deck from storage', error, { userId })
        return null
      }
    })()

    // Store the promise and clean it up when resolved
    pendingRequests.set(userId, promise)
    promise.finally(() => {
      pendingRequests.delete(userId)
    })

    return promise
  }

  async getDeck(userId: string): Promise<Deck | null> {
    const deck = await this.getDeckFromStorage(userId)
    if (deck) {
      console.log('📚 Storage.getDeck - Found existing deck:', {
        userId,
        xp: deck.xp,
        cards: deck.cards.length
      })
      return deck
    }

    logger.info('No existing deck found, creating new deck', { userId })
    return this.createDeck(userId)
  }

  async createDeck(userId: string): Promise<Deck> {
    // Check if deck already exists
    const existingDeck = await this.getDeckFromStorage(userId)
    if (existingDeck) {
      logger.info('Using existing deck instead of creating new one', { userId })
      console.log('📚 Storage.createDeck - Using existing deck:', {
        userId,
        xp: existingDeck.xp,
        cards: existingDeck.cards.length
      })
      return existingDeck
    }

    // Create empty deck
    const deck: Deck = {
      userId,
      cards: [],
      lastSyncedAt: Date.now(),
      xp: 0,
      completedUnits: []
    }

    if (typeof window === 'undefined') {
      // Server-side: Store in Map
      serverStorage.set(userId, deck)
      logger.success('Created new server-side deck', { userId })
    } else {
      const key = this.getStorageKey(userId)
      localStorage.setItem(key, JSON.stringify(deck))
      logger.success('Created new client-side deck', { userId })
    }

    console.log('📚 Storage.createDeck - Created new deck:', {
      userId,
      xp: deck.xp,
      cards: deck.cards.length
    })
    return deck
  }

  async saveDeck(deck: Deck): Promise<Deck> {
    if (!this.validateDeck(deck)) {
      throw new Error('Invalid deck format')
    }

    const updatedDeck = {
      ...deck,
      lastSyncedAt: Date.now()
    }

    if (typeof window === 'undefined') {
      // Server-side: Store in Map
      serverStorage.set(deck.userId, updatedDeck)
      logger.success('Saved server-side deck', {
        userId: deck.userId,
        cardCount: deck.cards.length,
        completedCards: deck.cards.filter(c => c.repetitions > 0).length
      })
    } else {
      const key = this.getStorageKey(deck.userId)
      localStorage.setItem(key, JSON.stringify(updatedDeck))
      logger.success('Saved client-side deck', {
        userId: deck.userId,
        cardCount: deck.cards.length,
        completedCards: deck.cards.filter(c => c.repetitions > 0).length
      })
    }

    return updatedDeck
  }

  getDeckStats(deck: Deck) {
    const stats = {
      totalCards: deck.cards.length,
      completedCards: 0,
      unitProgress: new Map<number, { total: number; completed: number }>()
    }

    for (const card of deck.cards) {
      const unitStats = stats.unitProgress.get(card.unit) || { total: 0, completed: 0 }
      unitStats.total++
      if (card.repetitions > 0) {
        unitStats.completed++
        stats.completedCards++
      }
      stats.unitProgress.set(card.unit, unitStats)
    }

    return stats
  }
}

export const storage = new StorageService() 
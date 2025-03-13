export interface UserDeck {
  userId: string // 0x wallet address
  cards: UserCard[]
  lastSyncedAt: number
  xp: number
  completedUnits: number[]  // Track which units have been completed for XP rewards
}

export interface UserCard {
  wordId: string
  addedAt: number
  unit: number
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: number
  lastReview: number
}

export interface DeckStats {
  totalCards: number
  cardsPerUnit: Record<number, number>
  totalReviews: number
  masteredCards: number
  totalXP: number
} 
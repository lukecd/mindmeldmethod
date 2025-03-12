import { notFound } from 'next/navigation'
import UnitContent from './UnitContent'

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

export default async function UnitPage({ params }: PageProps) {
  const { id: unitId } = await params
  const unitTitle = UNIT_TITLES[unitId as keyof typeof UNIT_TITLES]
  
  // Validate unit ID
  if (!unitTitle || isNaN(Number(unitId)) || Number(unitId) < 1 || Number(unitId) > 10) {
    notFound()
  }

  return <UnitContent unitId={unitId} unitTitle={unitTitle} />
} 
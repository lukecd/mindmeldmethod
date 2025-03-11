import { Orbitron, Inter } from 'next/font/google'

export const scifiFont = Orbitron({
  subsets: ['latin'],
  variable: '--font-scifi',
  display: 'swap',
})

export const defaultFont = Inter({
  subsets: ['latin'],
  variable: '--font-default',
  display: 'swap',
}) 
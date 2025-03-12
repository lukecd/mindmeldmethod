import { Inter, Spicy_Rice } from 'next/font/google'

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const titleFont = Spicy_Rice({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-title',
  display: 'swap',
}) 
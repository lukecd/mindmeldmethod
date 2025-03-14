'use client'

import { Menu, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import AuthButton from './AuthButton'
import { useAddress } from '@chopinframework/react'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { address } = useAddress()
  const { deck, forceUpdate } = useSpacedRepetition(address)
  const [xp, setXp] = useState<number | undefined>(undefined)

  // Update XP state when deck changes or forceUpdate changes
  useEffect(() => {
    if (deck?.xp !== undefined) {
      console.log('🔄 Navbar updating XP from deck:', deck.xp)
      setXp(deck.xp)
    }
  }, [deck?.xp, forceUpdate])

  // Listen for custom xp-updated event
  useEffect(() => {
    const handleXpUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ xp: number }>;
      console.log('🔄 Navbar received xp-updated event:', customEvent.detail.xp);
      setXp(customEvent.detail.xp);
    };

    window.addEventListener('xp-updated', handleXpUpdated);
    return () => window.removeEventListener('xp-updated', handleXpUpdated);
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Spanish Basics', href: '/basics' },
    { name: 'Crypto Podcasts', href: '/crypto-podcasts' },
    { name: 'Challenges', href: '/challenges' },
    { name: 'Your Words', href: '/your-words' },
    { name: 'About', href: '/about' },
  ]

  const handleReset = () => {
    // Clear all localStorage items
    console.log('🗑️ Clearing all application data from localStorage')
    
    // First, log what we're about to clear
    const itemsToClear = Object.keys(localStorage)
    console.log(`Found ${itemsToClear.length} items in localStorage:`, itemsToClear)
    
    // Clear all localStorage items
    localStorage.clear()
    
    // Clear any session storage as well
    sessionStorage.clear()
    
    // Clear any cookies (optional, may affect auth)
    // document.cookie.split(";").forEach(cookie => {
    //   const [name] = cookie.trim().split("=")
    //   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    // })
    
    console.log('🗑️ All application data cleared from browser storage')
    
    // Reload the page to reset all state
    window.location.reload()
  }

  return (
    <nav className="p-4 fixed w-full top-0 z-50 bg-[color:var(--color-bg-nav)] text-[color:var(--color-text-inverse)]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Hamburger Menu and XP */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[color:var(--color-text-inverse)] p-2 hover:opacity-80 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          {address && xp !== undefined && (
            <div className="text-2xl text-[color:var(--color-text-inverse)] font-title">
              XP: {xp}
            </div>
          )}
        </div>

        {/* Title */}
        <Link 
          href="/" 
          className="text-3xl md:text-4xl text-[color:var(--color-text-inverse)] text-center absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity font-title"
        >
          Mind Meld Method
        </Link>

        {/* Auth Button */}
        <div className="hidden md:block">
          <AuthButton />
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu absolute top-full left-0 w-64 bg-[color:var(--color-bg-nav)] border-t border-[color:var(--color-border-light)] shadow-lg z-50">
            <div className="py-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-[color:var(--color-text-inverse)] hover:opacity-80 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Dev Reset Option */}
              <button
                onClick={() => {
                  if (confirm('⚠️ DEVELOPER RESET: This will clear ALL application data and reset your progress. This cannot be undone. Continue?')) {
                    handleReset()
                  }
                }}
                className="block w-full text-left px-4 py-2 text-red-500 hover:opacity-80 transition-colors border-t border-[color:var(--color-border-light)]"
              >
                🧪 Developer Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 
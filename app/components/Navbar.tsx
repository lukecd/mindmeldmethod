'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Spanish Basics', href: '/basics' },
    { name: 'Crypto Podcasts', href: '/crypto-podcasts' },
    { name: 'Challenges', href: '/challenges' },
    { name: 'Your Words', href: '/your-words' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav className="p-4 fixed w-full top-0 z-50 bg-[color:var(--color-bg-nav)] text-[color:var(--color-text-inverse)]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[color:var(--color-text-inverse)] p-2 hover:opacity-80 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Title */}
        <Link 
          href="/" 
          className="text-3xl md:text-4xl text-[color:var(--color-text-inverse)] text-center absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity font-title"
        >
          Mind Meld Method
        </Link>

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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 
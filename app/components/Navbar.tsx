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
  ]

  return (
    <nav className="p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 hover:opacity-80 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Title */}
        <Link href="/" className="text-3xl md:text-4xl text-white text-center absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity font-scifi">
          Mind Meld Method
        </Link>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu absolute top-full left-0 w-64 border-t border-white/10 shadow-lg bg-[#2D1B36] font-normal">
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-white hover:opacity-80 transition-colors"
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
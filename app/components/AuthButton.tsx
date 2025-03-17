'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import { useAddress } from "@chopinframework/react"
import LoadingSpinner from './LoadingSpinner'
import { useState } from 'react'

export default function AuthButton() {
  const { address, isLoading: hookLoading, isLoginError, login: _login, logout: _logout } = useAddress()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/_chopin/login')
      const data = await res.json()
      if (data.success) {
        // Force a revalidation of the address
        window.location.reload()
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await _logout()
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (hookLoading || isLoading) {
    return (
      <div className="bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] px-4 py-2 flex items-center gap-2">
        <div className="w-5 h-5">
          <LoadingSpinner />
        </div>
        <span>Loading</span>
      </div>
    )
  }

  if (isLoginError) {
    return <div className="text-red-500">Error logging in</div>
  }

  if (address) {
    return (
      <Tooltip.Provider>
        <div className="flex items-center gap-2">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] px-4 py-2 hover:bg-[color:var(--color-button-hover)] transition-colors">
                {address.slice(0, 3)}...{address.slice(-3)}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-[color:var(--color-bg-nav)] text-[color:var(--color-text-inverse)] px-4 py-2 select-all"
                sideOffset={5}
              >
                {address}
                <Tooltip.Arrow className="fill-[color:var(--color-bg-nav)]" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <button 
            onClick={handleLogout}
            className="bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] px-4 py-2 hover:bg-[color:var(--color-button-hover)] transition-colors"
          >
            Logout
          </button>
        </div>
      </Tooltip.Provider>
    )
  }

  return (
    <button 
      onClick={login}
      className="bg-[color:var(--color-button-primary)] text-[color:var(--color-text-inverse)] px-4 py-2 hover:bg-[color:var(--color-button-hover)] transition-colors"
    >
      Login
    </button>
  )
} 
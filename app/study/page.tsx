import React from 'react'
import Navbar from '../components/Navbar'

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)] text-[color:var(--color-text-main)]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-title mb-6">Study</h1>
        <p>Study page content will go here.</p>
      </main>
    </div>
  )
} 
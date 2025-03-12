'use client'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative inline-flex">
        {/* First dot - Yellow */}
        <div className="absolute w-4 h-4 bg-[color:var(--color-accent-secondary)] rounded-full animate-[spinner-dot1_2s_infinite]"></div>
        {/* Second dot - Green */}
        <div className="absolute w-4 h-4 bg-[color:var(--color-accent-primary)] rounded-full animate-[spinner-dot2_2s_infinite]"></div>
        {/* Third dot - Orange */}
        <div className="absolute w-4 h-4 bg-[color:var(--color-button-primary)] rounded-full animate-[spinner-dot3_2s_infinite]"></div>
      </div>
    </div>
  )
} 
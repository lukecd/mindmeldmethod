import HeroSection from './components/HeroSection'
import ForkSection from './components/ForkSection'
import VisualCuesSection from './components/VisualCuesSection'
import CTASection from './components/CTASection'

export default function Home() {
  return (
    <main className="min-h-screen bg-[color:var(--color-bg-main)]">
      <HeroSection />
      <ForkSection />
      <VisualCuesSection />
      <CTASection />
    </main>
  )
}

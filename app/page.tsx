import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ForkSection from './components/ForkSection'
import VisualCuesSection from './components/VisualCuesSection'
import CTASection from './components/CTASection'

export default function Home() {
  return (
    <main className="min-h-screen bg-mindmeld-navy">
      <Navbar />
      <HeroSection />
      <ForkSection />
      <VisualCuesSection />
      <CTASection />
    </main>
  )
}

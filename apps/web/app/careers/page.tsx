import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CareerSection from '@/components/CareerSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Career Training & Programmes — DocMe Academy',
  description:
    'Industry-oriented training for a brighter future. Learn. Build. Lead. Full-Stack Development, QA, IT Operations, and Advanced Software Engineering.',
}

export default function CareersPage() {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navigation />
      <CareerSection />
      <Footer />
    </main>
  )
}

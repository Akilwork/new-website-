import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CourseDetailView from '@/components/CourseDetailView'
import { programmesData, getProgrammeBySlug } from '@/lib/programmesData'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return programmesData.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const programme = getProgrammeBySlug(slug)

  if (!programme) {
    return {
      title: 'Programme Not Found — DocMe Academy',
    }
  }

  return {
    title: `${programme.title} (${programme.levelBadge}) — DocMe Academy`,
    description: programme.summary,
  }
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params
  const programme = getProgrammeBySlug(slug)

  if (!programme) {
    notFound()
  }

  return (
    <main className="relative min-h-screen bg-[#070709] text-white selection:bg-white selection:text-black">
      <Navigation />
      <CourseDetailView programme={programme} />
      <Footer />
    </main>
  )
}


'use client'

import React from 'react'
import { useSections } from '@/lib/useSections'

const defaultStats = [
  { value: '700+', label: 'Projects launched successfully across the globe' },
  { value: '10M', label: 'Daily customer engagement through our projects' },
  { value: '100+', label: 'Digital transformation stories that made a difference' },
]

export default function ImpactSection() {
  const { getSection } = useSections()
  const sec = getSection('impact') || getSection('sec-home-impact')

  if (sec?.status === 'Draft') return null

  const heading = sec?.heading || 'Our Impact'
  const description =
    sec?.description ||
    'Docme empowers organizations with innovative digital solutions that simplify operations, enhance efficiency, and drive sustainable growth. We help businesses and institutions achieve smarter outcomes through technology-driven innovation.'
  const stats = sec?.stats && sec.stats.length > 0 ? sec.stats : defaultStats

  return (
    <section className="section-spacing bg-white flex flex-col items-center justify-center">
      <div className="site-container text-center">
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-900 mb-6 sm:mb-8 tracking-tight">
          {heading}
        </h2>
        
        <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-12 sm:mb-16 md:mb-24 font-light">
          {description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-light text-slate-800 tracking-tight leading-none">
                {stat.value}
              </h3>
              <p className="text-slate-500 text-sm max-w-[220px] mx-auto leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}


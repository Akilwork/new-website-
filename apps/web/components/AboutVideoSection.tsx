'use client'

import React from 'react'
import { useSections } from '@/lib/useSections'

export default function AboutVideoSection() {
  const { getSection } = useSections()
  const sec =
    getSection('about_video', 'about') ||
    getSection('sec-about-video', 'about') ||
    getSection('about_video')

  if (sec?.status === 'Draft') return null
  // If explicitly deleted in CMS, hide section
  if (sec && sec.image === '') return null

  const videoSrc = sec?.image || '/VID-20260823-WA0002.mp4'

  return (
    <section className="relative w-full h-[70vh] sm:h-[85vh] lg:h-[100vh] bg-slate-900 overflow-hidden">
      <div className="w-full h-full bg-black flex items-center justify-center relative">
        {/* Subtle overlay for better visual quality */}
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}

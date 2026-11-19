'use client'

import React from 'react'
import { useSections } from '@/lib/useSections'

export default function OurStorySection() {
  const { getSection } = useSections()
  const sec = getSection('our_story') || getSection('sec-home-story')

  if (sec?.status === 'Draft') return null

  const heading = sec?.heading || 'Our Story'
  const description =
    sec?.description ||
    'Docme is a modern digital solutions platform focused on transforming institutional and organizational management through innovative technology, connected ecosystems, and user-centered experiences. We help streamline administration, academics, operations, communication, finance, transport, HR, and analytics into one seamless platform, enabling institutions to improve efficiency, enhance collaboration, and achieve smarter digital growth with scalable and future-ready solutions.'
  const isVideoDeleted = sec ? sec.image === '' : false
  const videoSrc = isVideoDeleted ? '' : (sec?.image || '/assets/Our Story/teamcarbon006_pindown.io_1779772021.mp4')
  const ctaLabel = sec?.cta?.label || 'About us →'
  const ctaUrl = sec?.cta?.url || '/about'

  return (
    <section className="section-spacing relative overflow-hidden bg-black">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

          {/* ── Left: Text ── */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-cyan-400/70 mb-5">
              Who We Are
            </p>
            <h2
              className="font-bold leading-none text-white letter-spacing-[-0.02em] mb-7"
              style={{ fontSize: 'clamp(36px, 5vw, 80px)', letterSpacing: '-0.02em' }}
            >
              {heading}
            </h2>
            <p className="text-base leading-[1.75] text-white/65 mb-10 max-w-xl">
              {description}
            </p>
            <a
              href={ctaUrl}
              className="inline-flex items-center gap-2 px-7 py-3 border border-white/35 rounded-md text-white text-[15px] font-medium no-underline transition-all duration-250 hover:bg-white/7 hover:border-white/60"
            >
              {ctaLabel}
            </a>
          </div>

          {/* ── Right: Blended video ── */}
          <div className="flex-shrink-0 w-full lg:w-auto flex items-center justify-center mt-4 lg:mt-0">
            <div
              className="relative mx-auto"
              style={{ width: 'clamp(220px, 70vw, 420px)', aspectRatio: '1 / 1' }}
            >
              {videoSrc ? (
                <video
                  key={videoSrc}
                  className="w-full h-full object-cover block rounded-full select-none pointer-events-none"
                  style={{ mixBlendMode: 'screen' }}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 border border-white/10 flex items-center justify-center p-8 shadow-2xl">
                  <div className="text-center">
                    <span className="text-3xl font-bold tracking-tight text-white block">DocMe</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 mt-1 block">Institutional Systems</span>
                  </div>
                </div>
              )}

              {/* Stats badge */}
              <div className="absolute bottom-[10%] right-[2%] sm:right-[-2%] flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[10px] z-10"
                style={{
                  background: 'rgba(10, 10, 20, 0.82)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                <span className="text-[22px] font-bold text-white leading-none">100+</span>
                <span className="text-[11px] leading-[1.4] text-white/55 font-medium">
                  Brand<br />Connections
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

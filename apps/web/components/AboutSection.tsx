'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useSections } from '@/lib/useSections'

export default function AboutSection() {
  const { getSection } = useSections()
  const sec =
    getSection('about_intro', 'about') ||
    getSection('sec-about-intro', 'about') ||
    getSection('about_intro')

  if (sec?.status === 'Draft') return null

  const heading = sec?.heading || 'Pioneering the Future\nof Digital Ecosystems'
  const description =
    sec?.description ||
    'At Docme, we are dedicated to revolutionizing how institutions and enterprises operate. By uniting academics, administration, and operations into one seamless intelligent platform, we empower organizations to streamline their workflows, enhance collaboration, and drive scalable growth. Our mission is to build future-ready solutions that simplify complexity and elevate the digital experience.'
  const image =
    sec?.image ||
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
  const badgeText = sec?.badgeText || '* Docme * Docme * Docme *'
  const badgeColor = sec?.badgeColor || '#F1BE48'
  const badgeLink = sec?.cta?.url || '#about'

  // Format heading with line breaks if \n or multiple lines
  const renderHeading = () => {
    if (heading.includes('\n')) {
      const parts = heading.split('\n')
      return parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {part}
          {idx < parts.length - 1 && <br />}
        </React.Fragment>
      ))
    }
    return heading
  }

  return (
    <section id="about" className="py-24 bg-white text-slate-900 relative overflow-hidden">
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 max-w-xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-slate-900 tracking-tight">
              {renderHeading()}
            </h2>
            
            <p className="text-slate-600 text-lg leading-relaxed pt-2">
              {description}
            </p>
          </div>

          {/* Right Content - Image and Badge */}
          <div className="relative mt-12 lg:mt-0">
            <div className="relative h-[360px] sm:h-[450px] lg:h-[550px] xl:h-[650px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img
                src={image}
                alt="Team collaborating"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Circular Badge */}
            <div className="absolute -left-4 sm:-left-6 -bottom-4 sm:-bottom-6 md:-left-16 md:-bottom-12 w-28 sm:w-36 md:w-44 lg:w-56 h-28 sm:h-36 md:h-44 lg:h-56 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-50">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Rotating Text SVG */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]">
                  <path id="circlePath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
                  <text className="text-[10px] font-bold uppercase tracking-[0.25em] fill-slate-800">
                    <textPath href="#circlePath" startOffset="0%" textLength="213">
                      {badgeText}
                    </textPath>
                  </text>
                </svg>
                
                {/* Center Button */}
                <a
                  href={badgeLink}
                  style={{ backgroundColor: badgeColor }}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-slate-900 z-10 transition-transform duration-300 hover:scale-110 cursor-pointer shadow-md"
                  aria-label="Discover Docme"
                >
                  <ArrowUpRight className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5]" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

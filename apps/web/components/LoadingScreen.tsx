'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface LoadingScreenProps {
  onLoadingComplete?: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const logoWrapperRef = useRef<HTMLDivElement>(null)
  const frontWaveRef = useRef<SVGPathElement>(null)
  const backWaveRef = useRef<SVGPathElement>(null)
  const counterTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Canvas dimensions for the vector logo viewBox
    const svgWidth = 648
    const svgHeight = 200

    // Smooth sinusoidal wave path builder
    const buildWavePath = (
      waterY: number,
      amplitude: number,
      wavelength: number,
      phase: number
    ): string => {
      const startY = waterY + amplitude * Math.sin(phase)
      let d = `M 0 ${svgHeight + 30} L 0 ${startY.toFixed(2)}`

      const steps = 40
      const dx = svgWidth / steps

      for (let i = 1; i <= steps; i++) {
        const x = i * dx
        const y = waterY + amplitude * Math.sin((x / wavelength) * 2 * Math.PI + phase)
        d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
      }

      d += ` L ${svgWidth} ${svgHeight + 30} Z`
      return d
    }

    const waveState = {
      progress: 0,
    }

    let time = 0

    // Ticker function to drive organic wave motion
    const onTick = (_: number, deltaTime: number) => {
      time += Math.min(deltaTime, 33) * 0.001

      // As progress goes from 0 -> 100:
      // waterY travels from 225 (fully below logo) to -25 (fully above logo)
      const waterY = 225 - (waveState.progress / 100) * 250

      // Wave dampens gently as it reaches top (100%) for a perfectly filled reveal
      const damp = 1 - Math.max(0, (waveState.progress - 85) / 15) * 0.4
      const ampFront = 13 * damp
      const ampBack = 11 * damp

      const pathFront = buildWavePath(waterY, ampFront, 290, time * 3.8)
      const pathBack = buildWavePath(waterY + 7, ampBack, 240, -time * 2.8 + 1.2)

      if (frontWaveRef.current) {
        frontWaveRef.current.setAttribute('d', pathFront)
      }
      if (backWaveRef.current) {
        backWaveRef.current.setAttribute('d', pathBack)
      }

      if (counterTextRef.current) {
        const p = Math.min(100, Math.max(0, Math.round(waveState.progress)))
        counterTextRef.current.innerText = `loading... ${p} %`
      }
    }

    gsap.ticker.add(onTick)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.ticker.remove(onTick)
          setIsVisible(false)
          if (onLoadingComplete) {
            onLoadingComplete()
          }
        },
      })

      // STAGE 1: Sea wave rises cleanly to the top (0% to 100%)
      tl.to(waveState, {
        progress: 100,
        duration: 3.0,
        ease: 'power1.inOut',
      })

      // STAGE 2: Wave reaches top -> full complete show (clean, NO blue blink/light)
      // Brief clean hold at 100% full
      tl.to({}, { duration: 0.4 })

      // STAGE 3: Full zoom out (logo scales down all the way to 0)
      tl.to(counterTextRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })

      tl.to(
        logoWrapperRef.current,
        {
          scale: 0,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.in',
        },
        '-=0.2'
      )

      // Seamless curtain fade to website
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
        },
        '-=0.3'
      )
    }, containerRef)

    return () => {
      gsap.ticker.remove(onTick)
      ctx.revert()
    }
  }, [onLoadingComplete])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070913] text-white overflow-hidden select-none pointer-events-auto"
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Center Logo & Sea Wave Container */}
      <div
        ref={logoWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-[760px] lg:max-w-[840px] px-6 origin-center transform-gpu"
      >
        <svg
          viewBox="0 0 648 200"
          className="w-full h-auto max-h-[40vh] overflow-visible select-none pointer-events-none"
        >
          <defs>
            {/* Primary Front Wave Clip Path */}
            <clipPath id="docme-wave-clip-front">
              <path ref={frontWaveRef} d="M 0 220 L 648 220 Z" />
            </clipPath>

            {/* Secondary Back Wave Clip Path (translucent crest for depth) */}
            <clipPath id="docme-wave-clip-back">
              <path ref={backWaveRef} d="M 0 220 L 648 220 Z" />
            </clipPath>
          </defs>

          {/* 1) Base Layer: Dark Unfilled Logo (matching reference image base) */}
          <image
            href="/Docme Logo 1.png"
            width="648"
            height="200"
            opacity="0.18"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* 2) Secondary Back Wave Layer (semi-transparent crest for organic sea depth) */}
          <g clipPath="url(#docme-wave-clip-back)">
            <image
              href="/Docme Logo 1.png"
              width="648"
              height="200"
              opacity="0.45"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* 3) Primary Front Wave Layer: Pure bright white liquid fill */}
          <g clipPath="url(#docme-wave-clip-front)">
            <image
              href="/Docme Logo 1.png"
              width="648"
              height="200"
              opacity="1"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </svg>

        {/* Counter at bottom right matching reference image ("loading... 43 %") */}
        <div className="w-full flex justify-end mt-4 pr-1 sm:pr-2">
          <span
            ref={counterTextRef}
            className="text-xs sm:text-sm font-sans tracking-wide text-slate-200/90 font-normal select-none"
          >
            loading... 0 %
          </span>
        </div>
      </div>
    </div>
  )
}
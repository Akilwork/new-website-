'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

const showcaseSlides = [
  {
    title: 'One Platform to Streamline\nAll DocMe Experiences',
    subtitle:
      'Your healthcare content and publishing workflows unified in one intelligent system. Scale your digital impact with DocMe CMS.',
  },
  {
    title: 'Real-Time Medical Content\n& Clinical Media',
    subtitle:
      'Curate doctors, department directories, medical articles, and interactive assets with live synchronized previews.',
  },
  {
    title: 'Enterprise Governance\n& Role-Based Security',
    subtitle:
      'Granular team permissions and audit-ready workflows engineered for healthcare institutions and administrators.',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto-advance showcase slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcaseSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfoMessage('')

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (res.ok) {
        router.push('/dashboard')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || 'Invalid credentials. Please verify your email and password.')
      }
    } catch {
      // Graceful local development preview navigation
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-3 sm:p-5 lg:p-7 py-6 sm:py-8">
      {/* Outer Card Container with rounded corners matching reference design */}
      <div className="w-full max-w-[1340px] bg-[#0c0f17] rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-white/5 flex flex-col lg:flex-row lg:h-[92vh] lg:min-h-[720px] lg:max-h-[920px]">
        
        {/* ================= LEFT SHOWCASE PANEL (Dark theme with warm amber glow) ================= */}
        <div className="relative lg:w-1/2 bg-[#090b11] p-6 sm:p-10 lg:p-16 flex flex-col justify-between overflow-hidden shrink-0">
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute -top-16 -right-16 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full pointer-events-none opacity-40 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.42) 0%, rgba(234, 88, 12, 0.18) 40%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-60 sm:w-80 h-60 sm:h-80 rounded-full pointer-events-none opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
            }}
          />

          {/* Top spacer */}
          <div className="hidden lg:block h-6" />

          {/* Center Content: Logo, Headline & Subtitle */}
          <div className="relative z-10 my-auto py-4 sm:py-8 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-5 sm:mb-9 flex items-center justify-center">
              <img
                src="/Docme Logo 1.png"
                alt="DocMe Logo"
                className="h-8 sm:h-11 md:h-12 w-auto object-contain drop-shadow-md"
              />
            </div>

            {/* Headline with pre-line wrap */}
            <h2 className="text-xl sm:text-2xl lg:text-[34px] xl:text-[36px] font-bold text-white tracking-tight leading-[1.25] max-w-md whitespace-pre-line transition-all duration-500">
              {showcaseSlides[activeSlide].title}
            </h2>

            {/* Subtitle */}
            <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed transition-all duration-500">
              {showcaseSlides[activeSlide].subtitle}
            </p>
          </div>

          {/* Bottom Pagination Dots */}
          <div className="relative z-10 flex items-center justify-center gap-2 pt-2 pb-2 lg:pb-0">
            {showcaseSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= RIGHT AUTHENTICATION PANEL (Clean White Design) ================= */}
        <div className="lg:w-1/2 bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between text-slate-900 rounded-b-[24px] lg:rounded-b-none lg:rounded-r-[36px] overflow-y-auto">
          
          {/* Top Header Bar inside Right Panel */}
          <div className="flex items-center justify-between gap-2 pb-4">
            {/* Top-Left Brand Logo */}
            <div className="flex items-center">
              <img
                src="/Frame 160.png"
                alt="DocMe Logo"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>

            {/* Top-Right 'Don't have an account? Sign Up' */}
            <div className="text-xs sm:text-sm text-slate-600">
              <span className="hidden xs:inline">Don&apos;t have an account? </span>
              <a
                href="#signup"
                onClick={(e) => {
                  e.preventDefault()
                  setInfoMessage('Account creation is managed by your DocMe administrator.')
                }}
                className="font-semibold text-slate-900 underline underline-offset-2 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Center Form Section */}
          <div className="max-w-[420px] w-full mx-auto my-auto py-4 sm:py-6">
            <div className="text-center mb-6 sm:mb-7">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back to DocMe!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2">
                Please enter your details to sign in your account
              </p>
            </div>

            {/* Status alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
            {infoMessage && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@mail.com"
                  required
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="minimum 8 character"
                    required
                    className="w-full pl-3.5 sm:pl-4 pr-11 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button in rich warm amber-orange gradient */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 sm:py-3.5 px-4 rounded-xl text-white font-semibold text-sm shadow-md shadow-amber-500/25 bg-gradient-to-r from-[#f59e0b] via-[#f7a01d] to-[#ea580c] hover:opacity-95 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{loading ? 'Signing in...' : 'Sign In \u2192'}</span>
              </button>

              {/* Forgot password */}
              <div className="text-center pt-1.5">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    setInfoMessage('Contact your system administrator to reset your credentials.')
                  }}
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
            </form>
          </div>

          {/* Bottom Footer inside Right Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-100 text-xs text-slate-500">
            <div>
              <span>&copy; {new Date().getFullYear()} DocMe</span>
            </div>
            <div className="flex items-center gap-5 sm:gap-6">
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault()
                  setInfoMessage('DocMe Privacy Policy: All medical and system data is encrypted.')
                }}
                className="hover:text-slate-800 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#support"
                onClick={(e) => {
                  e.preventDefault()
                  setInfoMessage('Need assistance? Email support@docme.com')
                }}
                className="hover:text-slate-800 transition-colors cursor-pointer"
              >
                Support
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

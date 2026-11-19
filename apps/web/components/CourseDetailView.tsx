'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Sparkles,
  BookOpen,
  Laptop,
  Award,
  Users,
  Briefcase,
  Terminal,
  ShieldCheck,
  Clock,
  Calendar,
  Send,
  X,
  Phone,
  Mail,
  Code2,
} from 'lucide-react'
import { ProgrammeItem } from '@/lib/programmesData'

interface CourseDetailViewProps {
  programme: ProgrammeItem
}

export default function CourseDetailView({ programme }: CourseDetailViewProps) {
  const [activeModule, setActiveModule] = useState<number>(0)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    experienceLevel: 'Student / College Fresher',
    preferredTiming: 'Weekend Batch (Sat & Sun)',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
    }, 800)
  }

  const isLevel1 = programme.id === 'level-1'

  return (
    <div className="relative w-full min-h-screen bg-[#070709] text-white">
      {/* ───────────────────────────────────────────────────────────────────────
          HERO BANNER
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/[0.07] rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.08] rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_70%,transparent_100%)]" />
        </div>

        <div className="site-container relative z-10">
          {/* Back breadcrumb */}
          <Link
            href="/careers#programmes"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Programmes</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider">
                  # {programme.levelBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Cohort Enrollment Open
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-jakarta leading-[1.1]">
                {programme.title}
              </h1>

              <p className="text-base sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl">
                {programme.summary}
              </p>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{programme.duration}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>{programme.weeks} Intensive</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Enterprise Capstone</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Placement Drive</span>
                </div>
              </div>
            </div>

            {/* Right Mini Action Card */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/80 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                      Programme Tuition
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta mt-1">
                      {programme.fee}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    24 Weeks
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>1-on-1 Senior Architect Mentorship</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Production Capstone Code in Your GitHub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Interview Coaching &amp; Direct Hiring Drives</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
                >
                  <span>Enroll in this Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          MAIN SYLLABUS & MODULES SECTION
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#0a0a0d] border-b border-white/10">
        <div className="site-container">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-zinc-400 font-jakarta">
              Comprehensive Curriculum
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-jakarta">
              4 Phased Modules to Production Readiness
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Each module includes live hands-on engineering labs, code reviews, and enterprise deliverables.
            </p>
          </div>

          {/* Modules Interactive Tabs & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Module Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {programme.modules.map((mod, i) => {
                const isActive = activeModule === i

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveModule(i)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-white/10 border-white/30 shadow-lg text-white'
                        : 'bg-zinc-900/50 border-white/5 hover:border-white/15 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-mono font-bold tracking-wider text-sky-400">
                        MODULE {mod.number}
                      </div>
                      <div className="text-base font-bold font-jakarta text-white">
                        {mod.title}
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'rotate-90 sm:rotate-0 text-white' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            {/* Active Module Details Card */}
            <div className="lg:col-span-7">
              {programme.modules[activeModule] && (
                <div className="p-7 sm:p-8 rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-md space-y-6">
                  <div>
                    <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                      Module {programme.modules[activeModule].number} Deep Dive
                    </span>
                    <h3 className="text-2xl font-extrabold text-white font-jakarta mt-1">
                      {programme.modules[activeModule].title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {programme.modules[activeModule].description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Skills &amp; Technologies Mastered:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {programme.modules[activeModule].skills.map((skill, si) => (
                        <span
                          key={si}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          ENTERPRISE CAPSTONE SPOTLIGHT
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#070709] border-b border-white/10">
        <div className="site-container">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-black border border-white/15 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>Enterprise Capstone Project</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-jakarta">
                {programme.capstone.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {programme.capstone.description}
              </p>

              <div className="pt-4 flex flex-wrap gap-4 text-xs text-zinc-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Production Repository
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Automated CI/CD Deploy
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Verified GitHub Commits
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          TARGET CAREER ROLES
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0a0d] border-b border-white/10">
        <div className="site-container">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-zinc-400 font-jakarta">
              Career Pathways
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta">
              Target Job Roles You Qualify For
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto">
            {programme.roles.map((role, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-semibold"
              >
                <Briefcase className="w-4 h-4 text-sky-400" />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          BOTTOM CTA BAR
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#070709] text-center">
        <div className="site-container max-w-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Limited seats per cohort to maintain strict 1-on-1 mentorship quality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Apply for {programme.levelBadge}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/careers#programmes"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-medium text-sm transition-colors text-center"
            >
              Compare All Tracks
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          APPLICATION MODAL / COUNSELOR POPUP
      ──────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-white/15 p-6 sm:p-8 shadow-2xl text-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {formSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold font-jakarta text-white">
                    Application Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto">
                    Our Senior Academic Counselor will review your profile and reach out within 24 hours to schedule your onboarding call.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false)
                      setIsApplyModalOpen(false)
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-1 pr-6">
                    <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                      Cohort Admission
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-jakarta text-white">
                      Apply for {programme.title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Tuition: {programme.fee} &bull; 24 Weeks Live Intensive
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@example.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Current Background
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-white/40"
                      >
                        <option value="Student / College Fresher">Student / College Fresher</option>
                        <option value="Working Professional (Switching to Tech)">Working Professional (Switching to Tech)</option>
                        <option value="Junior Developer (Upskilling)">Junior Developer (Upskilling)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Application &amp; Request Syllabus</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


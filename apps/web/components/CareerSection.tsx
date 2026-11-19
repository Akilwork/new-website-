'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  BookOpen,
  Laptop,
  Terminal,
  Award,
  Users,
  Briefcase,
  Layers,
  ArrowUpRight,
  Code2,
  Check,
  Server,
  Database,
  Cloud,
  FileCheck,
  Compass,
  GraduationCap,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  Layout,
  Cpu
} from 'lucide-react'
import { programmesData, ProgrammeItem } from '@/lib/programmesData'

export type { ProgrammeItem }

/* ─────────────────────────────────────────────────────────────────────────────
   POPULAR CATEGORIES DATA (8 Modern In-Demand Tech Domains)
────────────────────────────────────────────────────────────────────────────── */
const categoryItems = [
  {
    name: 'Frontend & UI',
    tag: 'Web & Mobile',
    icon: Layout,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    color: 'text-blue-600',
    hover: 'hover:border-blue-300 hover:shadow-blue-100/50',
  },
  {
    name: 'Backend & APIs',
    tag: 'Node.js & Python',
    icon: Server,
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    color: 'text-purple-600',
    hover: 'hover:border-purple-300 hover:shadow-purple-100/50',
  },
  {
    name: 'Full-Stack Dev',
    tag: 'MERN & Next.js',
    icon: Code2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    color: 'text-emerald-600',
    hover: 'hover:border-emerald-300 hover:shadow-emerald-100/50',
  },
  {
    name: 'Cloud & DevOps',
    tag: 'AWS & Docker',
    icon: Cloud,
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    color: 'text-rose-600',
    hover: 'hover:border-rose-300 hover:shadow-rose-100/50',
  },
  {
    name: 'Data & Databases',
    tag: 'Postgres & Mongo',
    icon: Database,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    color: 'text-amber-600',
    hover: 'hover:border-amber-300 hover:shadow-amber-100/50',
  },
  {
    name: 'QA & Automation',
    tag: 'Testing Frameworks',
    icon: CheckCircle2,
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    color: 'text-indigo-600',
    hover: 'hover:border-indigo-300 hover:shadow-indigo-100/50',
  },
  {
    name: 'Linux & IT Ops',
    tag: 'CI/CD & Shell',
    icon: Terminal,
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    color: 'text-orange-600',
    hover: 'hover:border-orange-300 hover:shadow-orange-100/50',
  },
  {
    name: 'Architecture',
    tag: 'System Design',
    icon: Layers,
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    color: 'text-teal-600',
    hover: 'hover:border-teal-300 hover:shadow-teal-100/50',
  },
]

export default function CareerSection() {
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeItem | null>(null)
  const [isCounselorOpen, setIsCounselorOpen] = useState(false)
  const [ctaEmail, setCtaEmail] = useState('')
  const [ctaSubmitted, setCtaSubmitted] = useState(false)
  const [targetTrack, setTargetTrack] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'Final Year Student / Fresh Graduate',
    selectedTrack: 'Full-Stack Development, QA & IT Operations',
    message: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenCounselor = (trackName?: string) => {
    if (trackName) {
      setTargetTrack(trackName)
      setFormData((prev) => ({ ...prev, selectedTrack: trackName }))
    }
    setIsCounselorOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((res) => setTimeout(res, 900))
    setIsSubmitting(false)
    setFormSubmitted(true)
  }

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ctaEmail.trim()) return
    setFormData((prev) => ({ ...prev, email: ctaEmail }))
    setCtaSubmitted(true)
    setTimeout(() => {
      setIsCounselorOpen(true)
    }, 400)
  }

  return (
    <div className="relative w-full bg-white text-slate-900 overflow-hidden font-jakarta">
      {/* ───────────────────────────────────────────────────────────────────────
          1. HERO SECTION (EXPANSIVE FULL-WIDTH TECH TRAINING IMAGE & HIGH CONTRAST)
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        id="overview"
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center bg-[#070709] text-white pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden"
      >
        {/* Full Section Tech Career Training Background Image (100% Width & Height) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2400&q=85"
            alt="DocMe Tech Career Training"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.1]"
          />

          {/* Balanced Dark Overlays Across the FULL Width for Complete Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/85 via-[#070709]/60 to-[#070709]/90" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.2),transparent_70%)]" />
        </div>

        <div className="site-container relative z-10 w-full py-8 sm:py-12">
          <div className="max-w-4xl space-y-7">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-jakarta drop-shadow-md"
            >
              Skills Today <br />
              <span className="text-[#3B82F6]">A Brighter</span> Tomorrow
            </motion.h1>

            {/* Realistic DocMe Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="text-base sm:text-lg lg:text-xl text-zinc-100 font-normal leading-relaxed max-w-2xl drop-shadow-sm"
            >
              World-class, industry-oriented training to help you grow from core fundamentals to production mastery. Build real SaaS applications, master system architecture, and launch your career with direct mentorship from DocMe senior engineers.
            </motion.p>

            {/* CTA Buttons and Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="space-y-8 pt-2"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#programmes"
                  className="px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.99] cursor-pointer group"
                >
                  <span>Explore Programmes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenCounselor()}
                  className="px-6 py-4 rounded-xl border border-white/25 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all duration-200 cursor-pointer backdrop-blur-md shadow-sm"
                >
                  Speak with a Mentor
                </button>
              </div>

              {/* Key stats row below button */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta drop-shadow-sm">100+</div>
                  <div className="text-xs text-zinc-300 font-medium mt-0.5">Enrolled Learners</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta drop-shadow-sm">15+</div>
                  <div className="text-xs text-zinc-300 font-medium mt-0.5">Expert Mentors</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta drop-shadow-sm">Lifetime</div>
                  <div className="text-xs text-zinc-300 font-medium mt-0.5">Career Guidance</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          2. POPULAR CATEGORIES SECTION (HORIZONTAL PASTEL PILLS)
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="categories" className="py-14 sm:py-20 bg-white border-b border-slate-100">
        <div className="site-container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-jakarta tracking-tight">
                Popular Categories
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-lg">
                Explore in-demand skills and find the right pathway for your career goals.
              </p>
            </div>
            <a
              href="#programmes"
              className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 group transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* 8 Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
            {categoryItems.map((cat, idx) => {
              const Icon = cat.icon
              return (
                <div
                  key={cat.name}
                  className={`rounded-2xl p-4 flex flex-col items-center text-center border ${cat.bg} ${cat.border} transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer group`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {cat.tag}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          3. "EVERYTHING YOU NEED IN ONE LEARNING JOURNEY" (3 VALUE CARDS WITH PHOTOS)
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="why-docme" className="py-16 sm:py-24 bg-[#FAFAFC] border-b border-slate-200/80">
        <div className="site-container">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-jakarta tracking-tight">
              Everything you need in one learning journey
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Practical engineering experience that bridges the gap between academic theory and high-performing tech roles.
            </p>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Production Projects */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 group">
              <div className="p-7 sm:p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 font-jakarta tracking-tight">
                  Production-Grade Projects
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ship code to live staging and production environments. Work on real enterprise microservices, robust REST APIs, and client-facing web applications.
                </p>
              </div>

              <div className="p-4 pt-0">
                <div className="rounded-2xl overflow-hidden h-52 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                    alt="Engineers Collaborating"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: 1-on-1 Mentorship */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 group">
              <div className="p-7 sm:p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 font-jakarta tracking-tight">
                  1-on-1 Senior Mentorship
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Continuous architectural reviews, pull request audits, and weekly 1:1 guidance from active tech leads who build software for leading global enterprises.
                </p>
              </div>

              <div className="p-4 pt-0">
                <div className="rounded-2xl overflow-hidden h-52 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=800&q=80"
                    alt="Mentor and Learner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Placement & Readiness */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 group">
              <div className="p-7 sm:p-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 font-jakarta tracking-tight">
                  Career & Placement Readiness
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Master live technical screenings, algorithmic problem solving, resume optimization, and unlock direct referrals across DocMe&apos;s corporate hiring network.
                </p>
              </div>

              <div className="p-4 pt-0">
                <div className="rounded-2xl overflow-hidden h-52 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                    alt="Career Readiness"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          4. "CHOOSE YOUR LEARNING PATH" (THE 2 PRICING/PROGRAMME CARDS)
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        id="programmes"
        className="relative bg-white text-slate-900 py-20 sm:py-28 lg:py-32 border-b border-slate-200/80 overflow-hidden"
      >
        <div id="programs" className="site-container relative z-10">
          {/* Centered Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-3.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 font-jakarta leading-[1.12]">
              Choose Your Learning Path
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              Two structured programmes designed to take you from foundational skills to industry-ready expertise.
            </p>
          </div>

          {/* Centered Cards Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            {programmesData.map((prog) => {
              const isFeatured = prog.id === 'level-1'

              return isFeatured ? (
                /* Level 1: Featured Card with Gradient Glow & Badge */
                <div
                  key={prog.id}
                  className="relative rounded-[36px] transition-all duration-300 flex flex-col group"
                >
                  {/* Default neutral border */}
                  <div className="absolute inset-0 rounded-[36px] border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />

                  {/* Highlight: Gradient border & glow on hover */}
                  <div className="absolute inset-0 p-[2.5px] rounded-[36px] bg-gradient-to-b from-[#f43f5e] via-[#c084fc] to-[#6366f1] shadow-[0_25px_60px_-15px_rgba(99,102,241,0.28)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

                  {/* Top Badge on hover */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#f43f5e] via-[#a855f7] to-[#6366f1] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white shadow-md whitespace-nowrap z-20 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                    Best Value &bull; Comprehensive
                  </div>

                  {/* Inner Card Container */}
                  <div className="relative z-10 m-[2.5px] h-full bg-white rounded-[33.5px] p-7 sm:p-9 flex flex-col justify-between overflow-hidden">
                    <div>
                      {/* Top Meta Sub-row */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-1">
                        <span className="font-semibold text-slate-700 font-mono tracking-wide">
                          # {prog.levelBadge}
                        </span>
                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {prog.duration} &bull; {prog.weeks}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-jakarta mb-2.5 tracking-tight leading-snug">
                        {prog.title}
                      </h3>

                      {/* Tagline/Highlight */}
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                        {prog.highlight}
                      </p>

                      {/* Action & Price Inset Box */}
                      <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between gap-4 mb-7 shadow-inner">
                        <button
                          type="button"
                          onClick={() => setSelectedProgramme(prog)}
                          className="px-6 py-3 rounded-full bg-[#5B63E6] hover:bg-[#4C53D4] text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.99]"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-jakarta tracking-tight">
                            {prog.fee}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            Programme Fee
                          </div>
                        </div>
                      </div>

                      {/* Features/Curriculum Checklist */}
                      <div className="space-y-3 pt-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Curriculum Modules &amp; Skills:
                        </div>
                        <ul className="space-y-2.5">
                          {prog.topics.map((topic, i) => (
                            <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action: View Syllabus Details */}
                    <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedProgramme(prog)}
                        className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer group/link text-left"
                      >
                        <span>View 4-Module Curriculum &amp; Capstone</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Level 2: Clean Elegant Card */
                <div
                  key={prog.id}
                  className="relative rounded-[36px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Meta Sub-row */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-1">
                      <span className="font-semibold text-slate-700 font-mono tracking-wide">
                        # {prog.levelBadge}
                      </span>
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {prog.duration} &bull; {prog.weeks}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-jakarta mb-2.5 tracking-tight leading-snug">
                      {prog.title}
                    </h3>

                    {/* Tagline/Highlight */}
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                      {prog.highlight}
                    </p>

                    {/* Action & Price Inset Box */}
                    <div className="rounded-2xl bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between gap-4 mb-7 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setSelectedProgramme(prog)}
                        className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.99]"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-jakarta tracking-tight">
                          {prog.fee}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          Programme Fee
                        </div>
                      </div>
                    </div>

                    {/* Features/Curriculum Checklist */}
                    <div className="space-y-3 pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Curriculum Modules &amp; Skills:
                      </div>
                      <ul className="space-y-2.5">
                        {prog.topics.map((topic, i) => (
                          <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Action: View Syllabus Details */}
                  <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedProgramme(prog)}
                      className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer group/link text-left"
                    >
                      <span>View 4-Module Curriculum &amp; Capstone</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          5. "HOW IT WORKS / GET STARTED IN 3 SIMPLE STEPS"
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#FAFAFC] border-b border-slate-200/80">
        <div className="site-container">
          {/* Section Kicker & Title */}
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#2563EB]">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-jakarta tracking-tight">
              Get started in 3 simple steps
            </h2>
          </div>

          {/* 3 Step Connected Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center flex flex-col items-center space-y-3.5 relative">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-md">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                <h3 className="text-lg font-bold text-slate-950">Choose Your Track</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                Review our structured curriculum, select your desired career path, and apply online in minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center flex flex-col items-center space-y-3.5 relative">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-md">
                <Laptop className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                <h3 className="text-lg font-bold text-slate-950">Learn &amp; Build Live</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                Attend interactive mentor sessions, build production-grade modules, and write clean code.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center flex flex-col items-center space-y-3.5 relative">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-md">
                <Send className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                <h3 className="text-lg font-bold text-slate-950">Launch Your Career</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                Complete your capstone, receive verified certification, and step directly into high-impact tech interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          6. "COACHING OPTIONS TO MATCH YOUR GOALS"
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="coaching" className="py-20 sm:py-28 bg-white">
        <div className="site-container">
          <div className="rounded-[36px] bg-[#F9FAFC] border border-slate-200/90 p-8 sm:p-12 lg:p-14 shadow-sm">
            {/* Top Row: Photo on Left, Title on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-12 border-b border-slate-200/80">
              {/* Left Photo */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden shadow-md h-64 sm:h-72 bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
                    alt="Instructor Teaching Workshop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">
                  Program Tracks
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-jakarta leading-tight">
                  Coaching Options to{' '}
                  <span className="font-serif italic font-normal text-slate-600">
                    Match Your Goals
                  </span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                  Whether you&apos;re preparing for a key role, improving your backend architecture, or mastering DevOps pipelines — there&apos;s a coaching path for you.
                </p>
              </div>
            </div>

            {/* Bottom 3 Feature Columns with Round Blue Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
              {/* 1. Coaching */}
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-jakarta">
                  1-on-1 Coaching
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Individual or small team focus. Deep-dive code reviews, architecture guidance, and weekly 1:1 mentor check-ins.
                </p>
              </div>

              {/* 2. Workshops */}
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Laptop className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-jakarta">
                  Live Sprint Workshops
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hands-on collaborative coding sessions, enterprise architectural tear-downs, and live debugging marathons.
                </p>
              </div>

              {/* 3. Speaker / Career Ready */}
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 font-jakarta">
                  Career Ready Package
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Resume transformation, mock technical screenings, system design prep, and partner job introductions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          7. DARK CALL TO ACTION BANNER (FULL SECTION BLACK, NO BORDER LINES)
      ──────────────────────────────────────────────────────────────────────── */}
      <section id="contact" className="relative w-full bg-[#080808] text-white py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Decorative Vector Wave Lines & Glowing Nodes spanning full section */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          viewBox="0 0 1000 400"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-50,200 C150,50 350,350 550,150 C750,-50 950,250 1050,180"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          <path
            d="M-50,300 C200,380 400,100 650,260 C850,390 980,100 1050,150"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          {/* Glowing circles */}
          <circle cx="100" cy="220" r="16" fill="#8B5CF6" />
          <circle cx="890" cy="180" r="14" fill="#FFFFFF" />
          <circle cx="80" cy="360" r="5" fill="#FFFFFF" />
          <circle cx="340" cy="360" r="6" fill="#FFFFFF" />
          <circle cx="880" cy="360" r="6" fill="#FFFFFF" />
        </svg>

        {/* Ambient subtle spotlights */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="site-container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white font-jakarta tracking-tight leading-tight">
              Come improve your skills and <br className="hidden sm:inline" />
              carve your achievements with us
            </h2>

            {/* Email Form */}
            <form onSubmit={handleCtaSubmit} className="max-w-md mx-auto">
              <div className="relative flex items-center rounded-full bg-white/10 p-1.5 focus-within:ring-2 focus-within:ring-indigo-400/40 backdrop-blur-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={ctaEmail}
                  onChange={(e) => setCtaEmail(e.target.value)}
                  className="w-full bg-transparent px-5 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#6366F1] hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-500/30 whitespace-nowrap hover:scale-105 active:scale-95"
                >
                  {ctaSubmitted ? 'Opening...' : 'Join Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          8. PROGRAMME SYLLABUS MODAL (BLACK & WHITE SOPHISTICATED DESIGN)
      ──────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProgramme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0c0e] border border-white/15 p-6 sm:p-8 text-left text-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProgramme(null)}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Meta & Badge */}
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider">
                  {selectedProgramme.levelBadge}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {selectedProgramme.duration} &bull; {selectedProgramme.weeks}
                </span>
              </div>

              {/* Title & Fee */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                <h3 className="text-2xl sm:text-3xl font-bold font-jakarta text-white">
                  {selectedProgramme.title}
                </h3>
                <div className="text-2xl font-extrabold text-white font-jakarta">
                  {selectedProgramme.fee}
                </div>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                {selectedProgramme.summary}
              </p>

              {/* Target Career Roles */}
              <div className="mb-6 p-4 rounded-2xl bg-zinc-900 border border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Target Career Roles:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProgramme.roles.map((role) => (
                    <span
                      key={role}
                      className="text-xs font-medium px-3 py-1 rounded-md bg-white/10 text-white border border-white/10"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Curriculum Modules */}
              <div className="mb-6 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Curriculum Modules:
                </div>
                {selectedProgramme.modules.map((mod) => (
                  <div key={mod.number} className="p-4 rounded-2xl bg-black/60 border border-white/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                        MODULE {mod.number}
                      </span>
                      <span className="text-sm font-bold text-white font-jakarta">{mod.title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-3">{mod.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.skills.map((skill, si) => (
                        <span
                          key={si}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Capstone Project */}
              <div className="mb-8 p-5 rounded-2xl bg-zinc-900 border border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Enterprise Capstone Project:
                </div>
                <div className="text-sm sm:text-base font-bold text-white font-jakarta mb-1">
                  {selectedProgramme.capstone.title}
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {selectedProgramme.capstone.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedProgramme(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const progName = selectedProgramme.title
                    setSelectedProgramme(null)
                    handleOpenCounselor(progName)
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Apply for this Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────────────────
          9. COUNSELOR & ADMISSIONS APPLICATION MODAL
      ──────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCounselorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0c0c0e] border border-white/15 p-6 sm:p-8 text-left text-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => {
                  setIsCounselorOpen(false)
                  setFormSubmitted(false)
                }}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {formSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-jakarta">Application Received</h3>
                  <p className="text-zinc-300 max-w-md mx-auto text-sm leading-relaxed">
                    Thank you, <span className="font-semibold text-white">{formData.name}</span>. Our admissions mentor will connect with you via WhatsApp (<span className="text-white">{formData.phone}</span>) or Email within 24 hours.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/917902731411?text=Hello%20DocMe%20Admissions,%20I%20have%20submitted%20my%20application%20for%20${encodeURIComponent(formData.selectedTrack)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCounselorOpen(false)
                        setFormSubmitted(false)
                      }}
                      className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-zinc-300 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Admissions Open &bull; Next Cohort</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-jakarta">
                      Apply for Career Training Cohort
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      Fill out your details to receive syllabus breakdown and fee scheduling.
                    </p>
                  </div>

                  {/* Target Track */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Selected Track
                    </label>
                    <select
                      name="selectedTrack"
                      value={formData.selectedTrack}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Full-Stack Development, QA & IT Operations">
                        Full-Stack Development, QA &amp; IT Operations (Level 1)
                      </option>
                      <option value="Advanced Software & Industry Professional">
                        Advanced Software &amp; Industry Professional (Level 2)
                      </option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Current Background
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Final Year Student / Fresh Graduate" className="bg-[#121214] text-white">
                        Final Year Student / Fresh Graduate
                      </option>
                      <option value="Working Professional (Career Switcher)" className="bg-[#121214] text-white">
                        Working Professional (Career Switcher)
                      </option>
                      <option value="Junior Software Engineer (Upskilling)" className="bg-[#121214] text-white">
                        Junior Software Engineer (Upskilling)
                      </option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

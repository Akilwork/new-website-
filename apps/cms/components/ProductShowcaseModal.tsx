'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Eye,
  Edit3,
  ExternalLink,
  Crop,
  UploadCloud,
  Sparkles,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Tag,
  Globe,
  Layers,
  ArrowRight,
  ChevronRight,
  Monitor,
  Smartphone,
  Users,
  BarChart3,
  CheckCircle,
  Shield,
  Bell,
  Zap,
  Award,
  LucideIcon
} from 'lucide-react'
import ImageCropModal from './ImageCropModal'
import { SectionItem, ProductShowcaseFeature } from '@/lib/sectionsData'

interface ProductShowcaseModalProps {
  isOpen: boolean
  onClose: () => void
  section: SectionItem | null
  initialMode?: 'view' | 'edit'
  onSave?: (updatedSection: SectionItem) => void
  allSections?: SectionItem[]
}

const ICON_OPTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'Users', label: 'Users / Attendance', icon: Users },
  { id: 'Smartphone', label: 'Mobile / Parent App', icon: Smartphone },
  { id: 'BarChart3', label: 'Analytics / Exams', icon: BarChart3 },
  { id: 'Monitor', label: 'Screen / Fees', icon: Monitor },
  { id: 'CheckCircle', label: 'Transport / Safety', icon: CheckCircle },
  { id: 'Sparkles', label: 'AI / Innovation', icon: Sparkles },
  { id: 'Shield', label: 'Security / Compliance', icon: Shield },
  { id: 'Bell', label: 'Notifications / Alerts', icon: Bell },
  { id: 'Zap', label: 'Speed / Automation', icon: Zap },
  { id: 'Award', label: 'Excellence / Badges', icon: Award },
]

const defaultFeatures: ProductShowcaseFeature[] = [
  {
    icon: 'Users',
    title: 'Attendance Automation',
    description: 'AI-powered facial recognition with real-time tracking'
  },
  {
    icon: 'Smartphone',
    title: 'Parent App',
    description: 'Real-time updates and communication portal'
  },
  {
    icon: 'BarChart3',
    title: 'Exam Management',
    description: 'Comprehensive assessment and grading system'
  },
  {
    icon: 'Monitor',
    title: 'Fees Tracking',
    description: 'Automated billing and payment processing'
  },
  {
    icon: 'CheckCircle',
    title: 'Transport Monitoring',
    description: 'GPS tracking with safety notifications'
  },
  {
    icon: 'BarChart3',
    title: 'Analytics Dashboard',
    description: 'Real-time insights and performance metrics'
  }
]

const defaultStats = [
  { value: '50+', label: 'Schools Using' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Support' },
]

export default function ProductShowcaseModal({
  isOpen,
  onClose,
  section,
  initialMode = 'view',
  onSave,
}: ProductShowcaseModalProps) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode)
  const [activeTab, setActiveTab] = useState<'content' | 'features' | 'stats' | 'media'>('content')

  // Editable fields
  const [heading, setHeading] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [stats, setStats] = useState<{ value: string; label: string }[]>(defaultStats)
  const [ctaLabel, setCtaLabel] = useState('View Full Case Study')
  const [ctaUrl, setCtaUrl] = useState('/portfolio')
  const [productFeatures, setProductFeatures] = useState<ProductShowcaseFeature[]>(defaultFeatures)

  // Image Crop modal
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState('')

  // Save states
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessNotice, setShowSuccessNotice] = useState(false)

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync state whenever section or isOpen changes
  useEffect(() => {
    if (section && isOpen) {
      setHeading(section.heading || 'Experience DocMe in Action')
      setDescription(
        section.description ||
          'Attendance automation with facial recognition, parent communication portal, automated fees tracking, GPS bus monitoring, and real-time executive analytics.'
      )
      setImage(section.image || '/assets/Feature/BM One.jpg')
      setMediaType(section.mediaType === 'video' ? 'video' : 'image')
      setStats(
        section.stats && section.stats.length > 0
          ? section.stats
          : defaultStats
      )
      setCtaLabel(section.cta?.label || 'View Full Case Study')
      setCtaUrl(section.cta?.url || '/portfolio')
      setProductFeatures(
        section.productFeatures && section.productFeatures.length > 0
          ? section.productFeatures
          : defaultFeatures
      )
      setMode(initialMode)
    }
  }, [section, isOpen, initialMode])

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCropOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isCropOpen, onClose])

  if (!isOpen || !mounted || !section) return null

  // Handle Saving
  const handleSave = async () => {
    if (!onSave) return
    setIsSaving(true)

    const updatedSection: SectionItem = {
      ...section,
      heading,
      description,
      image,
      mediaType,
      stats,
      cta: {
        label: ctaLabel,
        url: ctaUrl,
      },
      productFeatures,
      features: productFeatures.map((f) => f.title),
      lastModified: new Date().toISOString().split('T')[0],
    }

    try {
      await onSave(updatedSection)
      setIsSaving(false)
      setShowSuccessNotice(true)
      setTimeout(() => setShowSuccessNotice(false), 3000)
    } catch (err) {
      console.error('Error saving Product Showcase:', err)
      setIsSaving(false)
    }
  }

  // Feature manipulation helpers
  const handleAddFeature = () => {
    setProductFeatures((prev) => [
      ...prev,
      {
        icon: 'Sparkles',
        title: 'New Capability Module',
        description: 'Provide an engaging description of this key product feature.',
      },
    ])
  }

  const handleRemoveFeature = (idx: number) => {
    setProductFeatures((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpdateFeature = (idx: number, updates: Partial<ProductShowcaseFeature>) => {
    setProductFeatures((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, ...updates } : f))
    )
  }

  // Stat manipulation helpers
  const handleUpdateStat = (idx: number, field: 'value' | 'label', val: string) => {
    setStats((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    )
  }

  // Handle Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string
      setCropImageSrc(dataUrl)
      setIsCropOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedBase64: string) => {
    setImage(croppedBase64)
    setIsCropOpen(false)
  }

  const modalContent = (
    <>
      {/* Dimmed Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 z-[99] touch-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Side Sheet Drawer (Full-Height: Top to Bottom, 100% Viewport Docked) */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] h-screen max-h-screen w-full max-w-[880px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden overscroll-contain transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none invisible'
        }`}
      >
        {/* Drawer Top Header */}
        <div className="shrink-0 px-6 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Monitor className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    Section 7 • Home Product Showcase
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium truncate max-w-[200px]">
                    {section.key}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
                  Experience DocMe in Action (BM One Studio)
                </h2>
              </div>
            </div>

            {/* Mode Switcher + Live Web Link + Close */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setMode('view')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'view'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === 'edit'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Editor</span>
                </button>
              </div>

              <a
                href={`${webUrl}/#product`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
                title="View on live website"
              >
                <span>Live Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>

      {/* ================= MODAL BODY ================= */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        {mode === 'view' ? (
          /* ================= LIVE WEBSITE PREVIEW MODE ================= */
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-6">
            {/* Context Notice Banner */}
            <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> True-To-Life Website Preview
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Home Page • Section 7
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  This preview renders the exact high-fidelity product showcase shown on the Docme website landing page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMode('edit')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize Content &amp; Media</span>
              </button>
            </div>

            {/* Exact Landing Page Dark Section Mockup */}
            <div className="rounded-3xl border border-white/10 bg-[#080808] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-2xl">
              {/* Background Glows */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
              </div>

              <div className="relative max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 sm:gap-12 xl:gap-20 items-start">
                  {/* Left Column: Heading, Description, Stats & CTA */}
                  <div className="space-y-8 sm:space-y-10">
                    <div className="space-y-5">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-jakarta leading-[1.1] tracking-tight text-white whitespace-pre-line">
                        {heading}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-[28rem]">
                        {description}
                      </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {stats.map((stat, i) => (
                        <div
                          key={stat.label + i}
                          className="relative rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm overflow-hidden group hover:border-indigo-500/30 transition-colors"
                        >
                          <div className="text-2xl font-bold text-white mb-1 font-jakarta">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div>
                      <div className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30">
                        <span>{ctaLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 font-mono">
                        Target URL: {ctaUrl}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Product Showcase Media & Features Grid */}
                  <div className="space-y-5">
                    {/* Media Mockup */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                      {mediaType === 'video' ? (
                        <video
                          src={image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto object-cover max-h-[440px]"
                        />
                      ) : (
                        <img
                          src={image}
                          alt={heading}
                          className="w-full h-auto object-cover max-h-[440px]"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/assets/Feature/BM One.jpg'
                          }}
                        />
                      )}
                    </div>

                    {/* 6 Capability Modules Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {productFeatures.map((feat, idx) => {
                        const iconMatch = ICON_OPTIONS.find((opt) => opt.id === feat.icon)
                        const IconComponent = iconMatch ? iconMatch.icon : Sparkles

                        return (
                          <div
                            key={idx}
                            className="group flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.03] hover:border-indigo-500/25 hover:bg-white/[0.07] transition-all"
                          >
                            <div className="w-7 h-7 bg-indigo-600/80 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-500 transition-colors">
                              <IconComponent className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-white mb-0.5 leading-snug truncate">
                                {feat.title}
                              </h3>
                              <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                                {feat.description}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= STUDIO EDITOR MODE ================= */
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
            {/* Top Editor Tab Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              {[
                { id: 'content', label: '1. Headline & Media', icon: Edit3 },
                { id: 'features', label: '2. 6 Capability Modules', icon: Layers },
                { id: 'stats', label: '3. Performance Stats & CTA', icon: BarChart3 },
              ].map((tab) => {
                const TabIcon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* TAB 1: Headline & Main Media */}
            {activeTab === 'content' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Text Content */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-indigo-400" />
                      Section Heading &amp; Copy
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Customize the main headline and narrative for the Product Showcase section.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Section Headline
                      </label>
                      <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        placeholder="Experience DocMe in Action"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Section Description
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed narrative describing the product capabilities..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Main Product Media */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-indigo-400" />
                      Showcase Media Asset (Mockup / Video)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload or crop a high-resolution software mockup or enter a video asset URL.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 aspect-video flex items-center justify-center">
                      {mediaType === 'video' ? (
                        <video
                          src={image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={image}
                          alt="Showcase Media"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/assets/Feature/BM One.jpg'
                          }}
                        />
                      )}
                    </div>

                    {/* Media Type & URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Media Type
                        </label>
                        <select
                          value={mediaType}
                          onChange={(e) => setMediaType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="image">Image (PNG / JPG)</option>
                          <option value="video">Video (MP4 / WebM)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Asset URL
                        </label>
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="/assets/Feature/BM One.jpg"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Upload & Crop Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-white cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                        <span>Upload New Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>

                      {image && (
                        <button
                          type="button"
                          onClick={() => {
                            setCropImageSrc(image)
                            setIsCropOpen(true)
                          }}
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-white cursor-pointer transition-colors"
                        >
                          <Crop className="w-4 h-4 text-emerald-400" />
                          <span>Crop Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 6 Capability Modules */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Product Capability Modules ({productFeatures.length} Active)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure the interactive capability tiles displayed beside the product showcase.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Module</span>
                  </button>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productFeatures.map((feat, idx) => {
                    const iconMatch = ICON_OPTIONS.find((opt) => opt.id === feat.icon)
                    const CurrentIcon = iconMatch ? iconMatch.icon : Sparkles

                    return (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/30">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-300">
                              Module Configuration
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Remove this capability module"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Icon & Title Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Icon
                            </label>
                            <div className="relative">
                              <select
                                value={feat.icon || 'Sparkles'}
                                onChange={(e) =>
                                  handleUpdateFeature(idx, { icon: e.target.value })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                              >
                                {ICON_OPTIONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Module Title
                            </label>
                            <input
                              type="text"
                              value={feat.title}
                              onChange={(e) =>
                                handleUpdateFeature(idx, { title: e.target.value })
                              }
                              placeholder="e.g. Attendance Automation"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Capability Description
                          </label>
                          <textarea
                            rows={2}
                            value={feat.description}
                            onChange={(e) =>
                              handleUpdateFeature(idx, { description: e.target.value })
                            }
                            placeholder="AI-powered facial recognition with real-time tracking"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: Performance Stats & CTA */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* 3 Stats Configuration */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      Performance &amp; Social Proof Metrics (3 Stats)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      These 3 glass metrics cards are displayed prominently beneath the headline.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {stats.map((stat, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Metric Value #{i + 1}
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleUpdateStat(i, 'value', e.target.value)}
                            placeholder="50+"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Metric Label #{i + 1}
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => handleUpdateStat(i, 'label', e.target.value)}
                            placeholder="Schools Using"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call To Action Button Configuration */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                      Section Call to Action (CTA)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Define the button label and where visitors navigate when clicked.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                        placeholder="View Full Case Study"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Destination URL
                      </label>
                      <input
                        type="text"
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="/portfolio"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Button Live Preview */}
                    <div className="pt-3 border-t border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                        Button Live Preview
                      </span>
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30">
                        <span>{ctaLabel || 'View Full Case Study'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

        {/* Drawer Bottom Actions */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-slate-200/90 bg-white flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {showSuccessNotice && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Showcase updated &amp; synced!</span>
              </span>
            )}

            {mode === 'view' ? (
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                <span>Edit Showcase Content</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                {isSaving ? (
                  <span>Syncing...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Save &amp; Update Website</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= IMAGE CROP MODAL ================= */}
      {isCropOpen && cropImageSrc && (
        <ImageCropModal
          isOpen={isCropOpen}
          onClose={() => setIsCropOpen(false)}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  )

  return createPortal(modalContent, document.body)
}

'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Eye,
  Edit3,
  Briefcase,
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
} from 'lucide-react'
import ImageCropModal from './ImageCropModal'
import { SectionItem, FeaturedServiceItem, initialSectionsData } from '@/lib/sectionsData'

export const defaultFeaturedServices: FeaturedServiceItem[] = [
  {
    id: 'education-institution',
    tag: 'Education',
    title: 'Education & Institution Solutions',
    description:
      'Empower educational institutions with smart digital solutions that streamline operations, enhance engagement, and improve learning experiences.',
    features: [
      'Student Information System',
      'Academic Planning',
      'Grade Management',
    ],
    image: '/assets/Feature/School Dairy V2.1 1.jpg',
    url: '/services',
  },
  {
    id: 'business-management',
    tag: 'Business',
    title: 'Administration & Operations',
    description:
      'Streamline operations with a centralized platform that enhances productivity, automates workflows, and enables smarter decision-making.',
    features: [
      'Multi-branch ERP',
      'Inventory & Supply Chain',
      'CRM & Sales Automation',
    ],
    image: '/assets/Feature/BM One.jpg',
    url: '/services',
  },
  {
    id: 'cloud-digital',
    tag: 'Cloud',
    title: 'Cloud & Digital Solutions',
    description:
      'Accelerate digital transformation with secure, scalable cloud solutions that enhance efficiency, collaboration, and business growth.',
    features: [
      'Cloud Migration & Hosting',
      'SaaS Platform Development',
      'API Integration Services',
    ],
    image: '/assets/Feature/dash.jpg',
    url: '/services',
  },
]

interface ServiceInnerSectionModalProps {
  isOpen: boolean
  onClose: () => void
  section: SectionItem | null
  initialMode?: 'view' | 'edit'
  onSave?: (updatedSection: SectionItem) => void
  allSections?: SectionItem[]
}

export default function ServiceInnerSectionModal({
  isOpen,
  onClose,
  section,
  initialMode = 'view',
  onSave,
  allSections,
}: ServiceInnerSectionModalProps) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode)
  const [selectedSlot, setSelectedSlot] = useState<number>(0)

  // 3 Featured Services State
  const [servicesList, setServicesList] = useState<FeaturedServiceItem[]>(defaultFeaturedServices)

  // Section Header State
  const [sectionHeading, setSectionHeading] = useState('')
  const [sectionDescription, setSectionDescription] = useState('')

  // Crop & Image State
  const [cropTargetImage, setCropTargetImage] = useState<string>('')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New Feature input for active service
  const [newFeatureInput, setNewFeatureInput] = useState('')

  // Toast
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Master available services from CMS for quick selection
  const masterServices = useMemo(() => {
    const list = allSections || initialSectionsData
    return list.filter((s) => s.pageKey === 'service' && s.type === 'Service Offering')
  }, [allSections])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock background scroll when modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return

    const mainEl = document.querySelector('main')
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalMainOverflow = mainEl ? mainEl.style.overflow : ''

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (mainEl) {
        mainEl.style.overflow = 'hidden'
      }
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (mainEl) {
        mainEl.style.overflow = ''
      }
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      if (mainEl) {
        mainEl.style.overflow = originalMainOverflow
      }
    }
  }, [isOpen])

  // Initialize from section
  useEffect(() => {
    if (section) {
      setSectionHeading(section.heading || 'Integrated Digital Solutions')
      setSectionDescription(
        section.description ||
        'Docme delivers smart digital and cloud solutions that drive efficiency,` innovation, and business growth. Empower educational institutions and enterprises with smart digital solutions.'
      )

      if (section.featuredServices && section.featuredServices.length === 3) {
        setServicesList(JSON.parse(JSON.stringify(section.featuredServices)))
      } else {
        setServicesList(defaultFeaturedServices)
      }
    }
    if (isOpen) {
      setMode(initialMode)
      setSelectedSlot(0)
    }
  }, [section, isOpen, initialMode])

  const activeService = servicesList[selectedSlot] || servicesList[0]

  // Update field of active service
  const handleUpdateActiveField = (key: keyof FeaturedServiceItem, value: any) => {
    setServicesList((prev) =>
      prev.map((s, i) => (i === selectedSlot ? { ...s, [key]: value } : s))
    )
  }

  // Swap / Select from Master Service List
  const handleSelectFromMaster = (masterId: string) => {
    const found = masterServices.find((m) => m.id === masterId)
    if (!found) return

    setServicesList((prev) =>
      prev.map((s, i) => {
        if (i !== selectedSlot) return s
        const tagCandidate = found.title.includes('Academic')
          ? 'Education'
          : found.title.includes('Administration')
            ? 'Business'
            : found.title.includes('Cloud')
              ? 'Cloud'
              : found.title.includes('Finance')
                ? 'Finance'
                : found.title.includes('Transport')
                  ? 'Fleet'
                  : found.title.includes('Analytics')
                    ? 'Analytics'
                    : found.title.split(' ')[0]

        return {
          id: `featured-${found.key || found.id}`,
          tag: tagCandidate,
          title: found.heading || found.title,
          description: found.description || s.description,
          features: found.features && found.features.length > 0 ? [...found.features.slice(0, 4)] : s.features,
          image: found.image || s.image,
          url: '/services',
        }
      })
    )
  }

  // Add / Remove feature in active service
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return
    const updatedFeatures = [...(activeService.features || []), newFeatureInput.trim()]
    handleUpdateActiveField('features', updatedFeatures)
    setNewFeatureInput('')
  }

  const handleRemoveFeature = (fIndex: number) => {
    const updatedFeatures = (activeService.features || []).filter((_, i) => i !== fIndex)
    handleUpdateActiveField('features', updatedFeatures)
  }

  // Upload file for active service image
  const handleUploadFile = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    setUploadProgress(25)

    const preview = URL.createObjectURL(file)
    handleUpdateActiveField('image', preview)
    setCropTargetImage(preview)
    setIsCropModalOpen(true)

    try {
      const payload = new FormData()
      payload.append('file', file)
      setUploadProgress(60)

      const res = await fetch('/api/upload', { method: 'POST', body: payload })
      setUploadProgress(90)
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          handleUpdateActiveField('image', data.url)
        }
      }
    } catch {
      // retain preview
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 400)
    }
  }

  // Crop Completed
  const handleCropComplete = async (croppedDataUrl: string, croppedBlob?: Blob) => {
    handleUpdateActiveField('image', croppedDataUrl)
    setIsCropModalOpen(false)

    if (croppedBlob) {
      try {
        const file = new File([croppedBlob], `service-crop-${Date.now()}.jpg`, { type: 'image/jpeg' })
        const payload = new FormData()
        payload.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: payload })
        if (res.ok) {
          const data = await res.json()
          if (data.url) {
            handleUpdateActiveField('image', data.url)
          }
        }
      } catch {
        // retain optimistic
      }
    }
  }

  // Save changes
  const handleSave = async () => {
    if (!section) return
    setIsSaving(true)

    const updatedSection: SectionItem = {
      ...section,
      heading: sectionHeading || section.heading,
      description: sectionDescription || section.description,
      featuredServices: servicesList,
      lastModified: new Date().toISOString().split('T')[0],
    }

    try {
      if (onSave) {
        onSave(updatedSection)
      }
      setShowSavedToast(true)
      setTimeout(() => {
        setShowSavedToast(false)
        setMode('view')
      }, 1000)
    } finally {
      setIsSaving(false)
    }
  }

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'
  const liveServicesUrl = `${webUrl}/services`

  if (!mounted || !isOpen || !section) return null

  return createPortal(
    <>
      {/* Dimmed Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 z-[99] touch-none ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Side Sheet Drawer (Full-Height: Top to Bottom, 100% Viewport Docked) */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] h-screen max-h-screen w-full max-w-[880px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden overscroll-contain transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none invisible'
          }`}
      >

        {/* ================= Top Bar Header ================= */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Landing Page Services Showcase Studio
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  HOME SECTION 6 • 3 FEATURED SERVICES
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {sectionHeading || 'Services Showcase'}
              </h2>
            </div>
          </div>

          {/* Mode Switcher Tabs + Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View / Edit Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setMode('view')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === 'view'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>View 3 Services</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === 'edit'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Edit Service Details</span>
              </button>
            </div>

            {/* Live Web Link */}
            <a
              href={liveServicesUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
              title="View services section on live website"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* ================= 3 Featured Services Switcher Strip ================= */}
        <div className="px-5 sm:px-7 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>3 Landing Page Services:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {servicesList.map((s, idx) => {
                const isSelected = selectedSlot === idx
                return (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => setSelectedSlot(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${isSelected
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-amber-400/40'
                        : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 shadow-2xs'
                      }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[160px] sm:max-w-[200px]">{s.title}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/10">
                      {s.tag}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Swap from Master Service List dropdown */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500">
              Swap Slot {selectedSlot + 1} with:
            </span>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) handleSelectFromMaster(e.target.value)
              }}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium hover:border-slate-400 transition-colors cursor-pointer"
            >
              <option value="">Select from Service Offerings...</option>
              {masterServices.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.heading || m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* ============================================================== */}
          {/* VIEW MODE: High-Fidelity 3-Card Grid + Spotlight               */}
          {/* ============================================================== */}
          {mode === 'view' && (
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Header Description Banner */}
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Landing Page Live Layout
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {sectionHeading}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {sectionDescription}
                </p>
              </div>

              {/* 3-Card Grid preview matching Home Page */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {servicesList.map((item, idx) => {
                  const isSelected = selectedSlot === idx
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => setSelectedSlot(idx)}
                      className={`group bg-white rounded-2xl sm:rounded-3xl p-3 border transition-all duration-300 flex flex-col relative cursor-pointer ${isSelected
                          ? 'border-amber-400 shadow-lg ring-2 ring-amber-400/30'
                          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                        }`}
                    >
                      {/* Slot Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${isSelected
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-black/60 text-white'
                            }`}
                        >
                          Slot {idx + 1}
                        </span>
                      </div>

                      {/* Image */}
                      <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            ; (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-3 sm:p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                          {item.tag}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                          {item.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-1 mt-auto pt-3 border-t border-slate-100">
                          {item.features &&
                            item.features.map((feat, fIdx) => (
                              <li
                                key={fIdx}
                                className="text-[11px] text-slate-600 flex items-center gap-1.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                        </ul>

                        {/* Navigation Indicator */}
                        <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-mono">
                            → {item.url || '/services'}
                          </span>
                          <span className="font-semibold text-indigo-600 flex items-center gap-0.5">
                            <span>Select to Edit</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Selected Slot Detailed Spotlight */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        Selected Slot {selectedSlot + 1}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {activeService.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeService.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('edit')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Edit Slot {selectedSlot + 1} Content</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Service Description
                      </span>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {activeService.description}
                      </p>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">
                        Capabilities &amp; Sub-Services ({activeService.features?.length || 0})
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {activeService.features?.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs font-medium text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Website Navigation Option
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {activeService.url || '/services'}
                        </span>
                        <a
                          href={`${webUrl}${activeService.url || '/services'}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          <span>Test Live Navigation</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/10] border border-slate-200 shadow-inner group">
                    <img
                      src={activeService.image}
                      alt={activeService.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setCropTargetImage(activeService.image)
                          setIsCropModalOpen(true)
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-semibold backdrop-blur-md hover:bg-black transition-colors cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Crop Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* EDIT MODE: Detailed Slot Content & Options Form                 */}
          {/* ============================================================== */}
          {mode === 'edit' && (
            <div className="max-w-4xl mx-auto space-y-6">

              {/* Slot Selector Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Editing Particular Service Slot
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Select which slot on the home landing page you want to configure
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSlot(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedSlot === idx
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      Slot {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Service List Swap Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Quick Load from Master Service List</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded-full">
                    Swap Slot {selectedSlot + 1}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Choose any existing service from your website service offerings to automatically fill this slot with its title, tag, image, and features.
                </p>
                <div className="pt-1">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleSelectFromMaster(e.target.value)
                    }}
                    className="w-full sm:w-auto text-xs bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                  >
                    <option value="">Choose a service to assign to Slot {selectedSlot + 1}...</option>
                    {masterServices.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.heading || m.title} ({m.features?.length || 0} features)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service Details Form */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Slot {selectedSlot + 1} Service Properties
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Tag */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Category Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={activeService.tag}
                      onChange={(e) => handleUpdateActiveField('tag', e.target.value)}
                      placeholder="Education, Business, Cloud..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  {/* Navigation URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Card Navigation Destination URL
                    </label>
                    <input
                      type="text"
                      value={activeService.url || '/services'}
                      onChange={(e) => handleUpdateActiveField('url', e.target.value)}
                      placeholder="/services or /services#academic"
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  {/* Service Title */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Service Title (Shown on Landing Page)
                    </label>
                    <input
                      type="text"
                      value={activeService.title}
                      onChange={(e) => handleUpdateActiveField('title', e.target.value)}
                      placeholder="e.g. Education & Institution Solutions"
                      className="w-full text-sm font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Service Description
                    </label>
                    <textarea
                      rows={3}
                      value={activeService.description}
                      onChange={(e) => handleUpdateActiveField('description', e.target.value)}
                      placeholder="Short summary of this service..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* Image Upload & Crop */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Service Card Image
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCropTargetImage(activeService.image)
                        setIsCropModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Crop / Adjust Image</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-18 rounded-xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                      <img
                        src={activeService.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={activeService.image}
                        onChange={(e) => handleUpdateActiveField('image', e.target.value)}
                        placeholder="/assets/Feature/... or https://..."
                        className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) handleUploadFile(f)
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload New File'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capabilities / Features List */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Sub-Services &amp; Key Features List
                  </label>

                  <div className="space-y-2">
                    {activeService.features?.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <span className="text-xs font-medium text-slate-800 px-1">
                          • {feat}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIdx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Feature input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddFeature()
                        }
                      }}
                      placeholder="Add new sub-service capability..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Section-Level Header Editor */}
                <div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Home Page Section Title &amp; Intro
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={sectionHeading}
                      onChange={(e) => setSectionHeading(e.target.value)}
                      placeholder="Section Headline (e.g. Integrated Digital Solutions)"
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                    <textarea
                      rows={2}
                      value={sectionDescription}
                      onChange={(e) => setSectionDescription(e.target.value)}
                      placeholder="Section Intro description..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions inside Form */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode('view')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel / Back to View
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {isSaving ? (
                    <span>Syncing to Website...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Save Changes to Website</span>
                    </>
                  )}
                </button>
              </div>
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
            {mode === 'view' ? (
              <button
                type="button"
                onClick={() => setMode('edit')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>Edit Service Details</span>
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

      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-[130] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">
            Services Showcase updated &amp; synced to website!
          </span>
        </div>
      )}

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={cropTargetImage || activeService.image}
        onCropComplete={handleCropComplete}
        defaultAspectRatio={4 / 3}
      />
    </>,
    document.body
  )
}

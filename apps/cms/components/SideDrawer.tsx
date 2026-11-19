'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  X,
  Layers,
  Image as ImageIcon,
  Type,
  Eye,
  Check,
  Video,
  CheckCircle2,
  Trash2,
  Plus,
  EyeOff,
  Sparkles,
  Link as LinkIcon,
  BarChart3,
  Globe,
  ArrowRight,
  ArrowUpRight,
  Palette,
  RotateCw,
  Sliders,
  Users,
  Briefcase,
  FolderPlus,
  HelpCircle,
  UploadCloud,
  RefreshCw,
  Crop,
  Edit3,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react'
import ImageCropModal from './ImageCropModal'
import ConfirmModal from './ConfirmModal'
import PortfolioInnerSectionModal from './PortfolioInnerSectionModal'
import { SectionItem } from '@/lib/sectionsData'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  section: SectionItem | null
  initialTab?: 'content' | 'preview'
  onSave?: (updatedSection: SectionItem) => void
  onDelete?: (sectionId: string) => void
  onSuccess?: () => void
}

export default function SideDrawer({
  isOpen,
  onClose,
  section,
  initialTab = 'content',
  onSave,
  onDelete,
  onSuccess,
}: SideDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'preview'>(
    initialTab === 'preview' ? 'preview' : 'content'
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Form State initialized from section
  const [formData, setFormData] = useState<SectionItem>({
    id: '',
    pageKey: 'home',
    pageTitle: 'Home',
    pageSlug: '/',
    key: '',
    title: '',
    type: 'Section',
    heading: '',
    description: '',
    image: '',
    mediaType: 'image',
    status: 'Published',
    order: 1,
    lastModified: '',
  })

  // Local state for adding/editing stats
  const [statsList, setStatsList] = useState<{ value: string; label: string }[]>([])
  const [newStatValue, setNewStatValue] = useState('')
  const [newStatLabel, setNewStatLabel] = useState('')

  // Local state for service sub-services / capability features
  const [featuresList, setFeaturesList] = useState<string[]>([])
  const [newFeatureText, setNewFeatureText] = useState('')

  // Local state for gallery images
  const [galleryList, setGalleryList] = useState<string[]>([])
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [initialSnapshot, setInitialSnapshot] = useState<string>('')
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false)

  // Track previous video before deletion so user can instantly undo/restore
  const [lastDeletedVideo, setLastDeletedVideo] = useState<string | null>(null)

  // Portfolio Inner Section studio modal
  const [isInnerSectionModalOpen, setIsInnerSectionModalOpen] = useState(false)
  const [innerSectionModalMode, setInnerSectionModalMode] = useState<'view' | 'edit'>('view')

  // Live Preview interactive state
  const [previewActiveImage, setPreviewActiveImage] = useState<string>('')
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const previewVideoRef = React.useRef<HTMLVideoElement>(null)

  const togglePreviewVideoPlay = () => {
    if (!previewVideoRef.current) return
    if (previewVideoRef.current.paused) {
      previewVideoRef.current.play()
      setIsVideoPlaying(true)
    } else {
      previewVideoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  const togglePreviewVideoMute = () => {
    if (!previewVideoRef.current) return
    previewVideoRef.current.muted = !previewVideoRef.current.muted
    setIsVideoMuted(previewVideoRef.current.muted)
  }

  // Shadcn Hero Media Upload & Image Crop State
  const [isHeroUploading, setIsHeroUploading] = useState(false)
  const [heroUploadProgress, setHeroUploadProgress] = useState(0)
  const [heroUploadError, setHeroUploadError] = useState<string | null>(null)
  const [isHeroDragOver, setIsHeroDragOver] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [cropTargetImage, setCropTargetImage] = useState<string>('')
  const heroFileInputRef = React.useRef<HTMLInputElement>(null)

  // Handle completed crop from Shadcn ImageCropModal
  const handleCropComplete = async (croppedDataUrl: string, croppedBlob?: Blob) => {
    // 1. Immediately apply high-quality cropped dataUrl for instant live preview
    setFormData((prev) => ({
      ...prev,
      image: croppedDataUrl,
      mediaType: 'image',
    }))

    // 2. Persist cropped file to backend upload directory if blob is available
    if (croppedBlob) {
      try {
        const file = new File([croppedBlob], `hero-cropped-${Date.now()}.jpg`, { type: 'image/jpeg' })
        const formPayload = new FormData()
        formPayload.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formPayload,
        })
        if (res.ok) {
          const data = await res.json()
          if (data.url) {
            setFormData((prev) => ({
              ...prev,
              image: data.url,
              mediaType: 'image',
            }))
          }
        }
      } catch (err) {
        console.warn('Cropped asset background sync warning:', err)
      }
    }
  }

  const handleHeroFileUpload = async (file: File) => {
    if (!file) return
    setIsHeroUploading(true)
    setHeroUploadProgress(20)
    setHeroUploadError(null)

    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name)
    const mediaType = isVid ? 'video' : 'image'

    try {
      const localPreviewUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        image: localPreviewUrl,
        mediaType,
      }))
      setHeroUploadProgress(45)

      // If an image is uploaded, open the Shadcn crop modal for precision framing
      if (!isVid) {
        setCropTargetImage(localPreviewUrl)
        setIsCropModalOpen(true)
      }

      const formPayload = new FormData()
      formPayload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      })

      setHeroUploadProgress(85)

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setFormData((prev) => ({
            ...prev,
            image: data.url,
            mediaType,
          }))
          if (!isVid) {
            setCropTargetImage(data.url)
          }
        }
      } else {
        const err = await res.json().catch(() => ({}))
        setHeroUploadError(err.error || 'Failed to upload media file')
      }
      setHeroUploadProgress(100)
    } catch {
      // Keep optimistic preview
    } finally {
      setTimeout(() => {
        setIsHeroUploading(false)
        setHeroUploadProgress(0)
      }, 500)
    }
  }

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsHeroDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleHeroFileUpload(file)
    }
  }

  // Shadcn About Section Image Upload State
  const [isAboutUploading, setIsAboutUploading] = useState(false)
  const [aboutUploadProgress, setAboutUploadProgress] = useState(0)
  const [aboutUploadError, setAboutUploadError] = useState<string | null>(null)
  const [isAboutDragOver, setIsAboutDragOver] = useState(false)
  const aboutFileInputRef = React.useRef<HTMLInputElement>(null)

  const handleAboutFileUpload = async (file: File) => {
    if (!file) return
    setIsAboutUploading(true)
    setAboutUploadProgress(20)
    setAboutUploadError(null)

    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name)
    const mediaType = isVid ? 'video' : 'image'

    try {
      const localPreviewUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        image: localPreviewUrl,
        mediaType,
      }))
      setAboutUploadProgress(45)

      if (!isVid) {
        setCropTargetImage(localPreviewUrl)
        setIsCropModalOpen(true)
      }

      const formPayload = new FormData()
      formPayload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      })

      setAboutUploadProgress(85)

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setFormData((prev) => ({
            ...prev,
            image: data.url,
            mediaType,
          }))
          if (!isVid) {
            setCropTargetImage(data.url)
          }
        }
      } else {
        const err = await res.json().catch(() => ({}))
        setAboutUploadError(err.error || 'Failed to upload image')
      }
      setAboutUploadProgress(100)
    } catch {
      // preview retained
    } finally {
      setTimeout(() => {
        setIsAboutUploading(false)
        setAboutUploadProgress(0)
      }, 500)
    }
  }

  const handleAboutDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAboutDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleAboutFileUpload(file)
    }
  }

  // Shadcn General Media Upload State
  const [isMediaUploading, setIsMediaUploading] = useState(false)
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0)
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null)
  const [isMediaDragOver, setIsMediaDragOver] = useState(false)
  const [showManualUrl, setShowManualUrl] = useState(false)
  const mediaFileInputRef = React.useRef<HTMLInputElement>(null)

  const handleGeneralMediaFileUpload = async (file: File) => {
    if (!file) return
    setIsMediaUploading(true)
    setMediaUploadProgress(20)
    setMediaUploadError(null)

    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name)
    const mediaType = isVid ? 'video' : 'image'

    try {
      const localPreviewUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        image: localPreviewUrl,
        mediaType,
      }))
      setMediaUploadProgress(45)

      if (!isVid) {
        setCropTargetImage(localPreviewUrl)
        setIsCropModalOpen(true)
      }

      const formPayload = new FormData()
      formPayload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      })

      setMediaUploadProgress(85)

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setFormData((prev) => ({
            ...prev,
            image: data.url,
            mediaType,
          }))
          if (!isVid) {
            setCropTargetImage(data.url)
          }
        }
      } else {
        const err = await res.json().catch(() => ({}))
        setMediaUploadError(err.error || 'Failed to upload media file')
      }
      setMediaUploadProgress(100)
    } catch {
      // preview retained
    } finally {
      setTimeout(() => {
        setIsMediaUploading(false)
        setMediaUploadProgress(0)
      }, 500)
    }
  }

  const handleGeneralMediaDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsMediaDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleGeneralMediaFileUpload(file)
    }
  }

  // Section-Wise Identity Helpers (with safe fallbacks)
  const itemKey = formData.key || ''
  const isHero =
    itemKey === 'hero' ||
    itemKey.includes('hero') ||
    formData.type === 'Hero Video Banner' ||
    (formData.title || '').toLowerCase().includes('hero')
  const isAboutIntro =
    itemKey === 'about_intro' ||
    formData.id === 'sec-about-intro' ||
    itemKey.includes('about_intro') ||
    (formData.pageKey === 'about' &&
      (formData.type === 'Text & Media Highlight' ||
        (formData.title || '').toLowerCase().includes('pioneering')))
  const isBrands = itemKey === 'trusted_brands' || itemKey.includes('brand') || itemKey.includes('logo')
  const isImpact = itemKey === 'impact' || itemKey === 'about_stats' || itemKey.includes('stat') || itemKey.includes('metric')
  const isStory = itemKey === 'our_story' || itemKey.includes('story')
  const isBento = itemKey === 'bento_grid' || itemKey.includes('bento')
  const isProduct = itemKey === 'product_showcase' || itemKey.includes('product')
  const isTeam = itemKey === 'our_team' || itemKey.includes('team') || formData.type === 'Team Directory'
  const isAboutVideo = itemKey === 'about_video'
  const isServicePreview = itemKey === 'services_preview'
  const isPortfolio = formData.pageKey === 'portfolio' || formData.type === 'Portfolio Project' || itemKey.includes('project')
  const isService = formData.pageKey === 'service' || formData.type === 'Service Grid' || itemKey.includes('service')
  const isFaq = itemKey.includes('faq') || formData.type === 'FAQ Accordion'
  const isVideoSection =
    isHero ||
    isAboutVideo ||
    isStory ||
    itemKey === 'about_stats' ||
    formData.type === 'Video Showcase' ||
    formData.type === 'Video & Metrics' ||
    formData.mediaType === 'video' ||
    Boolean(formData.image && /\.(mp4|webm|mov|ogg)$/i.test(formData.image))

  const handleDeleteVideo = () => {
    if (formData.image) {
      setLastDeletedVideo(formData.image)
    }
    setFormData((prev) => ({
      ...prev,
      image: '',
      mediaType: 'video',
    }))
  }

  const handleRestoreVideo = () => {
    if (lastDeletedVideo) {
      setFormData((prev) => ({
        ...prev,
        image: lastDeletedVideo,
        mediaType: 'video',
      }))
      setLastDeletedVideo(null)
    }
  }

  // Sync section data whenever section prop changes or drawer opens
  useEffect(() => {
    if (section) {
      const sKey = section.key || ''
      const isHeroSec =
        sKey === 'hero' ||
        sKey.includes('hero') ||
        section.type === 'Hero Video Banner' ||
        (section.title || '').toLowerCase().includes('hero')
      const prepared: SectionItem = {
        ...section,
        key: sKey,
        heading: section.heading || '',
        description: section.description || '',
        title: section.title || (isHeroSec ? 'Hero Video Banner' : section.type || 'Section'),
        badgeText: section.badgeText || '* Docme * Docme * Docme *',
        badgeColor: section.badgeColor || '#F1BE48',
      }
      setFormData(prepared)
      const st = section.stats ? [...section.stats] : []
      const gal = section.galleryImages ? [...section.galleryImages] : []
      const feat = section.features ? [...section.features] : []
      setStatsList(st)
      setGalleryList(gal)
      setFeaturesList(feat)
      setPreviewActiveImage(section.image || '')
      setInitialSnapshot(JSON.stringify({ formData: prepared, stats: st, gallery: gal, features: feat }))
    }
    if (isOpen) {
      setActiveTab(initialTab === 'preview' ? 'preview' : 'content')
      setIsDiscardConfirmOpen(false)
      setIsVideoPlaying(true)
    }
  }, [section, isOpen, initialTab])

  // Track if changes have been made to prompt before closing
  const isDirty = React.useMemo(() => {
    if (!isOpen || !initialSnapshot) return false
    const current = JSON.stringify({
      formData,
      stats: statsList,
      gallery: galleryList,
      features: featuresList,
    })
    return current !== initialSnapshot
  }, [isOpen, initialSnapshot, formData, statsList, galleryList, featuresList])

  const handleRequestClose = () => {
    if (isDirty) {
      setIsDiscardConfirmOpen(true)
    } else {
      onClose()
    }
  }

  // Close on Escape key (with dirty protection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isDiscardConfirmOpen) {
          setIsDiscardConfirmOpen(false)
        } else {
          handleRequestClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isDiscardConfirmOpen, isDirty, onClose])

  // Prevent background scroll when drawer is open
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

  // Handle Stat additions & removals
  const handleAddStat = () => {
    if (!newStatValue.trim() && !newStatLabel.trim()) return
    const updated = [...statsList, { value: newStatValue.trim(), label: newStatLabel.trim() }]
    setStatsList(updated)
    setFormData((prev) => ({ ...prev, stats: updated }))
    setNewStatValue('')
    setNewStatLabel('')
  }

  const handleRemoveStat = (index: number) => {
    const updated = statsList.filter((_, i) => i !== index)
    setStatsList(updated)
    setFormData((prev) => ({ ...prev, stats: updated.length > 0 ? updated : undefined }))
  }

  const handleUpdateStat = (index: number, field: 'value' | 'label', val: string) => {
    const updated = statsList.map((st, i) => (i === index ? { ...st, [field]: val } : st))
    setStatsList(updated)
    setFormData((prev) => ({ ...prev, stats: updated }))
  }

  // Handle Gallery additions & removals
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return
    const updated = [...galleryList, newGalleryUrl.trim()]
    setGalleryList(updated)
    setFormData((prev) => ({ ...prev, galleryImages: updated }))
    setNewGalleryUrl('')
  }

  const handleRemoveGalleryImage = (index: number) => {
    const updated = galleryList.filter((_, i) => i !== index)
    setGalleryList(updated)
    setFormData((prev) => ({ ...prev, galleryImages: updated.length > 0 ? updated : undefined }))
  }

  // Handle Sub-Services / Features additions & removals
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return
    const updated = [...featuresList, newFeatureText.trim()]
    setFeaturesList(updated)
    setFormData((prev) => ({ ...prev, features: updated }))
    setNewFeatureText('')
  }

  const handleRemoveFeature = (index: number) => {
    const updated = featuresList.filter((_, i) => i !== index)
    setFeaturesList(updated)
    setFormData((prev) => ({ ...prev, features: updated.length > 0 ? updated : undefined }))
  }

  const handleUpdateFeature = (index: number, val: string) => {
    const updated = featuresList.map((f, i) => (i === index ? val : f))
    setFeaturesList(updated)
    setFormData((prev) => ({ ...prev, features: updated }))
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    const updated: SectionItem = {
      ...formData,
      title: formData.title || (isHero ? 'Hero Video Banner' : formData.type || 'Section'),
      stats: statsList.length > 0 ? statsList : undefined,
      galleryImages: galleryList.length > 0 ? galleryList : undefined,
      features: featuresList.length > 0 ? featuresList : undefined,
      lastModified: new Date().toISOString().split('T')[0],
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessToast(true)

      if (onSave) {
        onSave(updated)
      }
      if (onSuccess) {
        onSuccess()
      }

      setTimeout(() => {
        setShowSuccessToast(false)
        onClose()
      }, 900)
    }, 500)
  }

  const handleSubmit = handleSave

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002'
  const livePageUrl = `${webUrl}${formData.pageSlug}`

  if (!mounted || typeof document === 'undefined' || (!isOpen && !isDiscardConfirmOpen)) return null

  return createPortal(
    <>
      {/* Dimmed Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 z-[99] touch-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleRequestClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Side Sheet Drawer (Full-Height: Top to Bottom, 100% Viewport Docked) */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] h-screen max-h-screen w-full max-w-[640px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden overscroll-contain transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none invisible'
        }`}
      >
        {/* Drawer Top Header */}
        <div className="shrink-0 px-6 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Rounded Squircle Icon Box */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center shrink-0">
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="w-1.5 h-3.5 rounded-full bg-amber-500" />
                  <span className="w-1.5 h-5 rounded-full bg-amber-400" />
                </div>
              </div>

              {/* Title Text in Clean Typography */}
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
                  {formData.heading || formData.title || (isHero ? 'Hero video banner' : isService ? 'New Service Capability' : 'Section settings')}
                </h2>
              </div>
            </div>

            {/* Clean Minimal Close Button */}
            <button
              type="button"
              onClick={handleRequestClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Modern Segmented Navigation Tab Bar */}
        <div className="shrink-0 px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-slate-700" />
              <span>Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Ready to Sync</span>
              </span>
            )}
          </div>
        </div>

        {/* ================= TAB 1: PREVIEW DETAILS ================= */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200/80 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Top Quick Inspector Pill Bar */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  key: {formData.key}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-medium">
                  Route: <code className="font-mono text-slate-800 font-bold">{formData.pageSlug || '/'}</code>
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 text-[11px]">
                  Order #{formData.order}
                </span>
              </div>
            </div>

            {/* Media / Visual Showcase Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-950 overflow-hidden shadow-sm relative group">
              {/* If Video */}
              {isVideoSection || formData.mediaType === 'video' || (formData.image && /\.(mp4|webm|mov|ogg)$/i.test(formData.image)) ? (
                formData.image ? (
                  <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                    <video
                      ref={previewVideoRef}
                      key={formData.image}
                      src={formData.image}
                      autoPlay
                      loop
                      muted={isVideoMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Floating Video Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex items-center justify-between pointer-events-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                          <Video className="w-3 h-3 text-indigo-400" />
                          <span>Live Video Stream</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={togglePreviewVideoMute}
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer"
                            title={isVideoMuted ? "Unmute" : "Mute"}
                          >
                            {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={togglePreviewVideoPlay}
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer"
                            title={isVideoPlaying ? "Pause" : "Play"}
                          >
                            {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pointer-events-auto flex-wrap">
                        <p className="text-xs font-mono text-slate-300 truncate max-w-[280px]">{formData.image}</p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveTab('content')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600/90 hover:bg-indigo-600 rounded-lg shadow-xs cursor-pointer transition-colors backdrop-blur-md"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Edit Media</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteVideo}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-rose-600/90 hover:bg-rose-600 rounded-lg shadow-xs cursor-pointer transition-colors backdrop-blur-md"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900 flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {lastDeletedVideo ? 'Video Removed from Section' : 'No Media Uploaded Yet'}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        {lastDeletedVideo
                          ? 'The video for this section is deleted. Click “Save & Update Website” to apply this change live, or replace below.'
                          : 'This section currently does not have a video asset. Upload or choose a media asset in the Content tab, or delete this section.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Upload / Replace Media</span>
                      </button>
                      {lastDeletedVideo && (
                        <button
                          type="button"
                          onClick={handleRestoreVideo}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Restore Deleted Video</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : isBrands || formData.mediaType === 'logos' ? (
                /* Partner Brands Logo Showcase */
                <div className="bg-slate-900 p-6 space-y-4">
                  <div className="flex items-center justify-between text-white/80">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Partner Brand Logos ({galleryList.length || 10} logos)
                    </span>
                    <span className="text-[10px] font-mono bg-black/50 px-2 py-0.5 rounded text-emerald-400">
                      Auto-Marquee Connected
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {(galleryList.length > 0 ? galleryList : [
                      '/assets/companies/image 711.png',
                      '/assets/companies/1.png',
                      '/assets/companies/2.png',
                      '/assets/companies/3.png',
                      '/assets/companies/4.png',
                      '/assets/companies/5.png',
                      '/assets/companies/7.png',
                      '/assets/companies/8.png',
                    ]).map((logoUrl, i) => (
                      <div
                        key={i}
                        className="h-14 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 p-2 flex items-center justify-center transition-all group/logo"
                      >
                        <img
                          src={logoUrl}
                          alt="Brand Logo"
                          className="max-h-full max-w-full object-contain filter brightness-100 group-hover/logo:scale-110 transition-transform"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/assets/companies/image 711.png'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Image asset */
                <div className="relative w-full aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={previewActiveImage || formData.image}
                    alt={formData.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {formData.mediaType.toUpperCase()} ASSET
                      </span>
                      <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md text-slate-300 px-2 py-0.5 rounded-md">
                        {formData.key}
                      </span>
                    </div>
                    <div className="text-white">
                      <p className="text-xs font-mono text-slate-300 truncate">{previewActiveImage || formData.image}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-asset gallery thumbnail picker (for Bento grid, services, showcase) */}
              {galleryList && galleryList.length > 0 && !isBrands && (
                <div className="bg-slate-900/95 border-t border-white/10 p-3">
                  <div className="flex items-center justify-between mb-2 text-white">
                    <span className="text-[11px] font-medium text-slate-300">
                      Gallery Assets ({galleryList.length} items)
                    </span>
                    <span className="text-[10px] text-slate-400">Click thumbnail to inspect</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1">
                    {galleryList.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewActiveImage(imgUrl)}
                        className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          (previewActiveImage || formData.image) === imgUrl
                            ? 'border-indigo-400 ring-2 ring-indigo-400/30 scale-105'
                            : 'border-white/20 hover:border-white/50 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=200&q=80'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

              {/* Rotating Circular Badge Preview (for Our Story / About Intro) */}
              {(isStory || isAboutIntro) && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-4">
                  <div className="w-14 h-14 relative shrink-0">
                    <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                      <defs>
                        <path id="previewBadgePath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
                      </defs>
                      <text className="text-[9.5px] font-bold uppercase tracking-[0.25em]" fill="#d97706">
                        <textPath href="#previewBadgePath" startOffset="0%" textLength="213">
                          {formData.badgeText || '* Docme * Docme * Docme *'}
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-950">Rotating Brand Badge</p>
                    <p className="text-[11px] text-amber-800 font-mono mt-0.5">
                      Text: &ldquo;{formData.badgeText || '* Docme * Docme * Docme *'}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Call to Action Button */}
              {formData.cta?.label && (
                <div className="pt-2 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs">
                    <span>{formData.cta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Links to: <span className="text-slate-700 font-semibold">{formData.cta.url}</span>
                  </span>
                </div>
              )}

            {/* Impact Numbers / Stats Cards */}
            {statsList && statsList.length > 0 && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <span>Impact Statistics &amp; Metrics</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {statsList.length} metrics
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {statsList.map((st, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
                    >
                      <p className="text-2xl font-bold text-slate-900 tracking-tight">{st.value}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{st.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Services & Features Strip */}
            {featuresList && featuresList.length > 0 && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>Sub-Services &amp; Capabilities</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {featuresList.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {featuresList.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950 font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: EDIT CONTENT FORM ================= */}
        {activeTab === 'content' && (
          <form
            id="drawer-section-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200/80 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {/* ================= SECTION CONTENT ================= */}
              <div className="space-y-4">

                {/* Main Heading Text */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Main Heading Text (Shown on Website)
                    </label>
                    <div className="text-[11px] font-medium">
                      {(formData.heading || '').length <= 70 ? (
                        <span className="text-slate-500">
                          {(formData.heading || '').length} <span className="text-slate-400">/ 70 chars</span>
                        </span>
                      ) : (formData.heading || '').length <= 90 ? (
                        <span className="text-amber-600 font-medium">
                          {(formData.heading || '').length} <span className="text-amber-500/80">/ 70 (long)</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 font-semibold">
                          {(formData.heading || '').length} <span className="text-rose-500/80">/ 70 (may wrap)</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.heading || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        heading: e.target.value,
                        title: (!prev.title || prev.title.startsWith('Service Capability') || prev.title.startsWith('New Service')) ? (e.target.value || prev.title) : prev.title
                      }))
                    }
                    className="w-full text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-900"
                    placeholder={isService ? "e.g. Academic Management or Cloud ERP Integration" : "e.g. We Deliver the Software You Need, No More No Less"}
                    required
                  />
                </div>

                {/* Body Paragraph / Description (Not applicable for Trusted Partners & Brands marquee) */}
                {!isBrands && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Body Paragraph / Copy (Shown on Website)
                      </label>
                      <div className="text-[11px] font-medium">
                        {(formData.description || '').length <= 220 ? (
                          <span className="text-slate-500">
                            {(formData.description || '').length} <span className="text-slate-400">/ 220 chars</span>
                          </span>
                        ) : (formData.description || '').length <= 280 ? (
                          <span className="text-amber-600 font-medium">
                            {(formData.description || '').length} <span className="text-amber-500/80">/ 220 (long)</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">
                            {(formData.description || '').length} <span className="text-rose-500/80">/ 220 (lengthy)</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white resize-y"
                      placeholder={isService ? "Enter service overview, key enterprise capabilities, and institutional value..." : "Enter section body copy as it appears on the public website..."}
                      required={!isBrands}
                    />
                  </div>
                )}

                {/* ================= SECTION-WISE DEDICATED OPTIONS ================= */}

                {/* 1. HERO OPTIONS */}
                {isHero && (
                  <div className="space-y-4">
                    {/* Shadcn UI Media Upload for Hero Section */}
                    <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
                      <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-slate-700" />
                        <span>Hero Media Asset</span>
                        <span className="text-[10px] font-normal text-slate-500">(Video or Image)</span>
                      </label>

                      {/* File Card if file exists, else Dropzone */}
                      {formData.image ? (
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
                                {formData.mediaType === 'video' ? (
                                  <video
                                    key={formData.image}
                                    src={formData.image}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={formData.image}
                                    alt="Hero asset preview"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[240px]">
                                    {formData.image.startsWith('blob:')
                                      ? 'Uploaded Media File'
                                      : formData.image.split('/').pop() || 'Hero Banner Asset'}
                                  </p>
                                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-slate-200/80 text-slate-700">
                                    {formData.mediaType}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                                  {formData.image.startsWith('blob:')
                                    ? 'Preview ready • Click Save to sync'
                                    : formData.image}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {formData.mediaType !== 'video' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCropTargetImage(formData.image)
                                    setIsCropModalOpen(true)
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 shadow-2xs transition-all active:scale-95"
                                  title="Crop and frame image"
                                >
                                  <Crop className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Crop</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => heroFileInputRef.current?.click()}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 shadow-2xs transition-all active:scale-95"
                              >
                                <RefreshCw className="w-3 h-3 text-slate-500" />
                                <span>Replace</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleDeleteVideo}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove / Delete video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Image Crop Prompt Bar (Shadcn style) */}
                          {formData.mediaType !== 'video' && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Crop className="w-3.5 h-3.5 text-indigo-600" />
                                <span className="text-[11px]">Need to adjust framing? (16:9 Hero preset available)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setCropTargetImage(formData.image)
                                  setIsCropModalOpen(true)
                                }}
                                className="font-semibold text-indigo-600 hover:text-indigo-800 text-[11px] inline-flex items-center gap-1 hover:underline"
                              >
                                <span>Crop Image</span>
                                <span>→</span>
                              </button>
                            </div>
                          )}

                          {/* Upload Progress Bar */}
                          {isHeroUploading && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-600 font-medium">Uploading to website...</span>
                                <span className="font-semibold text-slate-900">{heroUploadProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                                  style={{ width: `${heroUploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Shadcn Dropzone */
                        <div
                          onDragOver={(e) => {
                            e.preventDefault()
                            setIsHeroDragOver(true)
                          }}
                          onDragLeave={() => setIsHeroDragOver(false)}
                          onDrop={handleHeroDrop}
                          onClick={() => heroFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer group ${
                            isHeroDragOver
                              ? 'border-slate-900 bg-slate-50'
                              : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 group-hover:scale-105 group-hover:text-slate-900 transition-all mb-2">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-900 group-hover:underline">Click to upload</span> or drag and drop
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            MP4, WebM, MOV, PNG or JPG (up to 100MB)
                          </p>

                          {isHeroUploading && (
                            <div className="w-full max-w-xs mt-3 space-y-1">
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                                  style={{ width: `${heroUploadProgress}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium">Uploading {heroUploadProgress}%...</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hidden File Input */}
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleHeroFileUpload(f)
                        }}
                        className="hidden"
                      />

                      {heroUploadError && (
                        <p className="text-[11px] text-rose-500 font-medium">{heroUploadError}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. PARTNER BRANDS & LOGOS OPTIONS */}
                {isBrands && (
                  <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Partner Logos Cloud ({galleryList.length || 10} Brands)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      These brand logos animate across the homepage partner marquee cloud.
                    </p>
                    <div className="grid grid-cols-5 gap-2 pt-1">
                      {galleryList.slice(0, 10).map((logo, idx) => (
                        <div key={idx} className="relative group/logo h-12 bg-white rounded-xl border border-slate-200/80 p-2 flex items-center justify-center shadow-2xs">
                          <img src={logo} alt={`Brand ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity"
                            title="Remove logo"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. IMPACT NUMBERS & METRICS OPTIONS */}
                {isImpact && (
                  <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Key Impact Counters &amp; Statistics ({statsList.length} Metrics)
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      These numbers animate dynamically on scroll on the website.
                    </p>
                    <div className="space-y-2">
                      {statsList.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                          <div className="w-24 shrink-0">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Number</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                              className="w-full text-xs font-bold text-slate-900 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="700+"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase">Metric Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                              className="w-full text-xs text-slate-700 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="Projects delivered globally..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStat(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors mt-3"
                            title="Remove metric"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Add Stat Row */}
                    <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. 500+)"
                        value={newStatValue}
                        onChange={(e) => setNewStatValue(e.target.value)}
                        className="w-28 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Label (e.g. Active Enterprises)"
                        value={newStatLabel}
                        onChange={(e) => setNewStatLabel(e.target.value)}
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddStat}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Metric</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. OUR STORY NARRATIVE & VIDEO OPTIONS */}
                {isStory && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-slate-900">
                            Story Circular Motion Video
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Circular Mask
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-900 border-2 border-purple-200 shrink-0 relative">
                          <video src={formData.image} className="w-full h-full object-cover" autoPlay muted loop />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value, mediaType: 'video' }))}
                            className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-white"
                            placeholder="/assets/Our Story/teamcarbon006_pindown.io_1779772021.mp4"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Story CTA */}
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-800">About Page Link</span>
                        <p className="text-[11px] text-slate-500">CTA button linking to the About Us story page.</p>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                        {formData.cta?.label || 'About us →'} ({formData.cta?.url || '/about'})
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. BENTO FEATURE GRID OPTIONS */}
                {isBento && (
                  <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Bento Grid Feature Mockups ({galleryList.length || 4} Cards)
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {galleryList.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 relative">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. PRODUCT SHOWCASE OPTIONS */}
                {isProduct && (
                  <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Product Showcase Dashboard Mockup
                        </span>
                      </div>
                    </div>
                    <div className="h-32 rounded-xl overflow-hidden bg-slate-950 border border-amber-200">
                      <img src={formData.image} alt="Product Demo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* 7. LEADERSHIP TEAM OPTIONS */}
                {isTeam && (
                  <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Leadership &amp; Team Gallery ({galleryList.length || 3} Members)
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Photos and avatar cards displayed in the About Us leadership team directory.
                    </p>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {galleryList.map((photo, idx) => (
                        <div key={idx} className="relative group/photo h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-900">
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                            title="Remove photo"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add member photo URL..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 7.5. ABOUT INTRO & ROTATING BADGE OPTIONS */}
                {isAboutIntro && (
                  <div className="space-y-4">
                    {/* Header info badge */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Website About Section Manager
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            /about#about
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          Controls the headline, mission statement, featured photograph, and interactive spinning brand badge at the top of the About Us page.
                        </p>
                      </div>
                    </div>

                    {/* Featured Image Upload & Crop */}
                    <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4 text-slate-700" />
                          <span>Featured About Photography</span>
                          <span className="text-[10px] font-normal text-slate-500">(Rendered with rounded-[2.5rem] card)</span>
                        </label>
                        {formData.image && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Asset Active
                          </span>
                        )}
                      </div>

                      {/* File Card or Dropzone */}
                      {formData.image ? (
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                                <img
                                  src={formData.image}
                                  alt="About asset preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-900 truncate max-w-[240px]">
                                  {formData.image.startsWith('blob:')
                                    ? 'Uploaded Media File'
                                    : formData.image.split('/').pop() || 'About Us Cover Image'}
                                </p>
                                <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                                  {formData.image.startsWith('blob:')
                                    ? 'Preview ready • Click Save to sync'
                                    : formData.image}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setCropTargetImage(formData.image)
                                  setIsCropModalOpen(true)
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 shadow-2xs transition-all active:scale-95"
                                title="Crop and frame image"
                              >
                                <Crop className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Crop</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => aboutFileInputRef.current?.click()}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 shadow-2xs transition-all active:scale-95"
                              >
                                <RefreshCw className="w-3 h-3 text-slate-500" />
                                <span>Replace</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    image: '',
                                  }))
                                }
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove asset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Image Crop Prompt */}
                          <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Crop className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="text-[11px]">Adjust framing for the website's rounded-[2.5rem] card</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCropTargetImage(formData.image)
                                setIsCropModalOpen(true)
                              }}
                              className="font-semibold text-indigo-600 hover:text-indigo-800 text-[11px] inline-flex items-center gap-1 hover:underline"
                            >
                              <span>Crop Image</span>
                              <span>→</span>
                            </button>
                          </div>

                          {/* Upload Progress Bar */}
                          {isAboutUploading && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-600 font-medium">Uploading to website...</span>
                                <span className="font-semibold text-slate-900">{aboutUploadProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                                  style={{ width: `${aboutUploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault()
                            setIsAboutDragOver(true)
                          }}
                          onDragLeave={() => setIsAboutDragOver(false)}
                          onDrop={handleAboutDrop}
                          onClick={() => aboutFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer group ${
                            isAboutDragOver
                              ? 'border-slate-900 bg-slate-50'
                              : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 group-hover:scale-105 group-hover:text-slate-900 transition-all mb-2">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-900 group-hover:underline">Click to upload photo</span> or drag and drop
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            PNG, JPG, or WebP (up to 20MB)
                          </p>

                          {isAboutUploading && (
                            <div className="w-full max-w-xs mt-3 space-y-1">
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                                  style={{ width: `${aboutUploadProgress}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium">Uploading {aboutUploadProgress}%...</p>
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        ref={aboutFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleAboutFileUpload(f)
                        }}
                        className="hidden"
                      />

                      {aboutUploadError && (
                        <p className="text-[11px] text-rose-500 font-medium">{aboutUploadError}</p>
                      )}
                    </div>

                    {/* Signature Rotating Circular Badge Designer */}
                    <div className="p-4 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RotateCw className="w-4 h-4 text-amber-600 animate-[spin_8s_linear_infinite]" />
                          <span className="text-xs font-bold text-slate-900">
                            Signature Rotating Circular Badge
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                          Interactive SVG
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        {/* Interactive mini live preview of the badge */}
                        <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-amber-200/80 shadow-xs">
                          <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-md border border-slate-100">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]">
                              <path id="circleBadgePathPreview" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
                              <text className="text-[10px] font-bold uppercase tracking-[0.25em] fill-slate-800">
                                <textPath href="#circleBadgePathPreview" startOffset="0%" textLength="213">
                                  {formData.badgeText || '* Docme * Docme * Docme *'}
                                </textPath>
                              </text>
                            </svg>
                            <div
                              style={{ backgroundColor: formData.badgeColor || '#F1BE48' }}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 z-10 shadow-sm"
                            >
                              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium mt-2">
                            Live Animation
                          </span>
                        </div>

                        {/* Badge Controls */}
                        <div className="sm:col-span-2 space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[11px] font-semibold text-slate-700">
                                Circular Rotating Text
                              </label>
                              <span className="text-[10px] text-slate-400">
                                {(formData.badgeText || '* Docme * Docme * Docme *').length} chars
                              </span>
                            </div>
                            <input
                              type="text"
                              value={formData.badgeText || '* Docme * Docme * Docme *'}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, badgeText: e.target.value }))
                              }
                              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                              placeholder="* Docme * Docme * Docme *"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Center Button Target URL / Anchor
                            </label>
                            <input
                              type="text"
                              value={formData.cta?.url || '#about'}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  cta: { label: prev.cta?.label || 'Discover DocMe', url: e.target.value },
                                }))
                              }
                              className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                              placeholder="#about or /about"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                              <Palette className="w-3.5 h-3.5 text-amber-600" />
                              <span>Badge Center Button Color</span>
                            </label>
                            <div className="flex items-center gap-2 flex-wrap">
                              {[
                                { name: 'Gold', hex: '#F1BE48' },
                                { name: 'Sky', hex: '#0ea5e9' },
                                { name: 'Indigo', hex: '#6366f1' },
                                { name: 'Emerald', hex: '#10b981' },
                                { name: 'Rose', hex: '#f43f5e' },
                                { name: 'Slate', hex: '#0f172a' },
                              ].map((col) => (
                                <button
                                  key={col.hex}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, badgeColor: col.hex }))}
                                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                    (formData.badgeColor || '#F1BE48') === col.hex
                                      ? 'scale-125 border-slate-900 shadow-sm'
                                      : 'border-white hover:scale-110 shadow-2xs'
                                  }`}
                                  style={{ backgroundColor: col.hex }}
                                  title={`${col.name} (${col.hex})`}
                                />
                              ))}
                              <div className="flex items-center gap-1.5 ml-2">
                                <input
                                  type="color"
                                  value={formData.badgeColor || '#F1BE48'}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, badgeColor: e.target.value }))}
                                  className="w-6 h-6 rounded border-0 cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[11px] font-mono text-slate-600 uppercase">
                                  {formData.badgeColor || '#F1BE48'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. PORTFOLIO SHOWCASE OPTIONS */}
                {isPortfolio && (
                  <div className="space-y-4">
                    {/* Launch Inner Section Studio Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/90 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-emerald-600" />
                          <span>Project Inner Section Studio</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Inner Page
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        View and customize the complete inner project page, including the executive overview, feature breakdown images &amp; text, high-res screenshots gallery, and interactive CTA.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setInnerSectionModalMode('view')
                            setIsInnerSectionModalOpen(true)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Inner Section</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInnerSectionModalMode('edit')
                            setIsInnerSectionModalOpen(true)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
                          <span>Edit Inner Section &amp; Media</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FolderPlus className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900">
                            Portfolio Mockups &amp; Screenshots ({galleryList.length || 3} Slides)
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {galleryList.map((mockup, idx) => (
                          <div key={idx} className="relative group/mockup h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-900">
                            <img src={mockup} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/mockup:opacity-100 transition-opacity"
                              title="Remove mockup"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add project screenshot URL..."
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryImage}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Mockup</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. SERVICE CAPABILITY OPTIONS & SUB-SERVICES */}
                {isService && (
                  <div className="space-y-4">
                    {/* Sub-Services / Feature Points */}
                    <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-slate-900">
                            Service Sub-Services &amp; Key Features ({featuresList.length} items)
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Website Bullet Points
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        These sub-services appear as key bullet points under this service on the live website (e.g. Student Information Management, Attendance Tracking).
                      </p>

                      {featuresList.length === 0 ? (
                        <div className="p-3 bg-white/90 rounded-xl border border-amber-200/60 text-center">
                          <p className="text-xs font-medium text-amber-900/70">
                            No sub-services added yet. Add key capability bullet points below.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {featuresList.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                              <span className="w-5 h-5 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                                className="flex-1 text-xs font-medium px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-900"
                                placeholder="Sub-service name (e.g. Student Information Management)"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Remove sub-service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add new sub-service (e.g. Learning Management Integration)..."
                          value={newFeatureText}
                          onChange={(e) => setNewFeatureText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddFeature()
                            }
                          }}
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Sub-Service</span>
                        </button>
                      </div>
                    </div>

                    {/* Service SLA Guarantees */}
                    <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-bold text-slate-900">
                            Service SLA Guarantees ({statsList.length} Metrics)
                          </span>
                        </div>
                      </div>
                      {statsList.length === 0 ? (
                        <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 text-center">
                          <p className="text-xs font-medium text-amber-900/70">
                            No SLA metrics added yet. Add fresh metrics below (e.g., 99.99% Uptime SLA).
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {statsList.map((stat, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                                className="w-24 text-xs font-bold px-2 py-1 rounded-lg border border-slate-200"
                                placeholder="99.99%"
                              />
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                                className="flex-1 text-xs px-2 py-1 rounded-lg border border-slate-200"
                                placeholder="Uptime SLA"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveStat(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Value (e.g. 99.99%)"
                          value={newStatValue}
                          onChange={(e) => setNewStatValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddStat()
                            }
                          }}
                          className="w-28 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Label (e.g. Uptime SLA)"
                          value={newStatLabel}
                          onChange={(e) => setNewStatLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddStat()
                            }
                          }}
                          className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddStat}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors shrink-0 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add SLA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. FAQ ACCORDION OPTIONS */}
                {isFaq && (
                  <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-bold text-slate-900">
                          FAQ Question &amp; Answer Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Accordion
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5">
                      <p className="text-xs font-bold text-slate-900">
                        Q: {formData.heading || 'Frequently Asked Question'}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        A: {formData.description || 'Answer will display here inside the accordion dropdown on the public contact page.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 11. GENERAL CALL TO ACTION BUTTON */}
                {!isHero && !isBrands && !isStory && !isBento && !isProduct && !isAboutIntro && (
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-800">
                          Call to Action Button (Optional)
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.cta?.label || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cta: { label: e.target.value, url: prev.cta?.url || '/' },
                          }))
                        }
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                        placeholder="Button Label"
                      />
                      <input
                        type="text"
                        value={formData.cta?.url || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cta: { label: prev.cta?.label || 'Explore', url: e.target.value },
                          }))
                        }
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                        placeholder="Button URL"
                      />
                    </div>
                  </div>
                )}

                {/* Section Publishing Status (Live on Website vs Hidden) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Website Visibility Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: 'Published' }))}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        formData.status === 'Published'
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          formData.status === 'Published' ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold">Live on Website</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Section is visible to visitors on the public site.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: 'Draft' }))}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        formData.status === 'Draft'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <EyeOff
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          formData.status === 'Draft' ? 'text-amber-600' : 'text-slate-400'
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold">Hidden (Draft)</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Section is hidden from public view.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

            {/* ================= PRIMARY MEDIA ASSET (SHADCN UPLOAD) ================= */}
            {!isHero && !isAboutIntro && !isBrands && (
              <div className="space-y-4">
                {/* Hidden File Input for Native File Picker */}
                <input
                  ref={mediaFileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleGeneralMediaFileUpload(file)
                  }}
                  className="hidden"
                />

                {/* Shadcn UI Upload Card */}
                <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-indigo-600" />
                      <span>{isService ? 'Service Offering Visual Asset' : 'Section Media Asset'}</span>
                      <span className="text-[10px] font-normal text-slate-500">(Image or Video)</span>
                    </label>
                    {formData.image && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Asset Active
                      </span>
                    )}
                  </div>

                  {/* Shadcn Dropzone or Active File Card */}
                  {formData.image ? (
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                            {formData.mediaType === 'video' ? (
                              <video
                                key={formData.image}
                                src={formData.image}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={formData.image}
                                alt="Section asset preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
                                }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-xs font-semibold text-slate-900 truncate max-w-[240px]">
                                {formData.image.startsWith('blob:')
                                  ? 'Uploaded Media File'
                                  : formData.image.split('/').pop() || 'Media Asset'}
                              </p>
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-slate-200/80 text-slate-700">
                                {formData.mediaType}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                              {formData.image.startsWith('blob:')
                                ? 'Preview ready • Click Save to sync'
                                : formData.image}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {formData.mediaType !== 'video' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCropTargetImage(formData.image)
                                setIsCropModalOpen(true)
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 shadow-2xs transition-all active:scale-95"
                              title="Crop and frame image"
                            >
                              <Crop className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Crop</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => mediaFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 shadow-2xs transition-all active:scale-95"
                          >
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteVideo}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove / Delete asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Crop Prompt Bar */}
                      {formData.mediaType !== 'video' && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Crop className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[11px]">Need to adjust framing or aspect ratio?</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCropTargetImage(formData.image)
                              setIsCropModalOpen(true)
                            }}
                            className="font-semibold text-indigo-600 hover:text-indigo-800 text-[11px] inline-flex items-center gap-1 hover:underline"
                          >
                            <span>Crop Image</span>
                            <span>→</span>
                          </button>
                        </div>
                      )}

                      {/* Upload Progress Bar */}
                      {isMediaUploading && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">Uploading to website...</span>
                            <span className="font-semibold text-slate-900">{mediaUploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                              style={{ width: `${mediaUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Shadcn UI Dropzone */
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsMediaDragOver(true)
                      }}
                      onDragLeave={() => setIsMediaDragOver(false)}
                      onDrop={handleGeneralMediaDrop}
                      onClick={() => mediaFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer group ${
                        isMediaDragOver
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 group-hover:scale-105 group-hover:text-indigo-600 transition-all mb-2.5">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-slate-700">
                        <span className="font-semibold text-indigo-600 group-hover:underline">Click to upload</span> or drag and drop
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        PNG, JPG, WebP, SVG or MP4 (up to 50MB)
                      </p>

                      {isMediaUploading && (
                        <div className="w-full max-w-xs mt-3 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">Uploading file...</span>
                            <span className="font-semibold text-slate-900">{mediaUploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                              style={{ width: `${mediaUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {mediaUploadError && (
                        <p className="text-xs text-rose-600 font-medium mt-2">{mediaUploadError}</p>
                      )}
                    </div>
                  )}

                  {/* Manual URL entry toggle */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                    >
                      <span>{showManualUrl ? 'Hide manual URL input' : 'Or paste a direct asset URL / file path'}</span>
                      <span className="text-[10px]">{showManualUrl ? '▲' : '▼'}</span>
                    </button>
                    {showManualUrl && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-1">
                          <select
                            value={formData.mediaType}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                mediaType: e.target.value as SectionItem['mediaType'],
                              }))
                            }
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                          >
                            <option value="image">Image (Photo)</option>
                            <option value="video">Video (MP4)</option>
                            <option value="logos">Logo Cloud</option>
                            <option value="gallery">Gallery Grid</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={formData.image}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, image: e.target.value }))
                            }
                            className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                            placeholder="/assets/Feature/dash.jpg or https://..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                {/* Gallery Images List (For sections with multi-assets like Bento, Portfolio) */}
                {galleryList.length > 0 && !isBrands && (
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">
                        Multi-Asset Gallery ({galleryList.length} items)
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Rendered on Site
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1">
                      {galleryList.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl bg-slate-900 border border-slate-200 overflow-hidden group shadow-2xs"
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=200&q=80'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(i)}
                            className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Image URL to Gallery */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <input
                        type="text"
                        placeholder="Add image asset URL (e.g. /assets/companies/1.png)"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Asset</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </form>
        )}

        {/* Universal Drawer Bottom Actions (Active across Content, Media, and Preview tabs) */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-slate-200/90 bg-white flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel / Close
            </button>
          </div>

          {/* Center Unsaved Edits Badge */}
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Edits ready to publish</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Synced with live website</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSubmitting}
              className={`flex items-center gap-2 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                isDirty
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/30 ring-offset-1'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>Syncing to Website...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Save &amp; Update Website</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[110] bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Website section content updated &amp; synced successfully!</span>
        </div>
      )}

      {/* Discard Unsaved Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={isDiscardConfirmOpen}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this section. If you leave now, your edits will be discarded and will not be applied to the website."
        confirmLabel="Discard Changes"
        cancelLabel="Keep Editing"
        isDestructive={true}
        onConfirm={() => {
          setIsDiscardConfirmOpen(false)
          onClose()
        }}
        onCancel={() => setIsDiscardConfirmOpen(false)}
      />


      {/* Shadcn Image Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={cropTargetImage || formData.image}
        onCropComplete={handleCropComplete}
        defaultAspectRatio={16 / 9}
      />

      {/* Portfolio Inner Section Modal */}
      <PortfolioInnerSectionModal
        isOpen={isInnerSectionModalOpen}
        onClose={() => setIsInnerSectionModalOpen(false)}
        section={formData}
        initialMode={innerSectionModalMode}
        onSave={(updated) => {
          setFormData(updated)
          if (updated.galleryImages) setGalleryList(updated.galleryImages)
          if (onSave) onSave(updated)
        }}
      />
    </>,
    document.body
  )
}

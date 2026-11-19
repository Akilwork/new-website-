'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  Move,
  Maximize2,
  Sparkles,
} from 'lucide-react'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedDataUrl: string, croppedBlob?: Blob) => void
  defaultAspectRatio?: number // 16/9 by default for hero
}

interface AspectRatioOption {
  id: string
  label: string
  ratio: number | null
  badge?: string
}

const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { id: '16:9', label: '16:9 Hero', ratio: 16 / 9, badge: 'Recommended' },
  { id: '21:9', label: '21:9 Ultra', ratio: 21 / 9 },
  { id: '4:3', label: '4:3 Classic', ratio: 4 / 3 },
  { id: '1:1', label: '1:1 Square', ratio: 1 },
  { id: 'free', label: 'Original', ratio: null },
]

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  defaultAspectRatio = 16 / 9,
}: ImageCropModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedRatio, setSelectedRatio] = useState<string>('16:9')
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset parameters when opening a new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setSelectedRatio('16:9')
    }
  }, [isOpen, imageSrc])

  // Get active numeric ratio
  const currentRatio = ASPECT_RATIO_OPTIONS.find((r) => r.id === selectedRatio)?.ratio ?? (16 / 9)

  // Handle image load
  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget
    setImageSize({ width: naturalWidth, height: naturalHeight })
    setPan({ x: 0, y: 0 })
  }

  // Mouse / Touch Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      })
    }
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    },
    [isDragging, dragStart]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.min(Math.max(1, +(prev + delta).toFixed(2)), 3))
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setPan({ x: 0, y: 0 })
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Generate cropped output canvas
  const handleApplyCrop = async () => {
    const img = imageRef.current
    const container = containerRef.current
    if (!img || !container) return

    setIsProcessing(true)

    try {
      const containerRect = container.getBoundingClientRect()
      const cropWidth = containerRect.width
      const cropHeight = containerRect.height

      // Target high-resolution canvas size (maintain aspect ratio)
      const targetWidth = Math.min(Math.max(cropWidth * 2, 1280), 2560)
      const targetHeight = Math.round(targetWidth / (currentRatio || cropWidth / cropHeight))

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Fill background
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // Calculate transformations relative to container
      const scaleX = targetWidth / cropWidth
      const scaleY = targetHeight / cropHeight

      ctx.save()
      // Center canvas
      ctx.translate(targetWidth / 2, targetHeight / 2)
      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180)
      // Apply pan & zoom
      const drawX = pan.x * scaleX
      const drawY = pan.y * scaleY
      const drawWidth = cropWidth * zoom * scaleX
      const drawHeight = cropHeight * zoom * scaleY

      // Draw image
      ctx.drawImage(
        img,
        drawX - drawWidth / 2,
        drawY - drawHeight / 2,
        drawWidth,
        drawHeight
      )
      ctx.restore()

      // Convert to blob and dataUrl
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(dataUrl, blob)
          } else {
            onCropComplete(dataUrl)
          }
          setIsProcessing(false)
          onClose()
        },
        'image/jpeg',
        0.92
      )
    } catch (err) {
      console.error('Crop failed:', err)
      // Fallback
      if (imageRef.current?.src) {
        onCropComplete(imageRef.current.src)
      }
      setIsProcessing(false)
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  // Calculate container aspect ratio box dimensions
  const ratioValue = currentRatio || (imageSize.width && imageSize.height ? imageSize.width / imageSize.height : 16 / 9)

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Card */}
      <div
        className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Shadcn style) */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-800 shadow-2xs shrink-0">
              <Crop className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
                  Crop &amp; Frame Image
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Shadcn Cropper
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag to reposition, adjust zoom or switch aspect ratio for optimal website presentation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Preset Selector */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            {ASPECT_RATIO_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRatio(opt.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRatio === opt.id
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label}</span>
                {opt.badge && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold uppercase tracking-wider">
                    {opt.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Move className="w-3.5 h-3.5" />
            <span>Drag image to pan</span>
          </div>
        </div>

        {/* Interactive Cropper Canvas Area */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 flex items-center justify-center overflow-hidden min-h-[340px] max-h-[500px] relative select-none">
          {/* Outer Scrim & Viewport Frame */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              aspectRatio: `${ratioValue}`,
              width: ratioValue > 1 ? '100%' : 'auto',
              height: ratioValue <= 1 ? '100%' : 'auto',
              maxHeight: '440px',
              maxWidth: '100%',
            }}
            className={`relative rounded-xl overflow-hidden border-2 border-white/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.85)] cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
          >
            {/* The Image */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                crossOrigin="anonymous"
                onLoad={handleImageLoaded}
                className="max-w-none w-full h-full object-contain"
                draggable={false}
              />
            </div>

            {/* Rule of Thirds Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Corner Markers (Classic Pro Framing Box) */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white pointer-events-none" />

            {/* Floating Ratio Badge */}
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white border border-white/20">
                {selectedRatio.toUpperCase()} • {Math.round(zoom * 100)}% ZOOM
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls (Zoom Slider, Rotate, Reset) */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Zoom Control Slider */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Zoom:</span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-28 sm:w-44 accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-slate-600 min-w-[40px]">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate & Reset Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRotate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 shadow-2xs transition-all active:scale-95"
              title="Rotate 90 degrees clockwise"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Rotate</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 shadow-2xs transition-all active:scale-95"
              title="Reset zoom, pan and rotation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Modal Footer (Cancel / Apply) */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200/90 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
          >
            {isProcessing ? (
              <span>Applying Crop...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply &amp; Save Crop</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

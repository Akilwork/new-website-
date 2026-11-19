'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import LoadingScreen from './LoadingScreen'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname()
  const isCareerRoute = Boolean(pathname?.startsWith('/career'))

  // Initialize to true only if not a career page, so career pages never show loader even momentarily
  const [isLoading, setIsLoading] = useState<boolean>(() => !isCareerRoute)

  useEffect(() => {
    // Never show loader on career landing pages and sub-routes
    if (isCareerRoute) {
      sessionStorage.setItem('docme_loaded', 'true')
      setIsLoading(false)
      return
    }

    const isForced = window.location.search.includes('loader') || window.location.search.includes('reload')
    const isSkipped = window.location.search.includes('skipLoader')

    if (!isForced && (isSkipped || sessionStorage.getItem('docme_loaded') === 'true')) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)

    // Safety timeout: ensure loader never blocks the page longer than 5.2s
    const safetyTimer = setTimeout(() => {
      sessionStorage.setItem('docme_loaded', 'true')
      setIsLoading(false)
    }, 5200)

    return () => clearTimeout(safetyTimer)
  }, [isCareerRoute])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('docme_loaded', 'true')
    setIsLoading(false)
  }

  const showLoader = isLoading && !isCareerRoute

  return (
    <>
      {showLoader && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      <div className={showLoader ? 'fixed inset-0 overflow-hidden' : ''}>
        {children}
      </div>
    </>
  )
}

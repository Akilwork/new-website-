'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  target?: string
}

const Navigation = () => {
  const pathname = usePathname()
  const isCareerPage = pathname?.startsWith('/career')

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let lastY = typeof window !== 'undefined' ? window.scrollY : 0

    const handleScroll = () => {
      const currentY = window.scrollY

      setScrolled(currentY > 20)

      if (currentY <= 10) {
        setVisible(true)
        lastY = currentY
      } else if (currentY > lastY + 10) {
        setVisible(false)
        lastY = currentY
      } else if (currentY < lastY - 2) {
        setVisible(true)
        lastY = currentY
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation items for the main website
  const mainNavItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Career', href: '/careers', target: '_blank' },
    { name: 'Contact', href: '/contact' },
  ]

  // Navigation items specifically for the Career Training page
  const careerNavItems: NavItem[] = [
    { name: 'Programmes', href: '#programmes' },
    { name: 'Categories', href: '#categories' },
    { name: 'Why Docme', href: '#why-docme' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Mentorship', href: '#coaching' },
    { name: 'Contact', href: '#contact' },
  ]

  const navItems = isCareerPage ? careerNavItems : mainNavItems

  const handleScrollToAnchor = (href: string) => {
    setIsOpen(false)
    if (href.startsWith('#')) {
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isCareerPage
          ? (scrolled
              ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
              : 'bg-transparent')
          : (scrolled 
              ? 'bg-[#080808]/95 backdrop-blur-md shadow-lg border-b border-white/10' 
              : 'bg-[#080808]/85 backdrop-blur-sm')
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              if (isCareerPage) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                window.location.href = '/'
              }
            }}
          >
            <img 
              src="/Docme Logo.png" 
              alt="Docme Logo" 
              className="h-8 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (isCareerPage) {
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleScrollToAnchor(item.href)
                    }}
                    whileHover={{ y: -2 }}
                    className={`${isCareerPage && scrolled ? 'text-slate-600 hover:text-slate-950' : 'text-zinc-200 hover:text-white'} transition-colors duration-200 cursor-pointer font-medium text-sm tracking-wide`}
                  >
                    {item.name}
                  </motion.a>
                )
              }

              if (item.target === '_blank') {
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer font-medium text-sm tracking-wide group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                )
              }

              if (item.name === 'Home') {
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    whileHover={{ y: -2 }}
                    className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer font-medium text-sm tracking-wide"
                    onClick={(e) => { e.preventDefault(); window.location.href = '/' }}
                  >
                    {item.name}
                  </motion.a>
                )
              }

              return (
                <Link key={item.name} href={item.href} passHref legacyBehavior>
                  <motion.a
                    whileHover={{ y: -2 }}
                    className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer font-medium text-sm tracking-wide"
                  >
                    {item.name}
                  </motion.a>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className={`md:hidden p-2 ${isCareerPage && scrolled ? 'text-slate-700 hover:text-slate-950' : 'text-white'} transition-colors cursor-pointer`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${isCareerPage ? 'bg-white/98 text-slate-800 border-t border-slate-200 shadow-xl' : 'bg-[#080808]/98 text-gray-300 border-t border-white/10'} backdrop-blur-xl`}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                if (isCareerPage) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        handleScrollToAnchor(item.href)
                      }}
                    >
                      {item.name}
                    </a>
                  )
                }

                if (item.target === '_blank') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-60" />
                    </a>
                  )
                }

                if (item.name === 'Home') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsOpen(false)
                        window.location.href = '/'
                      }}
                    >
                      {item.name}
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation

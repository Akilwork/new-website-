'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Monitor, 
  Smartphone, 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Shield,
  Bell,
  Layers,
  Zap,
  Award,
  LucideIcon
} from 'lucide-react'
import { useSections } from '@/lib/useSections'
import { ProductShowcaseFeature } from '@/lib/sectionsData'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Smartphone,
  BarChart3,
  Monitor,
  CheckCircle,
  Sparkles,
  Shield,
  Bell,
  Layers,
  Zap,
  Award,
}

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

const ProductShowcase = () => {
  const router = useRouter()
  const { getSection } = useSections()
  const sec = getSection('product_showcase') || getSection('sec-home-product')

  const heading = sec?.heading || 'Experience DocMe in Action'
  const description =
    sec?.description ||
    'Attendance automation with facial recognition, parent communication portal, automated fees tracking, GPS bus monitoring, and real-time executive analytics.'
  const imageSrc = sec?.image || '/assets/Feature/BM One.jpg'
  const mediaType = sec?.mediaType || 'image'

  const stats = (sec?.stats && sec.stats.length > 0) ? sec.stats : [
    { value: '50+', label: 'Schools Using' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '24/7', label: 'Support' },
  ]

  const cta = sec?.cta || {
    label: 'View Full Case Study',
    url: '/portfolio',
  }

  const featuresList = (sec?.productFeatures && sec.productFeatures.length > 0)
    ? sec.productFeatures
    : defaultFeatures

  if (sec?.status === 'Draft') return null

  return (
    <section className="section-spacing relative overflow-hidden bg-[#080808]">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative site-container">
        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 sm:gap-12 xl:gap-20 items-start">

          {/* Left Column: Title · Stats · CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-28 space-y-8 sm:space-y-10"
          >
            {/* Headline */}
            <div className="space-y-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.6rem] font-bold font-jakarta leading-[1.1] tracking-tight text-white whitespace-pre-line">
                {heading}
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-[26rem]">
                {description}
              </p>
            </div>

            {/* Stats Glass Cards */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-4 text-center
                             backdrop-blur-sm overflow-hidden group
                             hover:border-indigo-500/30 transition-colors duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="text-2xl font-bold text-white mb-1 font-jakarta">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              onClick={() => router.push(cta.url || '/portfolio')}
              whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(99, 102, 241, 0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5
                         bg-indigo-600 text-white rounded-xl font-semibold
                         hover:bg-indigo-500 transition-all duration-300 cursor-pointer"
            >
              <span>{cta.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right Column: Product Image/Video · Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-5"
          >
            {/* Product Media */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

              {mediaType === 'video' ? (
                <video
                  src={imageSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover max-h-[460px]"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={heading}
                  className="w-full h-auto object-cover max-h-[460px]"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/assets/Feature/BM One.jpg'
                  }}
                />
              )}
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuresList.map((feature, index) => {
                const IconComponent = (feature.icon && ICON_MAP[feature.icon]) ? ICON_MAP[feature.icon] : Sparkles
                return (
                  <motion.div
                    key={feature.title + index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="group flex items-start gap-3 p-3.5 rounded-xl
                               border border-white/5 bg-white/[0.03]
                               hover:border-indigo-500/25 hover:bg-white/[0.07]
                               transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-7 h-7 bg-indigo-600/80 rounded-lg flex items-center
                                    justify-center flex-shrink-0 mt-0.5
                                    group-hover:bg-indigo-500 transition-colors duration-300">
                      <IconComponent className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-0.5 leading-snug">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-500 leading-snug">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default ProductShowcase

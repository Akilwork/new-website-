'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useSections } from '@/lib/useSections'
import {
  Users,
  Share2,
  Gauge,
  BarChart3,
  Sliders,
  Check,
  CheckCircle2,
  Sparkles,
  Clock,
  Download,
  Zap,
  ArrowRight,
} from 'lucide-react'

const ServicesSection = () => {
  const router = useRouter()
  const { getSection } = useSections()
  const sec = getSection('services_preview') || getSection('sec-home-services')

  if (sec?.status === 'Draft') return null

  const heading = sec?.heading || 'Integrated Digital Solutions'
  const description =
    sec?.description ||
    'Docme delivers smart digital and cloud solutions that drive efficiency, innovation, and business growth. Empower educational institutions and enterprises with smart digital solutions.'

  return (
    <section className="bg-[#F8F9FB] relative w-full py-16 sm:py-20 lg:py-24 border-t border-gray-100">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-950 mb-4 sm:mb-5 tracking-tight">
            {heading}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bento Grid: Row 1 (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Centralized Student & Employee Data */}
          <div
            onClick={() => router.push('/services')}
            className="group bg-white rounded-[26px] p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Visual Canvas */}
            <div className="bg-[#F6F8FB] rounded-2xl p-4 sm:p-5 border border-gray-100 relative h-[230px] flex flex-col justify-between overflow-hidden">
              <div className="space-y-2.5">
                {/* Profile Pill 1 */}
                <div className="bg-white/95 rounded-xl p-2.5 px-3 border border-gray-100 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      AS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 leading-tight">Aarav Sharma</div>
                      <div className="text-[10px] text-gray-400 font-medium">DOC-20248</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700 bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md">
                    Grade 10 · Science
                  </span>
                </div>

                {/* Profile Pill 2 */}
                <div className="bg-white/95 rounded-xl p-2.5 px-3 border border-gray-100 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      SJ
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 leading-tight">Dr. Sarah Jenkins</div>
                      <div className="text-[10px] text-gray-400 font-medium">FAC-8812</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                    Faculty · HOD
                  </span>
                </div>
              </div>

              {/* Meta details & Pill Badge */}
              <div className="flex items-end justify-between pt-1">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-medium text-gray-400 block uppercase tracking-wider">Campus Portal</span>
                  <span className="text-[11px] font-semibold text-gray-700">docme.school/hub</span>
                </div>
                <div className="bg-[#4F46E5] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>2,400+ Records</span>
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="pt-5">
              <div className="flex items-center gap-2 text-gray-900">
                <Users className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
                <h3 className="font-semibold text-base sm:text-lg tracking-tight">
                  Centralized Institutional Data
                </h3>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-2">
                Maintain a comprehensive, unified cloud database of all student profiles, faculty records, and departmental credentials in one secure hub.
              </p>
            </div>
          </div>

          {/* Card 2: Automated Fee & Operations Processing */}
          <div
            onClick={() => router.push('/services')}
            className="group bg-white rounded-[26px] p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Visual Canvas */}
            <div className="bg-[#F6F8FB] rounded-2xl p-4 sm:p-5 border border-gray-100 relative h-[230px] flex flex-col items-center justify-center overflow-hidden">
              {/* Top Node */}
              <div className="bg-white px-3 py-1 rounded-full border border-gray-200/90 shadow-2xs flex items-center gap-1.5 text-[11px] text-gray-700 font-medium">
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </div>
                <span>Approved</span>
              </div>

              {/* Connector line */}
              <div className="w-px h-3.5 bg-gray-300 my-0.5" />

              {/* Central Node Card */}
              <div className="bg-white rounded-xl p-2.5 px-4 border border-gray-200 shadow-sm text-center w-48 relative">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">
                  Fee & Operations
                </span>
                <span className="text-lg font-extrabold text-gray-900 tracking-tight my-0.5 block">
                  $48,500
                </span>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 rounded-full w-[84%]" />
                </div>
                <div className="text-[10px] text-gray-400 flex justify-between font-medium mt-1">
                  <span>Reconciled</span>
                  <span className="text-emerald-600 font-semibold">94%</span>
                </div>
              </div>

              {/* Branching SVG */}
              <svg className="w-32 h-4 text-gray-300" viewBox="0 0 128 16" fill="none">
                <path d="M64 0 V8 H16 V16 M64 8 H112 V16" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Bottom Nodes */}
              <div className="flex items-center gap-4">
                <div className="bg-white px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs text-[10px] text-gray-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Tuition Accounts</span>
                </div>
                <div className="bg-white px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs text-[10px] text-gray-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Campus Facilities</span>
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="pt-5">
              <div className="flex items-center gap-2 text-gray-900">
                <Share2 className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
                <h3 className="font-semibold text-base sm:text-lg tracking-tight">
                  Automated Fee & Operations
                </h3>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-2">
                Simplify complex institutional billing, multi-campus reconciliation, and ledger accounting with automated workflows and audit readiness.
              </p>
            </div>
          </div>

          {/* Card 3: Performance Management & Cloud Infrastructure */}
          <div
            onClick={() => router.push('/services')}
            className="group bg-white rounded-[26px] p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer md:col-span-2 lg:col-span-1"
          >
            {/* Visual Canvas */}
            <div className="bg-[#F6F8FB] rounded-2xl p-4 sm:p-5 border border-gray-100 relative h-[230px] flex flex-col justify-between overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between">
                <div className="bg-white px-2.5 py-1 rounded-xl border border-gray-100 shadow-2xs flex items-center gap-1.5 text-[11px] text-gray-700 font-medium">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Cloud Cluster</span>
                  <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1 rounded font-semibold">AWS</span>
                </div>
                <div className="bg-[#4F46E5] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Processing</span>
                </div>
              </div>

              {/* Card display */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 text-[10px] font-semibold text-gray-400">
                  <span className="text-indigo-600 border-b-2 border-indigo-600 pb-1.5 -mb-[7px]">
                    Performance
                  </span>
                  <span>Throughput</span>
                  <span>Latency</span>
                </div>

                <div className="flex items-baseline justify-between mt-2.5">
                  <span className="text-2xl font-bold text-gray-900">99.9%</span>
                  <span className="text-emerald-600 text-[10px] font-semibold flex items-center gap-0.5">
                    ↗ 14ms latency
                  </span>
                </div>

                {/* Segmented bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5 mt-2">
                  <div className="h-full bg-emerald-500 w-[72%]" />
                  <div className="h-full bg-indigo-500 w-[18%]" />
                  <div className="h-full bg-amber-400 w-[10%]" />
                </div>

                <div className="flex items-center justify-between text-[9px] text-gray-400 font-medium mt-2 pt-1 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Operational
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Cache Hit
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Syncing
                  </span>
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="pt-5">
              <div className="flex items-center gap-2 text-gray-900">
                <Gauge className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
                <h3 className="font-semibold text-base sm:text-lg tracking-tight">
                  Performance & Cloud Solutions
                </h3>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-2">
                Facilitate continuous institutional performance with enterprise cloud scalability, high-availability architecture, and real-time monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid: Row 2 (2 Wide Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5 lg:mt-6">
          {/* Card 4: Advanced Analytics and Reporting */}
          <div
            onClick={() => router.push('/services')}
            className="group bg-white rounded-[26px] p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Visual Canvas */}
            <div className="bg-[#F6F8FB] rounded-2xl p-4 sm:p-5 border border-gray-100 relative min-h-[220px] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 overflow-hidden">
              {/* Left Checklist */}
              <div className="w-full sm:w-36 flex-shrink-0 bg-white/70 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Campus Units :
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                    <span>Senior Secondary</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                    <span>Elementary Wing</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                    <span>STEM Laboratories</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                    <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                    <span>Sports & Arts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                    <div className="w-3 h-3 rounded-full border border-gray-300 ml-0.5" />
                    <span>Fleet Operations</span>
                  </div>
                </div>
              </div>

              {/* Center Bar Chart */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-2xs flex-1 w-full flex flex-col justify-between min-h-[160px]">
                <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 font-bold">Academic KPI</span>
                    <span>Attendance</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                      Target
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      Achieved
                    </span>
                  </div>
                </div>

                {/* Bars */}
                <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                  {[
                    { m: 'Jan', h1: '55%', h2: '75%' },
                    { m: 'Feb', h1: '45%', h2: '68%' },
                    { m: 'Mar', h1: '65%', h2: '85%' },
                    { m: 'Apr', h1: '60%', h2: '80%' },
                    { m: 'May', h1: '75%', h2: '92%' },
                    { m: 'Jun', h1: '80%', h2: '98%' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                      <div className="flex items-end gap-0.5 h-14 w-full justify-center">
                        <div
                          style={{ height: bar.h1 }}
                          className="w-1.5 sm:w-2 bg-sky-300 rounded-t-sm"
                        />
                        <div
                          style={{ height: bar.h2 }}
                          className="w-1.5 sm:w-2 bg-indigo-600 rounded-t-sm"
                        />
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">{bar.m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Metric Box */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-2xs w-full sm:w-36 flex-shrink-0 flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Overall Rate
                  </span>
                  <span className="text-2xl font-black text-gray-900 tracking-tight my-1 block">
                    96.4%
                  </span>
                  <span className="text-[10px] text-gray-500 leading-tight block">
                    Campus benchmarks exceeding term goals.
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-2 bg-[#4F46E5] text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <span>Export Data</span>
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Content Info */}
            <div className="pt-5">
              <div className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
                <h3 className="font-semibold text-base sm:text-lg tracking-tight">
                  Advanced Analytics and Reporting
                </h3>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-2">
                Provides real-time institutional data visualization, customizable academic reports, and key performance indicators (KPIs) to help educational leadership make data-driven decisions.
              </p>
            </div>
          </div>

          {/* Card 5: Customizable Workflow Automation */}
          <div
            onClick={() => router.push('/services')}
            className="group bg-white rounded-[26px] p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Visual Canvas */}
            <div className="bg-[#F6F8FB] rounded-2xl p-4 sm:p-5 border border-gray-100 relative min-h-[220px] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 overflow-hidden">
              {/* Left Task Workflow List */}
              <div className="flex-1 w-full">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold mb-3">
                  <span className="bg-white text-indigo-700 shadow-2xs px-2.5 py-1 rounded-lg border border-gray-200/80">
                    Assign Tasks
                  </span>
                  <span className="text-gray-400 px-2 py-1">Approvals</span>
                  <span className="text-gray-400 px-2 py-1">Notification</span>
                </div>

                {/* Workflow Items */}
                <div className="space-y-2">
                  <div className="bg-white rounded-xl p-2 px-3 border border-gray-100 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          Curriculum & Syllabus Sync
                        </div>
                        <div className="text-[10px] text-gray-400">Main Academic Division</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex-shrink-0 ml-2">
                      100%
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-2 px-3 border border-gray-100 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          Scholarship & Fee Review
                        </div>
                        <div className="text-[10px] text-gray-400">Finance & Accounts</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0 ml-2">
                      85%
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-2 px-3 border border-gray-100 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          Report Card Dispatch
                        </div>
                        <div className="text-[10px] text-gray-400">Central Examination Cell</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0 ml-2">
                      60%
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-2xs w-full sm:w-40 flex-shrink-0 flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Total Active
                  </span>
                  <span className="text-xl font-extrabold text-gray-900 tracking-tight my-0.5 block">
                    48 Workflows
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block mb-1">
                    Assigned Team:
                  </span>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center">
                      AK
                    </div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                      RS
                    </div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">
                      MJ
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 bg-[#4F46E5] text-white text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Automate</span>
                </button>
              </div>
            </div>

            {/* Content Info */}
            <div className="pt-5">
              <div className="flex items-center gap-2 text-gray-900">
                <Sliders className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
                <h3 className="font-semibold text-base sm:text-lg tracking-tight">
                  Customizable Workflow Automation
                </h3>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-2">
                Optimize institutional processes with customizable workflows for multi-tier approvals, automated notifications, and seamless departmental task assignments.
              </p>
            </div>
          </div>
        </div>

        {/* View More Services CTA */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <button
            onClick={() => router.push('/services')}
            className="group px-7 sm:px-9 py-3 sm:py-3.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            <span>View all services</span>
            <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection

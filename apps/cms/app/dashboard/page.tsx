import { FileText, Image, Users, Sparkles, Activity, CheckCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    { label: 'Published Pages', value: '7', change: '+2 new', icon: FileText, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Active Sections',  value: '38', change: 'Synced', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Media Assets',     value: '42', change: '85 MB', icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'CMS Editors',      value: '3',  change: '2 online', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your DocMe public website content, media assets, and publishing pipelines.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{s.value}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  {s.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Left Column: Recent Publishing Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Recent Publishing Activity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live content updates deployed to docme.ae</p>
            </div>
            <span className="self-start sm:self-auto text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
              <Activity className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              Live Sync
            </span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'About Video Section & Stats Update', author: 'Akil', time: '10 mins ago', status: 'Published' },
              { title: 'Portfolio Projects Hero Showcase',  author: 'Content Editor', time: '2 hours ago', status: 'Published' },
              { title: 'Global Navigation & Contact FAQ',    author: 'Admin', time: 'Yesterday', status: 'Draft' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/70 hover:bg-slate-100/60 transition-colors gap-2 sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">By {item.author} • {item.time}</p>
                </div>
                <span
                  className={`self-start sm:self-auto text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    item.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: System Health */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 mb-1 text-base">System Health</h2>
            <p className="text-xs text-slate-500 mb-4 sm:mb-5">Current service and database status</p>
            <div className="space-y-2.5 sm:space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="text-slate-600 font-medium">Backend API</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="text-slate-600 font-medium">PostgreSQL DB</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Prisma Ready
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="text-slate-600 font-medium">Public Website</span>
                <span className="text-sky-700 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" /> Port 3002
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 text-[11px] text-slate-400">
            Last health ping: Just now • All systems operational
          </div>
        </div>
      </div>
    </div>
  )
}

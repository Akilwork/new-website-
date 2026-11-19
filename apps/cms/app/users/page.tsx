import { Users, UserPlus, ShieldCheck } from 'lucide-react'

export default function UsersManagementPage() {
  const users = [
    { name: 'System Administrator', email: 'admin@docme.com', role: 'ADMIN', status: 'Active' },
    { name: 'Content Lead', email: 'content@docme.com', role: 'CONTENT_MANAGER', status: 'Active' },
    { name: 'Editorial Reviewer', email: 'editor@docme.com', role: 'CONTENT_MANAGER', status: 'Invited' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Users &amp; Roles</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure access control, administrator accounts, and editor permissions.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[580px]">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">User</th>
                <th className="py-3.5 px-4 sm:px-6">Email</th>
                <th className="py-3.5 px-4 sm:px-6">Role</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs shrink-0">
                        <Users className="w-4 h-4 text-sky-600" />
                      </div>
                      <span className="truncate">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-mono text-xs text-slate-600">{u.email}</td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

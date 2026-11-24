import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Briefcase, Award, TrendingUp, Clock } from 'lucide-react'

const COLORS = ['#64748b', '#3b82f6', '#f59e0b', '#10b981', '#f43f5e']

export default function AnalyticsView({ jobs }) {
  const stages = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']
  const stageData = stages.map((stage) => ({
    name: stage,
    count: jobs.filter((j) => j.status === stage).length
  }))

  const modes = ['Remote', 'Hybrid', 'On-site']
  const modeData = modes.map((mode) => ({
    name: mode,
    value: jobs.filter((j) => j.work_mode === mode).length
  })).filter((m) => m.value > 0)

  const totalApplied = jobs.filter((j) => j.status !== 'Wishlist').length
  const interviews = jobs.filter((j) => j.status === 'Interview' || j.status === 'Offer').length
  const offers = jobs.filter((j) => j.status === 'Offer').length
  const conversionRate = totalApplied > 0 ? Math.round((interviews / totalApplied) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Tracked</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{jobs.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Active Interviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{interviews}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Interview Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{conversionRate}%</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Offers Received</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{offers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Applications by Pipeline Stage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Work Mode Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            {modeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={modeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                    {modeData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400">Add jobs to see work mode breakdown</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

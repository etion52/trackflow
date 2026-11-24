import { useState, useEffect } from 'react'
import { X, Trash2, ExternalLink, Save } from 'lucide-react'

const STATUSES = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']
const MODES = ['Remote', 'Hybrid', 'On-site']

export default function JobDrawer({ isOpen, job, onClose, onSave, onDelete }) {
  const today = () => new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Wishlist',
    salary: '',
    work_mode: 'Remote',
    job_url: '',
    notes: '',
    applied_date: today()
  })

  useEffect(() => {
    if (job) {
      setForm({
        company: job.company || '',
        role: job.role || '',
        status: job.status || 'Wishlist',
        salary: job.salary || '',
        work_mode: job.work_mode || 'Remote',
        job_url: job.job_url || '',
        notes: job.notes || '',
        applied_date: job.applied_date || today()
      })
    } else {
      setForm({
        company: '',
        role: '',
        status: 'Wishlist',
        salary: '',
        work_mode: 'Remote',
        job_url: '',
        notes: '',
        applied_date: today()
      })
    }
  }, [job, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form, job?.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              {job ? 'Edit Application' : 'Add New Application'}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form id="job-form" onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Company *</label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Razorpay, Swiggy, Google"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Job Role *</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Frontend Developer"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Stage</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Work Mode</label>
                <select
                  value={form.work_mode}
                  onChange={(e) => setForm({ ...form, work_mode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">CTC / Salary</label>
                <input
                  type="text"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  placeholder="e.g. 10 - 14 LPA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Applied Date</label>
                <input
                  type="date"
                  value={form.applied_date}
                  onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Job Link</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.job_url}
                  onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {form.job_url && (
                  <a
                    href={form.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                    title="Open URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Interview Notes & Prep</label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Add recruiter contact, interview rounds, or topics to revise..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {job ? (
            <button
              type="button"
              onClick={() => onDelete(job.id)}
              className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200/70 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="job-form"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              Save Job
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

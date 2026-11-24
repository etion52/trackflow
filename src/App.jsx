import { useState, useEffect, useMemo } from 'react'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { AuthProvider, useAuth } from './context/AuthContext'
import { db } from './lib/firebase'
import { INITIAL_DEMO_JOBS } from './data/sampleJobs'
import AuthScreen from './components/AuthScreen'
import KanbanColumn from './components/KanbanColumn'
import JobDrawer from './components/JobDrawer'
import AnalyticsView from './components/AnalyticsView'
import { Briefcase, Plus, Search, LayoutGrid, BarChart3, LogOut, Download, Sparkles } from 'lucide-react'

const STAGES = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']

function Dashboard() {
  const { user, isDemo, signOut } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('board')
  const [search, setSearch] = useState('')
  const [modeFilter, setModeFilter] = useState('All')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    loadJobs()
  }, [user, isDemo])

  const loadJobs = async () => {
    setLoading(true)
    if (isDemo) {
      const cached = localStorage.getItem('trackflow_demo_jobs')
      setJobs(cached ? JSON.parse(cached) : INITIAL_DEMO_JOBS)
      setLoading(false)
      return
    }
    try {
      const q = query(collection(db, 'applications'), where('user_id', '==', user.uid))
      const snapshot = await getDocs(q)
      const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      fetched.sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
      setJobs(fetched)
    } catch (err) {
      console.error('Error loading jobs:', err)
    }
    setLoading(false)
  }

  const persistDemoJobs = (updated) => {
    setJobs(updated)
    localStorage.setItem('trackflow_demo_jobs', JSON.stringify(updated))
  }

  const handleSaveJob = async (formData, existingId) => {
    if (isDemo) {
      if (existingId) {
        persistDemoJobs(jobs.map((j) => (j.id === existingId ? { ...j, ...formData } : j)))
      } else {
        persistDemoJobs([{ id: 'demo-' + Date.now(), ...formData }, ...jobs])
      }
      setDrawerOpen(false)
      setSelectedJob(null)
      return
    }

    try {
      if (existingId) {
        await updateDoc(doc(db, 'applications', existingId), formData)
        setJobs(jobs.map((j) => (j.id === existingId ? { ...j, ...formData } : j)))
      } else {
        const newDoc = { ...formData, user_id: user.uid, created_at: Date.now() }
        const docRef = await addDoc(collection(db, 'applications'), newDoc)
        setJobs([{ id: docRef.id, ...newDoc }, ...jobs])
      }
    } catch (err) {
      console.error('Error saving job:', err)
    }
    setDrawerOpen(false)
    setSelectedJob(null)
  }

  const handleDeleteJob = async (id) => {
    if (isDemo) {
      persistDemoJobs(jobs.filter((j) => j.id !== id))
      setDrawerOpen(false)
      setSelectedJob(null)
      return
    }
    try {
      await deleteDoc(doc(db, 'applications', id))
      setJobs(jobs.filter((j) => j.id !== id))
    } catch (err) {
      console.error('Error deleting job:', err)
    }
    setDrawerOpen(false)
    setSelectedJob(null)
  }

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return
    const draggedJob = jobs.find((j) => j.id === active.id)
    if (!draggedJob) return

    let targetStage = STAGES.includes(over.id)
      ? over.id
      : jobs.find((j) => j.id === over.id)?.status

    if (!targetStage || targetStage === draggedJob.status) return

    const updated = jobs.map((j) => (j.id === draggedJob.id ? { ...j, status: targetStage } : j))
    if (isDemo) {
      persistDemoJobs(updated)
    } else {
      setJobs(updated)
      await updateDoc(doc(db, 'applications', draggedJob.id), { status: targetStage })
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase())
      const matchesMode = modeFilter === 'All' || job.work_mode === modeFilter
      return matchesSearch && matchesMode
    })
  }, [jobs, search, modeFilter])

  const handleInstallApp = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">TrackFlow</span>
            {isDemo && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <Sparkles className="w-3 h-3" /> Demo Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {installPrompt && (
              <button
                onClick={handleInstallApp}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            )}
            <button
              onClick={() => { setSelectedJob(null); setDrawerOpen(true) }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Job</span>
            </button>
            <button
              onClick={signOut}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>

          {activeTab === 'board' && (
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search company or role..."
                  className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-56"
                />
              </div>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STAGES.map((s) => (
              <div key={s} className="h-96 bg-slate-200/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'board' ? (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
              {STAGES.map((stage) => (
                <KanbanColumn
                  key={stage}
                  status={stage}
                  jobs={filteredJobs.filter((job) => job.status === stage)}
                  onSelectJob={(job) => {
                    setSelectedJob(job)
                    setDrawerOpen(true)
                  }}
                />
              ))}
            </div>
          </DndContext>
        ) : (
          <AnalyticsView jobs={filteredJobs} />
        )}

        <JobDrawer
          isOpen={drawerOpen}
          job={selectedJob}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedJob(null)
          }}
          onSave={handleSaveJob}
          onDelete={handleDeleteJob}
        />
      </main>
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600 font-semibold">Loading TrackFlow...</div>
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import JobCard from './JobCard'

const COLUMN_STYLES = {
  Wishlist: 'border-t-slate-400 bg-slate-100/70',
  Applied: 'border-t-blue-500 bg-blue-50/40',
  Interview: 'border-t-amber-500 bg-amber-50/40',
  Offer: 'border-t-emerald-500 bg-emerald-50/40',
  Rejected: 'border-t-rose-400 bg-rose-50/40'
}

export default function KanbanColumn({ status, jobs, onSelectJob }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border border-slate-200 border-t-4 min-h-[480px] p-3 transition ${
        COLUMN_STYLES[status] || 'bg-slate-100'
      } ${isOver ? 'ring-2 ring-indigo-400' : ''}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-sm text-slate-800">{status}</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
          {jobs.length}
        </span>
      </div>

      <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5 flex-1">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onSelect={onSelectJob} />
          ))}
          {jobs.length === 0 && (
            <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
              Drop job here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

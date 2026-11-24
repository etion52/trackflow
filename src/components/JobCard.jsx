import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building2, MapPin, IndianRupee, Calendar, GripVertical } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default function JobCard({ job, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { job }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(job)}
      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
            {job.company?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900 text-sm truncate">{job.role}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <Building2 className="w-3 h-3 shrink-0" />
              {job.company}
            </p>
          </div>
        </div>
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1"
          title="Drag card"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          {job.work_mode}
        </span>
        {job.salary && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium flex items-center gap-0.5">
            <IndianRupee className="w-3 h-3" />
            {job.salary}
          </span>
        )}
      </div>

      {job.applied_date && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(parseISO(job.applied_date), 'dd MMM yyyy')}
          </span>
          <span className="text-indigo-600 opacity-0 group-hover:opacity-100 font-medium transition">
            Edit â†’
          </span>
        </div>
      )}
    </div>
  )
}

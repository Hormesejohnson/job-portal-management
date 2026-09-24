import { CalendarDays, MapPin, BriefcaseBusiness, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatSalary } from '../../utils/formatSalary'

const JobCard = ({ job }) => {
  if (!job) return null

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{job.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
        </div>
        {job.featured && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">Featured</span>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2"><BriefcaseBusiness size={15} /> {job.company}</div>
        <div className="flex items-center gap-2"><MapPin size={15} /> {job.location}</div>
        <div className="flex items-center gap-2">{formatSalary(job.salaryMin, job.location)} - {formatSalary(job.salaryMax, job.location)}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills?.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{skill}</span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {new Date(job.createdAt).toLocaleDateString()}</span>
        <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700">{job.jobType}</span>
      </div>

      <Link to={`/jobs/${job.id}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
        View details <ArrowRight size={16} />
      </Link>
    </div>
  )
}

export default JobCard

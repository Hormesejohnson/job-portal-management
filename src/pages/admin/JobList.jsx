import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Trash2, PencilLine, Eye, Plus, ArrowLeft } from 'lucide-react'
import { fetchJobs, deleteJob } from '../../features/jobs/jobsSlice'
import { selectDeleteJobStatus, selectJobs, selectJobsError, selectJobsLoading } from '../../features/jobs/jobsSelectors'
import { setSearch, setCategory, setExperience, setJobType, setStatus, setAdminCurrentPage, clearFilters } from '../../features/filters/filtersSlice'
import { categories } from '../../mock/seedData'
import TableSkeleton from '../../components/common/TableSkeleton'
import EmptyState from '../../components/common/EmptyState'

const JobList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const jobs = useSelector(selectJobs)
  const loading = useSelector(selectJobsLoading)
  const filters = useSelector((state) => state.filters)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const deleteStatus = useSelector(selectDeleteJobStatus)
  const jobsError = useSelector(selectJobsError)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !filters.search || `${job.title} ${job.company}`.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory = filters.category === 'All' || job.category === filters.category
      const matchesExperience = filters.experience === 'All' || job.experienceLevel === filters.experience
      const matchesType = filters.jobType === 'All' || job.jobType === filters.jobType
      const matchesStatus = filters.status === 'All' || job.status === filters.status
      return matchesSearch && matchesCategory && matchesExperience && matchesType && matchesStatus
    })
  }, [jobs, filters])

  const pageSize = filters.adminPageSize
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize))
  const paginatedJobs = filteredJobs.slice((filters.adminCurrentPage - 1) * pageSize, filters.adminCurrentPage * pageSize)

  useEffect(() => {
    if (filters.adminCurrentPage > totalPages) {
      dispatch(setAdminCurrentPage(totalPages))
    }
  }, [filters.adminCurrentPage, totalPages, dispatch])

  const handleDelete = (job) => {
    setDeleteError('')
    setDeleteTarget(job)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setDeleteId(deleteTarget.id)
    try {
      await dispatch(deleteJob(deleteTarget.id)).unwrap()
      setDeleteTarget(null)
    } catch (error) {
      setDeleteError(error || 'The job could not be deleted. Please try again.')
    } finally {
      setDeleteId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteTarget(null)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Manage jobs</p>
          <h1 className="text-2xl font-bold text-slate-900">Job listings</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={16} /> Back
          </button>
          <Link to="/admin/jobs/create" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={16} /> Create job
          </Link>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input value={filters.search} onChange={(e) => dispatch(setSearch(e.target.value))} className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500" placeholder="Search by title/company" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Category</label>
          <select value={filters.category} onChange={(e) => dispatch(setCategory(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
            <option value="All">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Experience</label>
          <select value={filters.experience} onChange={(e) => dispatch(setExperience(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
            <option value="All">All levels</option>
            <option value="Fresher">Fresher</option>
            <option value="1-2 Years">1-2 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</label>
          <select value={filters.status} onChange={(e) => dispatch(setStatus(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Job type</label>
          <select value={filters.jobType} onChange={(e) => dispatch(setJobType(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
            <option value="All">All types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="lg:col-span-3 flex items-end">
          <button onClick={() => dispatch(clearFilters())} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear filters</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4"><TableSkeleton /></div>
          ) : paginatedJobs.length === 0 ? (
            <div className="p-6"><EmptyState title="No jobs found" message="No jobs match your filters." action={() => dispatch(clearFilters())} actionLabel="Reset filters" /></div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Job title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="bg-white hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{job.title}</td>
                    <td className="px-4 py-3 text-slate-600">{job.company}</td>
                    <td className="px-4 py-3 text-slate-600">{job.category}</td>
                    <td className="px-4 py-3 text-slate-600">{job.location}</td>
                    <td className="px-4 py-3 text-slate-600">{job.jobType}</td>
                    <td className="px-4 py-3 text-slate-600">{job.experienceLevel}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{job.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/jobs/${job.id}`} aria-label={`View ${job.title}`} className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"><Eye size={15} /></Link>
                        <Link to={`/admin/jobs/${job.id}/edit`} aria-label={`Edit ${job.title}`} className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"><PencilLine size={15} /></Link>
                        <button onClick={() => handleDelete(job)} aria-label={`Delete ${job.title}`} className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200" disabled={deleteId === job.id}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!loading && filteredJobs.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button disabled={filters.adminCurrentPage === 1} onClick={() => dispatch(setAdminCurrentPage(Math.max(1, filters.adminCurrentPage - 1)))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Previous</button>
          <div className="text-sm text-slate-600">Page {filters.adminCurrentPage} of {totalPages}</div>
          <button disabled={filters.adminCurrentPage === totalPages} onClick={() => dispatch(setAdminCurrentPage(Math.min(totalPages, filters.adminCurrentPage + 1)))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Next</button>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">Delete job</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Confirm deletion</h3>
              </div>
              <button onClick={cancelDelete} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">✕</button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{deleteTarget.title}</span>? This action cannot be undone.
            </p>
            {deleteStatus === 'failed' && <p className="mt-3 text-sm text-red-600">{deleteError || jobsError || 'The job could not be deleted. Please try again.'}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={cancelDelete} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleteId === deleteTarget.id} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {deleteId === deleteTarget.id ? 'Deleting...' : 'Delete job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobList

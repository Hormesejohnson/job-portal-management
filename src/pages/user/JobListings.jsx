import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Filter, SlidersHorizontal } from 'lucide-react'
import JobCard from '../../components/jobs/JobCard'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { fetchJobs } from '../../features/jobs/jobsSlice'
import { selectJobs, selectJobsLoading } from '../../features/jobs/jobsSelectors'
import { setCategory, setCurrentPage, setExperience, setJobType, setLocation, setSearch, setSortBy, clearFilters } from '../../features/filters/filtersSlice'
import { categories, locations } from '../../mock/seedData'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const JobListings = () => {
  const dispatch = useDispatch()
  const routeLocation = useLocation()
  const navigate = useNavigate()
  const firstJobRef = useRef(null)
  const jobs = useSelector(selectJobs)
  const loading = useSelector(selectJobsLoading)
  const { search, category, experience, location, jobType, sortBy, currentPage, pageSize } = useSelector((state) => state.filters)
  const previousPage = useRef(currentPage)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const query = new URLSearchParams(routeLocation.search)
  const roleFilter = query.get('search') || ''
  const categoryFilter = query.get('category') || ''

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  useEffect(() => {
    if (roleFilter || categoryFilter) dispatch(setCurrentPage(1))
    if (categoryFilter && category !== categoryFilter) dispatch(setCategory(categoryFilter))
  }, [roleFilter, categoryFilter, category, dispatch])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => job.status === 'Active').filter((job) => {
      const keyword = (roleFilter || search).trim().toLowerCase()
      const matchesSearch = !keyword || `${job.title} ${job.company} ${job.category} ${job.location}`.toLowerCase().includes(keyword)
      const selectedCategory = categoryFilter || category
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory
      const matchesExperience = experience === 'All' || job.experienceLevel === experience
      const matchesLocation = location === 'All' || job.location.toLowerCase().includes(location.toLowerCase())
      const matchesJobType = jobType === 'All' || job.jobType === jobType
      return matchesSearch && matchesCategory && matchesExperience && matchesLocation && matchesJobType
    })
  }, [jobs, search, category, roleFilter, categoryFilter, experience, location, jobType])

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs]
    if (sortBy === 'salaryHigh') return list.sort((a, b) => b.salaryMax - a.salaryMax)
    if (sortBy === 'salaryLow') return list.sort((a, b) => a.salaryMax - b.salaryMax)
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [filteredJobs, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / pageSize))
  const currentList = sortedJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    if (currentPage > totalPages) dispatch(setCurrentPage(totalPages))
  }, [currentPage, totalPages, dispatch])

  useEffect(() => {
    if (!loading && routeLocation.state?.focusFirstJob && currentList.length > 0) {
      firstJobRef.current?.focus()
      navigate(routeLocation.pathname, { replace: true })
    }
  }, [loading, currentList, routeLocation, navigate])

  useEffect(() => {
    if (!loading && previousPage.current !== currentPage && currentList.length > 0) {
      firstJobRef.current?.focus()
    }
    previousPage.current = currentPage
  }, [currentPage, currentList, loading])

  const filterPanel = (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Filters</h3>
        <button onClick={() => dispatch(clearFilters())} className="text-xs font-medium text-blue-600">Clear all</button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Keyword / job role</label>
        <select value={search} onChange={(e) => dispatch(setSearch(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
          <option value="">All job roles</option>
          {[...new Set(jobs.map((job) => job.title))].map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Category</label>
        <select value={category} onChange={(e) => dispatch(setCategory(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
          <option value="All">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Location</label>
        <select value={location === 'All' ? '' : location} onChange={(e) => dispatch(setLocation(e.target.value || 'All'))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
          <option value="">All locations</option>
          {locations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Experience</label>
        <select value={experience} onChange={(e) => dispatch(setExperience(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
          <option value="All">All levels</option>
          {[...new Set(jobs.map((job) => job.experienceLevel))].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Job type</label>
        <select value={jobType} onChange={(e) => dispatch(setJobType(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500">
          <option value="All">All types</option>
          {[...new Set(jobs.map((job) => job.jobType))].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Discover roles</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Browse jobs</h1>
          </div>
          <button onClick={() => setMobileFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium md:hidden">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">{filterPanel}</aside>

          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600"><Filter size={16} /> {sortedJobs.length} results</div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">Sort by</label>
                <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="mostRecent">Most Recent</option>
                  <option value="salaryHigh">Salary: High to Low</option>
                  <option value="salaryLow">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><LoadingSpinner label="Loading jobs..." /></div>
            ) : currentList.length === 0 ? (
              <EmptyState title="No jobs found" message="Try changing your filters or search keyword." action={() => dispatch(clearFilters())} actionLabel="Reset filters" />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {currentList.map((job, index) => (
                  <Link key={job.id} ref={index === 0 ? firstJobRef : undefined} to={`/jobs/${job.id}`} className="block">
                    <JobCard job={job} />
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <button disabled={currentPage === 1} onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Previous</button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <button key={pageNumber} onClick={() => dispatch(setCurrentPage(pageNumber))} className={`h-9 w-9 rounded-lg text-sm font-medium ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {pageNumber}
                    </button>
                  )
                })}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </main>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 p-4 md:hidden">
          <div className="mt-10 rounded-2xl bg-white p-4">
            {filterPanel}
            <button onClick={() => setMobileFiltersOpen(false)} className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">Apply filters</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default JobListings

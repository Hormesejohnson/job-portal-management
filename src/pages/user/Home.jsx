import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Search, MapPin, ArrowRight } from 'lucide-react'
import { selectJobs } from '../../features/jobs/jobsSelectors'
import JobCard from '../../components/jobs/JobCard'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { useState } from 'react'
import { clearFilters, setLocation, setSearch } from '../../features/filters/filtersSlice'
import { locations } from '../../mock/seedData'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [location, setLocationValue] = useState('')
  const jobs = useSelector(selectJobs)
  const activeJobs = jobs.filter((job) => job.status === 'Active')
  const featuredJobs = activeJobs.filter((job) => job.featured).slice(0, 6)
  const categories = [...new Set(activeJobs.map((job) => job.category))].slice(0, 6)

  const handleSearch = (event) => {
    event.preventDefault()
    dispatch(setSearch(keyword))
    dispatch(setLocation(location.trim() || 'All'))
    navigate('/jobs')
  }

  const handleBrowseJobs = () => {
    dispatch(clearFilters())
    navigate('/jobs', { state: { focusFirstJob: true } })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <BriefcaseBusiness size={14} /> Trusted by top teams worldwide
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">Find your next opportunity</h1>
              <p className="mt-4 max-w-xl text-base text-teal-50 md:text-lg">Search curated roles from innovative companies and grow your career with the right next move.</p>

              <form onSubmit={handleSearch} className="mt-8 grid gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur md:grid-cols-[1.5fr_1fr_auto]">
                <label className="rounded-xl bg-white px-3 py-2 text-slate-700">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Keyword</span>
                  <select value={keyword} onChange={(event) => setKeyword(event.target.value)} className="mt-1 w-full bg-transparent font-medium outline-none">
                    <option value="">All job roles</option>
                    {[...new Set(activeJobs.map((job) => job.title))].map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>
                <label className="rounded-xl bg-white px-3 py-2 text-slate-700">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Location</span>
                  <span className="mt-1 flex items-center gap-2">
                    <MapPin size={14} />
                    <select value={location} onChange={(event) => setLocationValue(event.target.value)} className="w-full bg-transparent font-medium outline-none">
                      <option value="">All locations</option>
                      {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </span>
                </label>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-slate-900 hover:bg-amber-200">
                  <Search size={16} /> Search Jobs
                </button>
              </form>
            </div>

            <div className="flex items-center justify-center">
              <div className="grid w-full max-w-md gap-4 rounded-3xl bg-white/10 p-5 backdrop-blur">
                <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trending roles</p>
                  <ul className="mt-4 space-y-3">
                    {featuredJobs.slice(0, 4).map((job) => (
                      <li key={job.id}>
                        <Link
                          to={`/jobs?search=${encodeURIComponent(job.title)}`}
                          state={{ focusFirstJob: true }}
                          onClick={() => {
                            dispatch(clearFilters())
                            dispatch(setSearch(job.title))
                          }}
                          className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 hover:border-teal-300 hover:bg-teal-50"
                        >
                        <div>
                          <div className="font-semibold">{job.title}</div>
                          <div className="text-xs text-slate-500">{job.company}</div>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">{job.jobType}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Featured jobs</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Opportunities worth exploring</h2>
            </div>
            <Link to="/jobs" className="hidden items-center gap-2 text-sm font-semibold text-teal-700 md:inline-flex">View all jobs <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Popular categories</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Browse by specialty</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
              {categories.map((category) => {
                const count = activeJobs.filter((job) => job.category === category).length
                return (
                  <Link
                    key={category}
                    to={`/jobs?category=${encodeURIComponent(category)}`}
                    onClick={() => {
                      dispatch(setCategory(category))
                    }}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-teal-200 hover:bg-teal-50"
                  >
                    <p className="text-sm font-semibold text-slate-800">{category}</p>
                    <p className="mt-2 text-2xl font-bold text-teal-700">{count}</p>
                    <p className="text-xs text-slate-500">open roles</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="rounded-3xl bg-slate-900 px-6 py-8 text-white md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Career growth</p>
                <h3 className="mt-2 text-3xl font-bold">Ready to take the next step?</h3>
              </div>
              <button type="button" onClick={handleBrowseJobs} className="inline-flex items-center justify-center rounded-xl bg-amber-300 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-200">Explore all jobs</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home

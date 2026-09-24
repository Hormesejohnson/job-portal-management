import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, BriefcaseBusiness, CalendarDays, CheckCircle2 } from 'lucide-react'
import { fetchJobById } from '../../features/jobs/jobsSlice'
import { selectJobLoading, selectJobsError, selectSelectedJob } from '../../features/jobs/jobsSelectors'
import { applyForJob } from '../../features/applications/applicationsSlice'
import { selectAppliedJobs } from '../../features/applications/applicationsSelectors'
import { selectCurrentUser, selectIsAuthenticated } from '../../features/auth/authSelectors'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { formatSalary } from '../../utils/formatSalary'

const JobDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const job = useSelector(selectSelectedJob)
  const loading = useSelector(selectJobLoading)
  const error = useSelector(selectJobsError)
  const appliedJobs = useSelector(selectAppliedJobs)
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [applyStatus, setApplyStatus] = useState('idle')
  const [applyError, setApplyError] = useState('')

  useEffect(() => {
    dispatch(fetchJobById(id))
  }, [dispatch, id])

  const alreadyApplied = useMemo(() => appliedJobs.some((item) => item.jobId === id && item.userId === currentUser?.id), [appliedJobs, currentUser, id])

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setApplyStatus('loading')
    setApplyError('')

    try {
      await dispatch(applyForJob({ jobId: id, userId: currentUser.id })).unwrap()
      setApplyStatus('success')
    } catch (error) {
      setApplyStatus('failed')
      setApplyError(error)
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-50"><Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} /><LoadingSpinner label="Loading job details..." /><Footer /></div>
  if (error) return <div className="min-h-screen bg-slate-50"><Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} /><main className="mx-auto max-w-5xl px-4 py-10 md:px-6"><ErrorMessage title="Could not load this job" message="Please try again." action={() => dispatch(fetchJobById(id))} /></main><Footer /></div>
  if (!job) return <div className="min-h-screen bg-slate-50"><Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} /><ErrorMessage title="Job not found" message="This role may have been removed or is no longer available." /><Footer /></div>
  if (job.status !== 'Active') return <div className="min-h-screen bg-slate-50"><Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} /><main className="mx-auto max-w-5xl px-4 py-10 md:px-6"><ErrorMessage title="This job is no longer available" message="Please browse our other open roles." /></main><Footer /></div>

  return (
    <div className="min-h-screen bg-slate-50">
      <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{job.category}</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{job.title}</h1>
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2"><BriefcaseBusiness size={16} /> {job.company}</span>
                <span className="inline-flex items-center gap-2"><MapPin size={16} /> {job.location}</span>
              </div>
            </div>
            <button onClick={handleApply} disabled={alreadyApplied || applyStatus === 'loading'} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {applyStatus === 'loading' ? 'Applying...' : alreadyApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>

          {applyStatus === 'success' && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status">
              <CheckCircle2 size={18} /> Successfully applied for the {job.title} role.
            </div>
          )}

          {applyStatus === 'failed' && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {applyError || 'We could not submit your application. Please try again.'}
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Job type</div><div className="mt-2 font-semibold text-slate-800">{job.jobType}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Experience</div><div className="mt-2 font-semibold text-slate-800">{job.experienceLevel}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Salary</div><div className="mt-2 font-semibold text-slate-800">{formatSalary(job.salaryMin, job.location)} - {formatSalary(job.salaryMax, job.location)}</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Posted</div><div className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-800"><CalendarDays size={16} /> {new Date(job.createdAt).toLocaleDateString()}</div></div>
          </div>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">Description</h2>
              <p className="mt-3 leading-7 text-slate-600">{job.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Responsibilities</h2>
              <ul className="mt-3 space-y-2 text-slate-600">
                {(job.responsibilities || []).map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-blue-600" /> {item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Requirements</h2>
              <ul className="mt-3 space-y-2 text-slate-600">
                {(job.requirements || []).map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-blue-600" /> {item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(job.skills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{skill}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default JobDetails

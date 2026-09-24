import { useSelector } from 'react-redux'
import { selectAppliedJobs } from '../../features/applications/applicationsSelectors'
import { selectJobs } from '../../features/jobs/jobsSelectors'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'

const AppliedJobs = () => {
  const appliedJobs = useSelector(selectAppliedJobs)
  const jobs = useSelector(selectJobs)
  const currentUser = useSelector(selectCurrentUser)

  const appliedDetails = appliedJobs.filter((application) => application.userId === currentUser?.id).map((application) => {
    const job = jobs.find((item) => item.id === application.jobId)
    return { ...application, job }
  }).filter((item) => item.job)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header mobileMenuOpen={false} setMobileMenuOpen={() => {}} />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Your activity</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Applied jobs</h1>
        </div>

        {appliedDetails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">No job applications yet.</div>
        ) : (
          <div className="space-y-4">
            {appliedDetails.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{entry.job.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{entry.job.company} • {entry.job.location}</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{entry.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Applied date: {new Date(entry.appliedAt).toLocaleDateString()}</span>
                  <span>Application status: {entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AppliedJobs

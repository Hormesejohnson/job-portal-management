import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BarChart3, BriefcaseBusiness, FileText, FolderKanban, Home as HomeIcon, LogOut, Menu, Users, X } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { selectJobs } from '../../features/jobs/jobsSelectors'
import { fetchJobs } from '../../features/jobs/jobsSlice'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import { selectAppliedJobs } from '../../features/applications/applicationsSelectors'
import PageLoader from '../../components/common/PageLoader'

const StatCard = ({ title, value, icon: Icon, accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}><Icon size={20} /></div>
    </div>
  </div>
)

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const jobs = useSelector(selectJobs)
  const applications = useSelector(selectAppliedJobs)
  const user = useSelector(selectCurrentUser)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchJobs())
      .unwrap()
      .finally(() => setLoading(false))
  }, [dispatch])

  const activeJobs = jobs.filter((job) => job.status === 'Active').length
  const inactiveJobs = jobs.filter((job) => job.status === 'Inactive').length

  const recentJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 3)

  if (loading) return <PageLoader label="Loading dashboard..." />

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 p-5 text-white transition lg:static lg:translate-x-0`}>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">Hormese JobPortal Admin</div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-8 space-y-2">
            <Link to="/admin/dashboard" className="flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-2.5 text-sm font-medium"> <BarChart3 size={16} /> Dashboard </Link>
            <Link to="/admin/jobs" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"> <BriefcaseBusiness size={16} /> Jobs </Link>
            <Link to="/admin/jobs/create" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"> <FileText size={16} /> Create job </Link>
            <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"> <HomeIcon size={16} /> Home </Link>
            <button onClick={() => dispatch(logout())} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800"> <LogOut size={16} /> Logout </button>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu /></button>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</p>
                  <h1 className="text-xl font-bold text-slate-900">Welcome, {user?.name || 'Admin'}</h1>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total jobs" value={jobs.length} icon={BriefcaseBusiness} accent="bg-blue-100 text-blue-700" />
              <StatCard title="Active jobs" value={activeJobs} icon={FolderKanban} accent="bg-emerald-100 text-emerald-700" />
              <StatCard title="Inactive jobs" value={inactiveJobs} icon={FileText} accent="bg-amber-100 text-amber-700" />
              <StatCard title="Total applications" value={applications.length} icon={Users} accent="bg-violet-100 text-violet-700" />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Recent jobs</h2>
                <div className="mt-5 space-y-3">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                      <div>
                        <div className="font-semibold text-slate-800">{job.title}</div>
                        <div className="text-sm text-slate-500">{job.company}</div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{job.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Recent applications</h2>
                <div className="mt-5 space-y-3">
                  {recentApplications.length === 0 ? (
                    <p className="text-sm text-slate-500">No applications yet.</p>
                  ) : recentApplications.map((application) => {
                    const job = jobs.find((item) => item.id === application.jobId)
                    return (
                      <div key={application.id} className="rounded-xl border border-slate-200 p-3">
                        <div className="font-semibold text-slate-800">{job?.title || 'Job no longer available'}</div>
                        <div className="text-sm text-slate-500">Applicant: {application.userId}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

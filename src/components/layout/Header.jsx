import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BriefcaseBusiness, LogOut, Menu } from 'lucide-react'
import { selectIsAuthenticated, selectCurrentUser, selectUserRole } from '../../features/auth/authSelectors'
import { logout } from '../../features/auth/authSlice'

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)
  const role = useSelector(selectUserRole)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-900/20">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <div className="text-lg font-bold">Hormese JobPortal</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Hire smarter</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-teal-700' : 'text-slate-600 hover:text-slate-900'}`} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-teal-700' : 'text-slate-600 hover:text-slate-900'}`} to="/jobs">Jobs</NavLink>
          <NavLink className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-teal-700' : 'text-slate-600 hover:text-slate-900'}`} to="/jobs">Categories</NavLink>
          <NavLink className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-teal-700' : 'text-slate-600 hover:text-slate-900'}`} to="/applied-jobs">Applied Jobs</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {role === 'ADMIN' && <Link to="/admin/dashboard" className="rounded-xl bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200">Admin dashboard</Link>}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{user?.name ? `Welcome, ${user.name}` : 'User'}</span>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">Login</Link>
          )}
        </div>

        <button type="button" className="rounded-lg border border-slate-200 p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={18} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">Home</NavLink>
            <NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">Jobs</NavLink>
            <NavLink to="/applied-jobs" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">Applied Jobs</NavLink>
            {role === 'ADMIN' && <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-amber-100 px-3 py-2 font-semibold text-amber-900 hover:bg-amber-200">Admin dashboard</NavLink>}
            {!isAuthenticated ? (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-teal-700 px-3 py-2 text-center font-medium text-white">Login</Link>
            ) : (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="rounded-lg border border-slate-200 px-3 py-2 text-left font-medium text-slate-700">Logout</button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

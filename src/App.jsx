import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './app/store'
import Home from './pages/user/Home'
import JobListings from './pages/user/JobListings'
import JobDetails from './pages/user/JobDetails'
import Login from './pages/user/Login'
import AppliedJobs from './pages/user/AppliedJobs'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import JobList from './pages/admin/JobList'
import CreateJob from './pages/admin/CreateJob'
import EditJob from './pages/admin/EditJob'
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'
import { fetchJobs } from './features/jobs/jobsSlice'
import { fetchAppliedJobs } from './features/applications/applicationsSlice'
import { selectIsAuthenticated, selectUserRole } from './features/auth/authSelectors'

const AppShell = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectUserRole)

  useEffect(() => {
    dispatch(fetchJobs())
    if (isAuthenticated) dispatch(fetchAppliedJobs())
  }, [dispatch, isAuthenticated])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/jobs" element={<JobListings />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/applied-jobs" element={<ProtectedRoute allowedRoles={['USER']}><AppliedJobs /></ProtectedRoute>} />

      <Route path="/admin/login" element={isAuthenticated && role === 'ADMIN' ? <Navigate to="/" replace /> : <AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['ADMIN']}><JobList /></ProtectedRoute>} />
      <Route path="/admin/jobs/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateJob /></ProtectedRoute>} />
      <Route path="/admin/jobs/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditJob /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </Provider>
)

export default App

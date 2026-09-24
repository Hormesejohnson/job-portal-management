import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUserRole } from '../features/auth/authSelectors'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectUserRole)
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectPath = allowedRoles.includes('ADMIN') ? '/admin/login' : '/login'
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/'} replace />
  }

  return children
}

export default ProtectedRoute

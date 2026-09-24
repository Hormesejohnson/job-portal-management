import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { clearAuthError, login } from '../../features/auth/authSlice'
import { selectAuth } from '../../features/auth/authSelectors'

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password is too short'),
})

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(selectAuth)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = (values) => {
    dispatch(clearAuthError())
    dispatch(login(values))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white"><ShieldCheck size={28} /></div>
        </div>
        <h1 className="text-center text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Secure access to job management tools.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
            <input {...register('username')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="admin" />
            {errors.username && <span className="mt-1 block text-xs text-red-600">{errors.username.message}</span>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} {...register('password')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-10 text-sm" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-slate-500">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span>}
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500">
          User portal? <Link to="/login" className="font-semibold text-blue-600">User login</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

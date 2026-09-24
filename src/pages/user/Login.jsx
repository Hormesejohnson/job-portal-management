import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { login } from '../../features/auth/authSlice'
import { selectAuth } from '../../features/auth/authSelectors'

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password is too short'),
})

const UserLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error, isAuthenticated } = useSelector(selectAuth)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from)
    }
  }, [isAuthenticated, navigate, location])

  const onSubmit = (values) => {
    dispatch(login(values))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white"><LockKeyhole size={28} /></div>
        </div>
        <h1 className="text-center text-2xl font-bold text-slate-900">User Login</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Use your portal credentials to continue.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
            <input {...register('username')} onChange={(e) => setValue('username', e.target.value, { shouldValidate: true })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="user" />
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
          Need admin access? <Link to="/admin/login" className="font-semibold text-blue-600">Admin login</Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin

import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
      <div className="text-6xl font-bold text-blue-600">404</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Back home</Link>
    </div>
  </div>
)

export default NotFound

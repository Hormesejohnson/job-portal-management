const PageLoader = ({ label = 'Loading page...' }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  </div>
)

export default PageLoader

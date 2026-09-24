const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-3 h-4 w-24 rounded bg-slate-200" />
    <div className="mb-2 h-6 w-40 rounded bg-slate-200" />
    <div className="mb-4 h-4 w-28 rounded bg-slate-200" />
    <div className="mb-2 h-4 w-full rounded bg-slate-200" />
    <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
    <div className="mb-3 h-4 w-2/3 rounded bg-slate-200" />
    <div className="flex gap-2">
      <div className="h-7 w-20 rounded-full bg-slate-200" />
      <div className="h-7 w-20 rounded-full bg-slate-200" />
    </div>
  </div>
)

export default SkeletonCard

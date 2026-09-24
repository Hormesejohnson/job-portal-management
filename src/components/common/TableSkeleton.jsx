const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="grid animate-pulse grid-cols-8 gap-4 rounded-xl border border-slate-200 bg-white p-3">
        {[...Array(8)].map((__, innerIndex) => (
          <div key={`${index}-${innerIndex}`} className="h-4 rounded bg-slate-200" />
        ))}
      </div>
    ))}
  </div>
)

export default TableSkeleton

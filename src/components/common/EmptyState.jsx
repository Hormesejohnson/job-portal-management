const EmptyState = ({ title = 'No items found', message = 'Try adjusting your filters or search query.', action, actionLabel = 'Reset' }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
    <p className="mt-2 text-sm text-slate-500">{message}</p>
    {action && (
      <button onClick={action} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
        {actionLabel}
      </button>
    )}
  </div>
)

export default EmptyState

const ErrorMessage = ({ title = 'Something went wrong', message, action, actionLabel = 'Retry' }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
    <h3 className="text-base font-semibold">{title}</h3>
    {message && <p className="mt-2 text-sm">{message}</p>}
    {action && (
      <button onClick={action} className="mt-4 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
        {actionLabel}
      </button>
    )}
  </div>
)

export default ErrorMessage

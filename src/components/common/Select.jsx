const Select = ({ label, options = [], error, register, name, className = '', ...props }) => (
  <label className="block text-sm font-medium text-slate-700">
    {label && <span className="mb-1.5 block">{label}</span>}
    <select
      className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
        error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      } ${className}`}
      {...register(name)}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value ?? option} value={option.value ?? option}>
          {option.label ?? option}
        </option>
      ))}
    </select>
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
)

export default Select

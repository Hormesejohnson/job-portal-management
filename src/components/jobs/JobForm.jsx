import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { categories, locations } from '../../mock/seedData'

const schema = yup.object({
  title: yup.string().trim().required('Job title is required').min(3, 'Minimum 3 characters').max(80, 'Maximum 80 characters'),
  company: yup.string().trim().required('Company is required').min(2, 'Minimum 2 characters').max(80, 'Maximum 80 characters'),
  description: yup.string().trim().required('Description is required').min(30, 'Description must be at least 30 characters').max(1500, 'Description is too long'),
  category: yup.string().required('Category is required'),
  location: yup.string().trim().required('Location is required').min(2, 'Minimum 2 characters'),
  jobType: yup.string().required('Job type is required'),
  experienceLevel: yup.string().required('Experience is required'),
  salaryMin: yup.number().typeError('Salary minimum must be a number').min(30000, 'Minimum salary must be at least 30,000').required('Minimum salary is required'),
  salaryMax: yup.number().typeError('Salary maximum must be a number').min(30000, 'Maximum salary must be at least 30,000').min(yup.ref('salaryMin'), 'Maximum salary must be greater than or equal to minimum salary').required('Maximum salary is required'),
  skills: yup.string().trim().required('At least one skill is required'),
  requirements: yup.string().trim().required('Requirements are required').min(10, 'Requirements must be at least 10 characters'),
  responsibilities: yup.string().trim().required('Responsibilities are required').min(10, 'Responsibilities must be at least 10 characters'),
  status: yup.string().required('Status is required'),
})

const defaultValues = {
  title: '',
  company: '',
  description: '',
  category: categories[0],
  location: '',
  jobType: 'Full Time',
  experienceLevel: 'Fresher',
  salaryMin: '',
  salaryMax: '',
  skills: '',
  requirements: '',
  responsibilities: '',
  status: 'Active',
}

const normalizeJobData = (job) => ({
  ...job,
  salaryMin: job?.salaryMin ?? '',
  salaryMax: job?.salaryMax ?? '',
  skills: Array.isArray(job?.skills) ? job.skills.join(', ') : job?.skills || '',
  requirements: Array.isArray(job?.requirements) ? job.requirements.join('\n') : job?.requirements || '',
  responsibilities: Array.isArray(job?.responsibilities) ? job.responsibilities.join('\n') : job?.responsibilities || '',
})

const JobForm = ({ initialValues, onSubmit, onCancel, submitLabel = 'Save Job', isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: normalizeJobData(initialValues || defaultValues),
  })

  useEffect(() => {
    reset(normalizeJobData(initialValues || defaultValues))
  }, [initialValues, reset])

  const fieldClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  const errorClass = 'text-xs text-red-600 mt-1 block'

  const submit = (values) => {
    const payload = {
      ...values,
      salaryMin: Number(values.salaryMin),
      salaryMax: Number(values.salaryMax),
      skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      requirements: values.requirements.split('\n').map((item) => item.trim()).filter(Boolean),
      responsibilities: values.responsibilities.split('\n').map((item) => item.trim()).filter(Boolean),
      featured: false,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Job title</label>
          <input {...register('title')} className={fieldClass} />
          {errors.title && <span className={errorClass}>{errors.title.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Company</label>
          <input {...register('company')} className={fieldClass} />
          {errors.company && <span className={errorClass}>{errors.company.message}</span>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <textarea rows={5} {...register('description')} className={fieldClass} />
          {errors.description && <span className={errorClass}>{errors.description.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
          <select {...register('category')} className={fieldClass}>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <span className={errorClass}>{errors.category.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
          <select {...register('location')} className={fieldClass}>
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && <span className={errorClass}>{errors.location.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Job type</label>
          <select {...register('jobType')} className={fieldClass}>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.jobType && <span className={errorClass}>{errors.jobType.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Experience level</label>
          <select {...register('experienceLevel')} className={fieldClass}>
            <option value="Fresher">Fresher</option>
            <option value="1-2 Years">1-2 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
          {errors.experienceLevel && <span className={errorClass}>{errors.experienceLevel.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Salary minimum</label>
          <input type="number" {...register('salaryMin')} className={fieldClass} />
          {errors.salaryMin && <span className={errorClass}>{errors.salaryMin.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Salary maximum</label>
          <input type="number" {...register('salaryMax')} className={fieldClass} />
          {errors.salaryMax && <span className={errorClass}>{errors.salaryMax.message}</span>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Skills (comma separated)</label>
          <input {...register('skills')} className={fieldClass} />
          {errors.skills && <span className={errorClass}>{errors.skills.message}</span>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Requirements (one per line)</label>
          <textarea rows={4} {...register('requirements')} className={fieldClass} />
          {errors.requirements && <span className={errorClass}>{errors.requirements.message}</span>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Responsibilities (one per line)</label>
          <textarea rows={4} {...register('responsibilities')} className={fieldClass} />
          {errors.responsibilities && <span className={errorClass}>{errors.responsibilities.message}</span>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select {...register('status')} className={fieldClass}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <span className={errorClass}>{errors.status.message}</span>}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel || (() => window.history.back())}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default JobForm

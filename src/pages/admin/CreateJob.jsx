import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import JobForm from '../../components/jobs/JobForm'
import { createJob } from '../../features/jobs/jobsSlice'
import { selectCreateJobStatus } from '../../features/jobs/jobsSelectors'

const CreateJob = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const createStatus = useSelector(selectCreateJobStatus)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (payload) => {
    try {
      await dispatch(createJob(payload)).unwrap()
      setFeedback('Job created successfully')
      navigate('/admin/jobs')
    } catch (error) {
      setFeedback(error || 'Failed to create job')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Create</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">New job posting</h1>
          </div>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {feedback && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{feedback}</div>}
        <JobForm onSubmit={handleSubmit} onCancel={() => navigate('/admin/jobs')} submitLabel="Create job" isSubmitting={createStatus === 'loading'} />
      </div>
    </div>
  )
}

export default CreateJob

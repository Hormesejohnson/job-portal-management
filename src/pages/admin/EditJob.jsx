import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import JobForm from '../../components/jobs/JobForm'
import { fetchJobById, updateJob } from '../../features/jobs/jobsSlice'
import { selectJobsError, selectSelectedJob, selectUpdateJobStatus } from '../../features/jobs/jobsSelectors'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const EditJob = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const job = useSelector(selectSelectedJob)
  const error = useSelector(selectJobsError)
  const updateStatus = useSelector(selectUpdateJobStatus)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    dispatch(fetchJobById(id))
  }, [dispatch, id])

  const handleSubmit = async (payload) => {
    try {
      await dispatch(updateJob({ id, payload })).unwrap()
      setFeedback('Job updated successfully')
      navigate('/admin/jobs')
    } catch (error) {
      setFeedback(error || 'Failed to update job')
    }
  }

  if (!job && error) return <ErrorMessage title="Could not load this job" message="Please try again." action={() => dispatch(fetchJobById(id))} />
  if (!job) return <LoadingSpinner label="Loading job details..." />

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Edit</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Update job posting</h1>
          </div>
          <button type="button" onClick={() => window.history.back()} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Back
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {feedback && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{feedback}</div>}
        <JobForm initialValues={job} onSubmit={handleSubmit} onCancel={() => navigate('/admin/jobs')} submitLabel="Update job" isSubmitting={updateStatus === 'loading'} />
      </div>
    </div>
  )
}

export default EditJob

import { delay } from '../utils/delay'
import { seedJobs } from '../mock/seedData'

const JOBS_STORAGE_KEY = 'jobPortalJobs'

const getJobs = () => {
  const stored = localStorage.getItem(JOBS_STORAGE_KEY)
  if (!stored) return seedJobs

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem(JOBS_STORAGE_KEY)
    return seedJobs
  }
}

const saveJobs = (jobs) => localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs))

export const fetchJobsApi = async () => {
  await delay(500)
  return getJobs()
}

export const fetchJobByIdApi = async (id) => {
  await delay(400)
  const jobs = getJobs()
  const job = jobs.find((item) => item.id === id)

  if (!job) {
    throw new Error('Job not found')
  }

  return job
}

export const createJobApi = async (payload) => {
  await delay(700)
  const jobs = getJobs()
  const job = {
    ...payload,
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString(),
    featured: Boolean(payload.featured),
    status: payload.status || 'Active',
  }

  const next = [job, ...jobs]
  saveJobs(next)
  return job
}

export const updateJobApi = async (id, payload) => {
  await delay(700)
  const jobs = getJobs()
  const index = jobs.findIndex((job) => job.id === id)

  if (index === -1) {
    throw new Error('Job not found')
  }

  const updated = { ...jobs[index], ...payload, id }
  jobs[index] = updated
  saveJobs(jobs)
  return updated
}

export const deleteJobApi = async (id) => {
  await delay(500)
  const jobs = getJobs()
  const exists = jobs.some((job) => job.id === id)

  if (!exists) {
    throw new Error('Job could not be deleted')
  }

  const next = jobs.filter((job) => job.id !== id)
  saveJobs(next)
  return { success: true }
}

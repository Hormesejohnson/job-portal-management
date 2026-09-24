import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createJobApi,
  deleteJobApi,
  fetchJobByIdApi,
  fetchJobsApi,
  updateJobApi,
} from '../../services/jobsApi'

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const jobs = await fetchJobsApi()
    return jobs
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id, { rejectWithValue }) => {
  try {
    const job = await fetchJobByIdApi(id)
    return job
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createJob = createAsyncThunk('jobs/createJob', async (payload, { rejectWithValue }) => {
  try {
    const job = await createJobApi(payload)
    return job
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const job = await updateJobApi(id, payload)
    return job
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id, { rejectWithValue }) => {
  try {
    await deleteJobApi(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  jobLoading: false,
  error: null,
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch jobs'
      })
      .addCase(fetchJobById.pending, (state) => {
        state.jobLoading = true
        state.error = null
        state.selectedJob = null
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobLoading = false
        state.selectedJob = action.payload
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobLoading = false
        state.selectedJob = null
        state.error = action.payload || 'Failed to fetch job'
      })
      .addCase(createJob.pending, (state) => {
        state.createStatus = 'loading'
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.createStatus = 'success'
        state.jobs = [action.payload, ...state.jobs]
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.payload || 'Create job failed'
      })
      .addCase(updateJob.pending, (state) => {
        state.updateStatus = 'loading'
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateStatus = 'success'
        state.jobs = state.jobs.map((job) => (job.id === action.payload.id ? action.payload : job))
        if (state.selectedJob && state.selectedJob.id === action.payload.id) {
          state.selectedJob = action.payload
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.error = action.payload || 'Update job failed'
      })
      .addCase(deleteJob.pending, (state) => {
        state.deleteStatus = 'loading'
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.deleteStatus = 'success'
        state.jobs = state.jobs.filter((job) => job.id !== action.payload)
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.error = action.payload || 'Delete job failed'
      })
  },
})

export const { clearJobError, clearSelectedJob } = jobsSlice.actions
export default jobsSlice.reducer

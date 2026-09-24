import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const APPLICATIONS_KEY = 'jobPortalApplications'

const loadPersistedApplications = () => {
  const raw = localStorage.getItem(APPLICATIONS_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(APPLICATIONS_KEY)
    return []
  }
}

export const fetchAppliedJobs = createAsyncThunk('applications/fetchAppliedJobs', async (_, { rejectWithValue }) => {
  try {
    const applications = loadPersistedApplications()
    return applications
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const applyForJob = createAsyncThunk('applications/applyForJob', async ({ jobId, userId }, { rejectWithValue, getState }) => {
  try {
    const { applications } = getState()
    const list = applications.appliedJobs || []
    const alreadyExists = list.some((item) => item.jobId === jobId && item.userId === userId)

    if (alreadyExists) {
      throw new Error('You have already applied for this job')
    }

    const application = {
      id: `app-${Date.now()}`,
      jobId,
      userId,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
    }

    const next = [...list, application]
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(next))
    return application
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  appliedJobs: loadPersistedApplications(),
  loading: false,
  error: null,
  applicationStatus: 'idle',
}

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false
        state.appliedJobs = action.payload
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load applications'
      })
      .addCase(applyForJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false
        state.appliedJobs = [...state.appliedJobs, action.payload]
        state.applicationStatus = 'success'
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Application failed'
        state.applicationStatus = 'failed'
      })
  },
})

export const { clearApplicationError } = applicationsSlice.actions
export default applicationsSlice.reducer

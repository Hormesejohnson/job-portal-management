import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import jobsReducer from '../features/jobs/jobsSlice'
import applicationsReducer from '../features/applications/applicationsSlice'
import filtersReducer from '../features/filters/filtersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store

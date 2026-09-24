export const selectJobs = (state) => state.jobs.jobs
export const selectSelectedJob = (state) => state.jobs.selectedJob
export const selectJobsLoading = (state) => state.jobs.loading
export const selectJobLoading = (state) => state.jobs.jobLoading
export const selectJobsError = (state) => state.jobs.error
export const selectCreateJobStatus = (state) => state.jobs.createStatus
export const selectUpdateJobStatus = (state) => state.jobs.updateStatus
export const selectDeleteJobStatus = (state) => state.jobs.deleteStatus

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: '',
  category: 'All',
  experience: 'All',
  location: 'All',
  jobType: 'All',
  status: 'All',
  salaryMin: '',
  salaryMax: '',
  sortBy: 'mostRecent',
  currentPage: 1,
  pageSize: 6,
  adminCurrentPage: 1,
  adminPageSize: 8,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
      state.currentPage = 1
    },
    setCategory: (state, action) => {
      state.category = action.payload
      state.currentPage = 1
    },
    setExperience: (state, action) => {
      state.experience = action.payload
      state.currentPage = 1
    },
    setLocation: (state, action) => {
      state.location = action.payload
      state.currentPage = 1
    },
    setJobType: (state, action) => {
      state.jobType = action.payload
      state.currentPage = 1
    },
    setStatus: (state, action) => {
      state.status = action.payload
      state.adminCurrentPage = 1
    },
    setSalaryMin: (state, action) => {
      state.salaryMin = action.payload
      state.currentPage = 1
    },
    setSalaryMax: (state, action) => {
      state.salaryMax = action.payload
      state.currentPage = 1
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setAdminCurrentPage: (state, action) => {
      state.adminCurrentPage = action.payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload
      state.currentPage = 1
    },
    clearFilters: (state) => {
      state.search = ''
      state.category = 'All'
      state.experience = 'All'
      state.location = 'All'
      state.jobType = 'All'
      state.salaryMin = ''
      state.salaryMax = ''
      state.sortBy = 'mostRecent'
      state.currentPage = 1
      state.status = 'All'
      state.adminCurrentPage = 1
    },
  },
})

export const {
  setSearch,
  setCategory,
  setExperience,
  setLocation,
  setJobType,
  setStatus,
  setSalaryMin,
  setSalaryMax,
  setSortBy,
  setCurrentPage,
  setAdminCurrentPage,
  setPageSize,
  clearFilters,
} = filtersSlice.actions

export default filtersSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getStoredAuth, loginUser } from '../../services/authApi'

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await loginUser({ username, password })
    localStorage.setItem('jobPortalAuth', JSON.stringify(response))
    return response
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('jobPortalAuth')
  return null
})

const persistedAuth = getStoredAuth()

const initialState = {
  user: persistedAuth?.user || null,
  token: persistedAuth?.token || null,
  role: persistedAuth?.user?.role || null,
  isAuthenticated: Boolean(persistedAuth?.user),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.role = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer

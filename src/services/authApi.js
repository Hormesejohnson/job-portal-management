import { delay } from '../utils/delay'
import { adminUser, regularUser } from '../mock/seedData'

export const loginUser = async ({ username, password }) => {
  await delay(600)

  const credentials = {
    admin: { username: 'admin', password: 'admin123' },
    user: { username: 'user', password: 'user123' },
  }

  const normalizedUsername = username.trim()

  if (normalizedUsername === credentials.admin.username && password === credentials.admin.password) {
    return {
      user: { ...adminUser, role: 'ADMIN' },
      token: 'admin-token',
    }
  }

  if (normalizedUsername === credentials.user.username && password === credentials.user.password) {
    return {
      user: { ...regularUser, role: 'USER' },
      token: 'user-token',
    }
  }

  throw new Error('Invalid username or password')
}

export const getStoredAuth = () => {
  const raw = localStorage.getItem('jobPortalAuth')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem('jobPortalAuth')
    return null
  }
}

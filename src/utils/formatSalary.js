import { locations } from '../mock/seedData'

const indianLocations = new Set([...locations, 'Remote'])

export const isIndianLocation = (location = '') => {
  const normalizedLocation = location.toLowerCase()
  return [...indianLocations].some((city) => normalizedLocation.includes(city.toLowerCase()))
}

export const formatSalary = (amount, location) => {
  const currency = isIndianLocation(location) ? 'INR' : 'USD'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

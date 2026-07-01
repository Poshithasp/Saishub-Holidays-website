// The ONLY package names permitted in the system.
// Attempting to create a package with any other name is rejected.

export const ALLOWED_PACKAGES = {
  Domestic: [
    'Mysore Sightseeing - 1 Day',
    'Mysore - Ooty - Coonoor - 3 Days',
    'Ooty - Coonoor - 2 Days',
    'Munnar - Alleppey - Cochin - 4 Days',
    'Hyderabad - Ramoji Film City - 3 Days',
    'Delhi - Agra - Jaipur - 5 Days',
  ],
  Pilgrimage: [
    'Tirupati Sarva Darshan - 1 Day',
    'Tirupati - Srikalahasti Package',
    'Tirupati - Madurai - Rameshwaram - 3 Days',
    'Madurai - Rameshwaram - Kanyakumari - 3 Days',
    'Shirdi - Shani Shingnapur - Nashik - 3 Days',
    'Varanasi - Gaya - Prayagraj - Ayodhya - 6 Days',
  ],
  International: [],
}

export const ALL_ALLOWED_PACKAGE_NAMES = [
  ...ALLOWED_PACKAGES.Domestic,
  ...ALLOWED_PACKAGES.Pilgrimage,
  ...ALLOWED_PACKAGES.International,
]

export function isAllowedPackage(name, category) {
  if (!name || !category) return false
  if (!ALLOWED_PACKAGES[category]) return false
  return ALLOWED_PACKAGES[category].includes(name)
}

export function normalizeName(name) {
  // Convert em/en dashes to hyphens and collapse whitespace
  return String(name || '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

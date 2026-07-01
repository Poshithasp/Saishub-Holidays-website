'use client'

// Open an external URL in a new top-level tab.
// This bypasses iframe/preview restrictions that sometimes make plain
// `<a target="_blank">` links show "app blocked" errors on Facebook/Instagram.
export function openExternal(url) {
  try {
    // Prefer window.open from a user gesture — most browsers allow this
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (w) { try { w.opener = null } catch {} ; return }
  } catch {}
  // Fallback 1: break out of iframe to the top window
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = url
      return
    }
  } catch {}
  // Fallback 2: navigate the current tab
  window.location.href = url
}

// Ready-to-spread props for an <a> that opens externally without iframe issues.
export function externalLinkProps(url) {
  return {
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: (e) => {
      e.preventDefault()
      openExternal(url)
    },
  }
}

// Well-known social URLs for Saishubh Holidays — single source of truth.
export const SOCIAL = {
  whatsapp: (text) => `https://wa.me/919945883774${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  whatsappAlt: 'https://api.whatsapp.com/send?phone=919945883774',
  instagram: 'https://www.instagram.com/saishubholidays2026/',
  facebook: 'https://www.facebook.com/profile.php?id=61590662553881',
  phonePrimary: 'tel:+919945883774',
  phoneSecondary: 'tel:+919342196683',
  email: 'mailto:saishubholidays@gmail.com',
  mapsUrl: 'https://www.google.com/maps/place/108,+Dr+Rajkumar+Rd,+near+Navrang+Theatre,+1st+Block,+2nd+Stage,+Rajajinagar,+Bengaluru,+Karnataka+560010',
}

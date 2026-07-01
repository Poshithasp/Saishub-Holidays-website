'use client'

// Try to open an external URL in a real new browser tab.
// Returns true if a new tab/window opened successfully.
export function openExternal(url) {
  try {
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (w) {
      try { w.opener = null } catch {}
      return true
    }
  } catch {}
  return false
}

// Props to spread on an <a>. Ensures:
//  1. Left-click tries to open in a new tab via window.open (from a user gesture).
//  2. If popup is blocked / opener returns null, falls through to the anchor's
//     default navigation with target="_top" — which escapes any parent iframe
//     and navigates the whole browser tab. This is critical because sites like
//     api.whatsapp.com / facebook.com / instagram.com send X-Frame-Options: DENY
//     and refuse to load inside iframes (ERR_BLOCKED_BY_RESPONSE).
//  3. Middle-click / cmd+click / right-click "Open in new tab" still works
//     natively because the href is preserved.
export function externalLinkProps(url) {
  return {
    href: url,
    target: '_top',
    rel: 'noopener noreferrer',
    onClick: (e) => {
      // Only intercept plain left clicks with no modifier keys.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const opened = openExternal(url)
      if (opened) e.preventDefault()
      // If popup was blocked, let the browser follow the anchor with target="_top",
      // which safely escapes the iframe and navigates the outer tab.
    },
  }
}

// Well-known social URLs for Saishubh Holidays — single source of truth.
export const SOCIAL = {
  // wa.me is the official short URL. It handles both mobile (opens WhatsApp app)
  // and desktop (opens web.whatsapp.com) automatically.
  whatsapp: (text) => `https://wa.me/919945883774${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  instagram: 'https://www.instagram.com/saishubholidays2026/',
  facebook: 'https://www.facebook.com/profile.php?id=61590662553881',
  phonePrimary: 'tel:+919945883774',
  phoneSecondary: 'tel:+919342196683',
  email: 'mailto:saishubholidays@gmail.com',
  mapsUrl: 'https://www.google.com/maps/place/108,+Dr+Rajkumar+Rd,+near+Navrang+Theatre,+1st+Block,+2nd+Stage,+Rajajinagar,+Bengaluru,+Karnataka+560010',
}

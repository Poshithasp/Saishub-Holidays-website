'use client'

// Attempt to open the URL in a new browser tab.
// Returns true if a new window was opened, false otherwise (e.g. popup blocked).
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

/**
 * Props to spread on an <a> that must always leave the current page.
 *
 * Behaviour:
 *   - Left click without modifiers: preventDefault + try window.open.
 *     If popup is blocked (common inside preview iframes with sandbox), we
 *     dispatch an `external-link-blocked` event that <ExternalLinkGate /> in
 *     the root layout listens for and shows a friendly modal with a "Copy"
 *     and "Open in New Tab" button.
 *   - Modifier / middle / right click: default behaviour is preserved so
 *     users can still use the browser's native "Open in new tab" menu.
 *
 * We never let the browser navigate the current iframe because sites like
 * api.whatsapp.com / facebook.com / instagram.com set X-Frame-Options: DENY
 * and would show ERR_BLOCKED_BY_RESPONSE inside a preview iframe.
 */
export function externalLinkProps(url) {
  return {
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    onClick: (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      const opened = openExternal(url)
      if (!opened && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('external-link-blocked', { detail: { url } }))
      }
    },
  }
}

// Well-known social URLs for Saishubh Holidays — single source of truth.
export const SOCIAL = {
  whatsapp: (text) => `https://wa.me/919945883774${text ? `?text=${encodeURIComponent(text)}` : ''}`,
  instagram: 'https://www.instagram.com/saishubholidays2026/',
  facebook: 'https://www.facebook.com/profile.php?id=61590662553881',
  phonePrimary: 'tel:+919945883774',
  phoneSecondary: 'tel:+919342196683',
  email: 'mailto:saishubholidays@gmail.com',
  mapsUrl: 'https://www.google.com/maps/place/108,+Dr+Rajkumar+Rd,+near+Navrang+Theatre,+1st+Block,+2nd+Stage,+Rajajinagar,+Bengaluru,+Karnataka+560010',
}

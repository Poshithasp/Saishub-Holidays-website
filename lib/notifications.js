// Notification service for new enquiries.
// Supports:
//   - Email (SendGrid HTTPS API)  — needs SENDGRID_API_KEY, NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM
//   - WhatsApp (Meta WhatsApp Cloud API) — needs WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, NOTIFY_WHATSAPP_TO
//
// If a service's env vars are missing, that channel is silently skipped (with a
// console.info log). The enquiry route calls `notifyNewEnquiry` fire-and-forget
// so failures never block the user's request.

function fmt(enquiry) {
  return {
    subject: `New enquiry · ${enquiry.name}${enquiry.packageName ? ' · ' + enquiry.packageName : ''}`,
    lines: [
      `Name: ${enquiry.name}`,
      `Phone: ${enquiry.phone}`,
      enquiry.email ? `Email: ${enquiry.email}` : null,
      enquiry.packageName ? `Package: ${enquiry.packageName}` : null,
      enquiry.travelDate ? `Travel Date: ${enquiry.travelDate}` : null,
      enquiry.message ? `Message: ${enquiry.message}` : null,
      `Received: ${new Date(enquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    ].filter(Boolean),
  }
}

async function sendEmail(enquiry) {
  const key = process.env.SENDGRID_API_KEY
  const to = process.env.NOTIFY_EMAIL_TO
  const from = process.env.NOTIFY_EMAIL_FROM
  if (!key || !to || !from) {
    console.info('[notify] Email skipped — SENDGRID_API_KEY / NOTIFY_EMAIL_TO / NOTIFY_EMAIL_FROM not configured')
    return { ok: false, skipped: true, reason: 'missing_config' }
  }
  const { subject, lines } = fmt(enquiry)
  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.6"><h2 style="color:#1f6a3c">New Enquiry — Saishubh Holidays</h2><ul>${lines.map(l => `<li>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</li>`).join('')}</ul><p style="color:#666;font-size:12px">This is an automated notification.</p></div>`
  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: to.split(',').map(e => ({ email: e.trim() })) }],
        from: { email: from, name: 'Saishubh Holidays' },
        subject,
        content: [
          { type: 'text/plain', value: lines.join('\n') },
          { type: 'text/html', value: html },
        ],
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[notify] SendGrid failed', res.status, text)
      return { ok: false, error: text }
    }
    console.info('[notify] Email sent to', to)
    return { ok: true }
  } catch (e) {
    console.error('[notify] Email error', e)
    return { ok: false, error: String(e) }
  }
}

async function sendWhatsApp(enquiry) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const to = process.env.NOTIFY_WHATSAPP_TO // e.g. "919945883774"
  if (!token || !phoneId || !to) {
    console.info('[notify] WhatsApp skipped — WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID / NOTIFY_WHATSAPP_TO not configured')
    return { ok: false, skipped: true, reason: 'missing_config' }
  }
  const { lines } = fmt(enquiry)
  const body = `\ud83c\udf3f *New Enquiry — Saishubh Holidays*\n\n${lines.join('\n')}`
  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { preview_url: false, body },
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[notify] WhatsApp failed', res.status, text)
      return { ok: false, error: text }
    }
    console.info('[notify] WhatsApp sent to', to)
    return { ok: true }
  } catch (e) {
    console.error('[notify] WhatsApp error', e)
    return { ok: false, error: String(e) }
  }
}

// Fire-and-forget notification. Callers should NOT await this in a way that
// blocks the response — use `notifyNewEnquiry(enq).catch(() => {})`.
export async function notifyNewEnquiry(enquiry) {
  const [emailRes, waRes] = await Promise.allSettled([sendEmail(enquiry), sendWhatsApp(enquiry)])
  return {
    email: emailRes.status === 'fulfilled' ? emailRes.value : { ok: false, error: String(emailRes.reason) },
    whatsapp: waRes.status === 'fulfilled' ? waRes.value : { ok: false, error: String(waRes.reason) },
  }
}

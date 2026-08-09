export type LeadPayload = {
  type: 'assessment' | 'contact' | 'booking'
  submittedAt: string
  details: Record<string, string | number>
}

const leadEndpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined

/**
 * Sends a lead to a secure server-side endpoint. The endpoint must send any
 * notification emails and must never expose its provider key in the browser.
 */
export async function submitLead(payload: LeadPayload): Promise<'sent' | 'pending-setup'> {
  if (!leadEndpoint) return 'pending-setup'

  const response = await fetch(leadEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Lead delivery could not be completed.')
  return 'sent'
}

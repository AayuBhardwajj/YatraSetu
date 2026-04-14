export function resolveMediaUrl(publicIdOrUrl: string | null | undefined): string {
  if (!publicIdOrUrl) return ''
  if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_800/${publicIdOrUrl}`
}

export async function uploadToCloudinary(
  file: File,
  signPayload: {
    signature: string
    timestamp: number
    cloudName: string
    apiKey: string
    public_id: string
    folder: string
  }
): Promise<{ public_id: string; secure_url: string }> {
  const form = new FormData()
  form.append('file', file)
  form.append('signature', signPayload.signature)
  form.append('timestamp', String(signPayload.timestamp))
  form.append('api_key', signPayload.apiKey)
  form.append('public_id', signPayload.public_id)
  form.append('folder', signPayload.folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`,
    { method: 'POST', body: form }
  )

  if (!res.ok) throw new Error('Cloudinary upload failed')

  const data = await res.json()
  return { public_id: data.public_id, secure_url: data.secure_url }
}

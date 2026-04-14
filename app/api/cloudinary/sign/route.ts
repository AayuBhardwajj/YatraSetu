import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // Verify the caller is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { docType } = await request.json()

  if (!docType) {
    return NextResponse.json({ error: 'docType is required' }, { status: 400 })
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = `zipp/${user.id}/${docType}`
  const public_id = `${docType}_${timestamp}`

  // Cloudinary signature: sign sorted params + secret (no & before secret)
  const paramsToSign = `folder=${folder}&public_id=${public_id}&timestamp=${timestamp}`
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  return NextResponse.json({ signature, timestamp, cloudName, apiKey, public_id, folder })
}

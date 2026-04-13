import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis'

/**
 * Cloudinary Signature Generator
 */
export async function POST(request: Request) {
  try {
    const { userId, docType, fileHash, timestamp: reqTimestamp } = await request.json();

    if (!userId || !docType || !fileHash) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Redis Idempotency Guard (Lock the upload for 60s)
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const lockKey = `upload:lock:${userId}:${fileHash}`;
    const isLocked = await redis.get(lockKey);

    if (isLocked) {
      return NextResponse.json({ error: 'Upload in progress or duplicate hash' }, { status: 409 });
    }

    // Set lock
    await redis.set(lockKey, 'locked', { ex: 60 });

    // 2. Cloudinary Signature Generation
    const timestamp = reqTimestamp || Math.round(new Date().getTime() / 1000);
    const folder = `drivers/${userId}/kyc/${docType}`;
    const public_id = `${timestamp}`; // We use timestamp as id within the folder
    
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

    // Parameters to sign (alphabetical order)
    const paramsToSign = `folder=${folder}&public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
    
    // Hash using SHA-1 (Cloudinary standard)
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      cloudName,
      apiKey,
      public_id,
      folder
    });
  } catch (error) {
    console.error('Signature Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

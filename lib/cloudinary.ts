import axios from 'axios';

/**
 * Resolves a Cloudinary public ID or URL into an optimized CDN URL.
 */
export function resolveMediaUrl(publicId: string | null | undefined): string {
  if (!publicId) return '';
  
  // If it's already a full URL, return it
  if (publicId.startsWith('http')) return publicId;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Basic optimization: f_auto (format), q_auto (quality), w_auto/dpr_auto
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_800/dpr_auto/${publicId}`;
}

/**
 * Uploads a file directly to Cloudinary using a pre-signed signature.
 */
export async function uploadToCloudinary(
  file: File,
  signaturePayload: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    public_id: string;
    folder: string;
  }
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signaturePayload.signature);
  formData.append('timestamp', signaturePayload.timestamp.toString());
  formData.append('api_key', signaturePayload.apiKey);
  formData.append('public_id', signaturePayload.public_id);
  formData.append('folder', signaturePayload.folder);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
    formData
  );

  return {
    public_id: response.data.public_id,
    secure_url: response.data.secure_url,
  };
}

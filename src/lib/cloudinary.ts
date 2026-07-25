import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

const CLOUDINARY_BASE = () => `https://res.cloudinary.com/${CLOUD_NAME}`;
const PROXY_BASE = 'https://images.arrow.taxi';

function sign(params: Record<string, string>): string {
  const payload =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + API_SECRET;
  return crypto.createHash('sha1').update(payload).digest('hex');
}

/** Convert a Cloudinary secure_url to the images.arrow.taxi proxy URL. */
export function toProxyUrl(cloudinaryUrl: string): string {
  return cloudinaryUrl.replace(CLOUDINARY_BASE(), PROXY_BASE);
}

/** Returns true only for images we uploaded (served via the proxy). */
export function isProxyUrl(url: string): boolean {
  return url.startsWith(PROXY_BASE + '/');
}

/**
 * Derives the Cloudinary public_id from a proxy URL.
 * https://images.arrow.taxi/image/upload/v1234/folder/name.jpg → folder/name
 */
export function extractPublicId(url: string): string | null {
  if (!isProxyUrl(url)) return null;
  const path = url.slice(PROXY_BASE.length);
  const match = path.match(/\/image\/upload\/(?:v\d+\/)?(.+)/);
  if (!match) return null;
  return match[1].replace(/\.[^.]+$/, '');
}

/** Upload a File to Cloudinary (server-side signed). Returns proxy URL + public_id. */
export async function uploadToCloudinary(
  file: File,
  folder = 'cms'
): Promise<{ url: string; publicId: string }> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = sign({ folder, timestamp });

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', API_KEY);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = await res.json();
  return { url: toProxyUrl(data.secure_url), publicId: data.public_id };
}

/** Delete a Cloudinary asset by public_id. Fire-and-forget safe. */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = sign({ public_id: publicId, timestamp });

  const form = new FormData();
  form.append('public_id', publicId);
  form.append('api_key', API_KEY);
  form.append('timestamp', timestamp);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    console.error('[deleteFromCloudinary] failed for', publicId, await res.text());
  }
}

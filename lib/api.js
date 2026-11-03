export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || 'Something went wrong. Please try again.'), { status: res.status });
  return data;
}
export const safeNext = (n) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/\\') ? n : '/');
export const localDate = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const CATEGORIES = ['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Workshop'];
export const AMENITIES = ['Wi-Fi', 'Air Conditioning', 'Backdrop Rolls', 'Soundproofing', 'Lighting Kit', 'Green Screen', 'Mic & Interface', 'Parking', 'Makeup Room', 'Coffee Bar'];
export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error('Image upload is not configured. Paste an image URL instead.');
  const fd = new FormData(); fd.append('image', file);
  const r = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: 'POST', body: fd });
  const d = await r.json();
  if (!d.success) throw new Error('Image upload failed. Try again.');
  return d.data.url;
}
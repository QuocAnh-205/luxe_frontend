// VITE_API_URL để trống khi build Docker => gọi /api cùng origin, Nginx proxy sang backend
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  const auth = token ?? localStorage.getItem('luxe_token');
  if (auth) headers.Authorization = `Bearer ${auth}`;

  const res = await fetch(`${BASE}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Lỗi ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const formatPrice = (v) => `${Number(v || 0).toLocaleString('vi-VN')}₫`;

export const discountPercent = (p) =>
  p.original_price && p.original_price > p.price ? Math.round((1 - p.price / p.original_price) * 100) : 0;

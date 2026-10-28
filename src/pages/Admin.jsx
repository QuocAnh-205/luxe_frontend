import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { AlertTriangle, LayoutDashboard, Loader2, Package, Pencil, Plus, ShoppingCart, Trash2, Users, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api, formatPrice } from '../lib/api';

const STATUS = {
  pending: ['Chờ xác nhận', 'bg-amber-50 text-amber-700'],
  paid: ['Đã thanh toán', 'bg-sky-50 text-sky-700'],
  shipping: ['Đang giao', 'bg-indigo-50 text-indigo-700'],
  completed: ['Hoàn thành', 'bg-emerald-50 text-emerald-700'],
  cancelled: ['Đã huỷ', 'bg-red-50 text-red-700'],
};

// Tải dữ liệu admin, có hàm reload sau khi sửa
function useAdmin(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    api(path)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: null, loading: false, error }));
  }, [path]);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
}

const Card = ({ className = '', children }) => <div className={`rounded-3xl bg-white p-6 ring-1 ring-black/5 ${className}`}>{children}</div>;

function Dashboard() {
  const { data, loading, error } = useAdmin('/admin/stats');
  if (error) return <p className="text-red-600">{error.message}</p>;
  if (loading) return <div className="h-64 animate-pulse rounded-3xl bg-black/5" />;
  const { totals, byCategory, lowStock, recentOrders } = data;
  const maxSold = Math.max(...byCategory.map((c) => Number(c.sold)), 1);
  const stats = [
    ['Doanh thu', formatPrice(totals.revenue)],
    ['Đơn hàng', `${totals.orders} (${totals.pending_orders} chờ)`],
    ['Sản phẩm', totals.products],
    ['Khách hàng', totals.customers],
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-black/50">{label}</p>
            <p className="mt-2 text-2xl font-semibold" data-testid={`stat-${label}`}>{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Đã bán theo danh mục</h3>
          <ul className="space-y-3">
            {byCategory.map((c) => (
              <li key={c.name} className="text-sm">
                <div className="mb-1 flex justify-between"><span>{c.name}</span><span className="text-black/50">{c.sold} đã bán · {c.stock} tồn</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5"><div className="h-full rounded-full bg-gold" style={{ width: `${(c.sold / maxSold) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold"><AlertTriangle size={16} className="text-amber-500" /> Sắp hết hàng</h3>
          {lowStock.length === 0 && <p className="text-sm text-black/50">Không có sản phẩm nào sắp hết.</p>}
          <ul className="divide-y divide-black/5">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2 text-sm">
                <img src={p.image_url} alt="" className="product-bg h-10 w-10 rounded-lg object-contain p-1" />
                <Link to={`/product/${p.slug}`} className="flex-1 hover:text-gold">{p.name}</Link>
                <span className={`rounded-full px-2 py-0.5 text-xs ${p.stock === 0 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>Còn {p.stock}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h3 className="mb-4 font-semibold">Đơn hàng gần đây</h3>
        {recentOrders.length === 0 ? <p className="text-sm text-black/50">Chưa có đơn hàng.</p> : <OrderTable orders={recentOrders} compact />}
      </Card>
    </div>
  );
}

function OrderTable({ orders, compact, onStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-black/45 uppercase">
          <tr><th className="py-2">Mã</th><th>Khách hàng</th>{!compact && <th>Sản phẩm</th>}<th>Tổng</th><th>Ngày</th><th>Trạng thái</th></tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {orders.map((o) => {
            const [label, cls] = STATUS[o.status];
            return (
              <tr key={o.id} className="align-top">
                <td className="py-3 font-medium">#{o.id}</td>
                <td className="py-3">{o.full_name}<p className="text-xs text-black/45">{o.email}</p>{!compact && <p className="text-xs text-black/45">{o.phone} · {o.shipping_address}</p>}</td>
                {!compact && (
                  <td className="py-3 text-xs">
                    {o.items.map((i) => <p key={i.id}>{i.name}{i.size && ` (${i.size})`} ×{i.quantity}</p>)}
                  </td>
                )}
                <td className="py-3 whitespace-nowrap">{formatPrice(o.total_amount)}</td>
                <td className="py-3 whitespace-nowrap text-black/55">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="py-3">
                  {onStatus ? (
                    <select value={o.status} onChange={(e) => onStatus(o, e.target.value)} className={`rounded-full px-3 py-1.5 text-xs font-medium outline-none ${cls}`} aria-label={`Trạng thái đơn ${o.id}`}>
                      {Object.entries(STATUS).map(([v, [l]]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  ) : (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AdminOrders() {
  const { data, loading, error, reload } = useAdmin('/admin/orders');
  const { toast } = useStore();
  const setStatus = async (o, status) => {
    try {
      await api(`/admin/orders/${o.id}`, { method: 'PATCH', body: { status } });
      toast(`Đơn #${o.id}: ${STATUS[status][0]}`);
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  };
  if (error) return <p className="text-red-600">{error.message}</p>;
  return (
    <Card>
      {loading && !data ? <div className="h-40 animate-pulse rounded-xl bg-black/5" /> : data.orders.length === 0 ? <p className="text-sm text-black/50">Chưa có đơn hàng.</p> : <OrderTable orders={data.orders} onStatus={setStatus} />}
    </Card>
  );
}

const EMPTY = { name: '', slug: '', category_id: 1, price: '', original_price: '', stock: 10, sizes: '', color: '', material: '', gender: 'unisex', description: '', highlights: '', images: '', is_featured: false, is_new: true };

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function ProductForm({ initial, categories, onClose, onSaved }) {
  const { toast } = useStore();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const body = {
      ...form,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    try {
      await api(form.id ? `/admin/products/${form.id}` : '/admin/products', { method: form.id ? 'PUT' : 'POST', body });
      toast(form.id ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const preview = form.images.split('\n')[0]?.trim();
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="my-8 w-full max-w-3xl rounded-3xl bg-cream p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">{form.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng"><X /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">Tên sản phẩm<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })} className="input mt-1" /></label>
            <label className="text-sm">Slug<input required value={form.slug} onChange={set('slug')} className="input mt-1" /></label>
            <label className="text-sm">Danh mục
              <select value={form.category_id} onChange={set('category_id')} className="input mt-1">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <div className="product-bg hidden aspect-square rounded-2xl sm:block">{preview && <img src={preview} alt="" className="h-full w-full object-contain p-3" />}</div>
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-4">
            <label className="text-sm">Giá bán<input type="number" required min={0} value={form.price} onChange={set('price')} className="input mt-1" /></label>
            <label className="text-sm">Giá gốc<input type="number" min={0} value={form.original_price ?? ''} onChange={set('original_price')} className="input mt-1" /></label>
            <label className="text-sm">Tồn kho<input type="number" min={0} value={form.stock} onChange={set('stock')} className="input mt-1" /></label>
            <label className="text-sm">Giới tính
              <select value={form.gender} onChange={set('gender')} className="input mt-1"><option value="nu">Nữ</option><option value="nam">Nam</option><option value="unisex">Unisex</option></select>
            </label>
            <label className="text-sm">Size (phẩy)<input value={form.sizes} onChange={set('sizes')} placeholder="S,M,L" className="input mt-1" /></label>
            <label className="text-sm">Màu sắc<input value={form.color} onChange={set('color')} className="input mt-1" /></label>
            <label className="text-sm sm:col-span-2">Chất liệu<input value={form.material} onChange={set('material')} className="input mt-1" /></label>
          </div>
          <label className="text-sm sm:col-span-2">Mô tả<textarea rows={3} value={form.description} onChange={set('description')} className="input mt-1" /></label>
          <label className="text-sm">Đặc điểm (mỗi dòng 1 ý)<textarea rows={4} value={form.highlights} onChange={set('highlights')} className="input mt-1" /></label>
          <label className="text-sm">Ảnh (mỗi dòng 1 URL)<textarea rows={4} value={form.images} onChange={set('images')} className="input mt-1 font-mono text-xs" placeholder="/images/products/ten-anh-1.webp" /></label>
          <div className="flex gap-6 text-sm sm:col-span-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="accent-ink" /> Nổi bật</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_new} onChange={set('is_new')} className="accent-ink" /> Hàng mới</label>
          </div>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-light">Huỷ</button>
          <button disabled={saving} className="btn-dark">{saving && <Loader2 size={16} className="animate-spin" />} Lưu</button>
        </div>
      </form>
    </div>
  );
}

function AdminProducts() {
  const { data, loading, error, reload } = useAdmin('/products?limit=200&sort=newest');
  const { data: catData } = useAdmin('/categories');
  const { toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');

  const edit = async (p) => {
    const { product } = await api(`/products/${p.slug}`);
    setEditing({
      ...EMPTY,
      ...product,
      original_price: product.original_price ?? '',
      sizes: product.sizes.join(','),
      images: product.images.join('\n'),
      highlights: (product.highlights || []).join('\n'),
      description: product.description || '',
      color: product.color || '',
      material: product.material || '',
    });
  };
  const remove = async (p) => {
    if (!window.confirm(`Xoá “${p.name}”?`)) return;
    try {
      await api(`/admin/products/${p.id}`, { method: 'DELETE' });
      toast('Đã xoá sản phẩm');
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (error) return <p className="text-red-600">{error.message}</p>;
  const items = (data?.items || []).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên..." className="input max-w-xs" />
        <span className="text-sm text-black/50">{items.length} sản phẩm</span>
        <button onClick={() => setEditing({ ...EMPTY, category_id: catData?.categories[0]?.id || 1 })} className="btn-dark ml-auto"><Plus size={16} /> Thêm sản phẩm</button>
      </div>
      {loading && !data ? <div className="h-40 animate-pulse rounded-xl bg-black/5" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-black/45 uppercase"><tr><th className="py-2">Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn</th><th>Đã bán</th><th></th></tr></thead>
            <tbody className="divide-y divide-black/5">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt="" className="product-bg h-12 w-12 rounded-lg object-contain p-1" />
                      <div><p className="font-medium">{p.name}</p><p className="text-xs text-black/45">{p.slug}</p></div>
                    </div>
                  </td>
                  <td>{p.category_name}</td>
                  <td className="whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className={p.stock <= 10 ? 'font-medium text-amber-600' : ''}>{p.stock}</td>
                  <td>{p.sold}</td>
                  <td className="text-right whitespace-nowrap">
                    <button onClick={() => edit(p)} className="rounded-lg p-2 hover:bg-black/5" aria-label={`Sửa ${p.name}`}><Pencil size={16} /></button>
                    <button onClick={() => remove(p)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Xoá ${p.name}`}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && catData && (
        <ProductForm initial={editing} categories={catData.categories} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />
      )}
    </Card>
  );
}

function AdminUsers() {
  const { data, loading, error, reload } = useAdmin('/admin/users');
  const { user: me, toast } = useStore();
  const setRole = async (u, role) => {
    try {
      await api(`/admin/users/${u.id}`, { method: 'PATCH', body: { role } });
      toast(`${u.full_name}: ${role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}`);
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  };
  if (error) return <p className="text-red-600">{error.message}</p>;
  return (
    <Card>
      {loading && !data ? <div className="h-40 animate-pulse rounded-xl bg-black/5" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-black/45 uppercase"><tr><th className="py-2">Người dùng</th><th>SĐT</th><th>Đơn</th><th>Chi tiêu</th><th>Ngày tạo</th><th>Quyền</th></tr></thead>
            <tbody className="divide-y divide-black/5">
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3"><p className="font-medium">{u.full_name}</p><p className="text-xs text-black/45">{u.email}</p></td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.order_count}</td>
                  <td className="whitespace-nowrap">{formatPrice(u.total_spent)}</td>
                  <td className="text-black/55">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <select value={u.role} disabled={u.id === me.id} onChange={(e) => setRole(u, e.target.value)} className="rounded-full bg-black/5 px-3 py-1.5 text-xs outline-none disabled:opacity-50">
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

const MENU = [
  ['', 'Tổng quan', LayoutDashboard],
  ['products', 'Sản phẩm', Package],
  ['orders', 'Đơn hàng', ShoppingCart],
  ['users', 'Người dùng', Users],
];

export default function Admin() {
  const { user, authReady } = useStore();
  if (!authReady) return null;
  if (!user) return <Navigate to="/login?next=/admin" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Bạn không có quyền truy cập</h1>
        <Link to="/" className="btn-dark mt-6">Về trang chủ</Link>
      </div>
    );
  }
  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside>
        <p className="eyebrow mb-4">Quản trị</p>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {MENU.map(([to, label, Icon]) => (
            <NavLink key={to} to={`/admin/${to}`} end className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm whitespace-nowrap ${isActive ? 'bg-ink text-white' : 'hover:bg-black/5'}`}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Routes>
      </section>
    </div>
  );
}

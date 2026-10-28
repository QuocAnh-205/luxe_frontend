import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useFetch } from '../lib/useFetch';
import { formatPrice } from '../lib/api';

const STATUS = {
  pending: ['Chờ xác nhận', 'bg-amber-50 text-amber-700'],
  paid: ['Đã thanh toán', 'bg-sky-50 text-sky-700'],
  shipping: ['Đang giao', 'bg-indigo-50 text-indigo-700'],
  completed: ['Hoàn thành', 'bg-emerald-50 text-emerald-700'],
  cancelled: ['Đã huỷ', 'bg-red-50 text-red-700'],
};

export default function Orders() {
  const { user, authReady } = useStore();
  const [params] = useSearchParams();
  const { data, loading } = useFetch(user ? '/orders' : null);
  const newId = Number(params.get('new'));

  if (!authReady) return null;
  if (!user) return <Navigate to="/login?next=/orders" replace />;

  return (
    <div className="container-x py-10">
      {newId > 0 && (
        <div className="mb-8 flex items-center gap-4 rounded-3xl bg-emerald-50 p-6 text-emerald-800" data-testid="order-success">
          <CheckCircle2 size={32} />
          <div>
            <p className="font-semibold">Đặt hàng thành công — mã đơn #{newId}</p>
            <p className="text-sm">LUXE sẽ gọi xác nhận trong ít phút. Cảm ơn bạn đã mua sắm!</p>
          </div>
        </div>
      )}
      <h1 className="font-display text-4xl font-semibold">Đơn hàng của tôi</h1>

      {loading && <div className="mt-8 h-40 animate-pulse rounded-3xl bg-black/5" />}
      {!loading && !data?.orders.length && (
        <div className="mt-8 flex flex-col items-center rounded-3xl bg-white py-16 text-center ring-1 ring-black/5">
          <Package size={40} className="text-black/25" />
          <p className="mt-4 text-black/60">Bạn chưa có đơn hàng nào.</p>
          <Link to="/shop" className="btn-dark mt-6">Mua sắm ngay</Link>
        </div>
      )}
      <div className="mt-8 space-y-5">
        {data?.orders.map((o) => {
          const [label, cls] = STATUS[o.status] || STATUS.pending;
          return (
            <article key={o.id} className={`rounded-3xl bg-white p-6 ring-1 ${o.id === newId ? 'ring-emerald-400' : 'ring-black/5'}`} data-testid="order-card">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
                <div>
                  <p className="font-semibold">Đơn #{o.id}</p>
                  <p className="text-xs text-black/50">{new Date(o.created_at).toLocaleString('vi-VN')} · {o.payment_method === 'bank' ? 'Chuyển khoản' : 'COD'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>
              </header>
              <ul className="divide-y divide-black/5">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-4 py-3">
                    <Link to={`/product/${i.slug}`} className="product-bg h-16 w-14 shrink-0 rounded-lg">
                      <img src={i.image_url} alt={i.name} className="h-full w-full object-contain p-1" />
                    </Link>
                    <div className="min-w-0 flex-1 text-sm">
                      <Link to={`/product/${i.slug}`} className="hover:text-gold">{i.name}</Link>
                      <p className="text-xs text-black/50">{i.size ? `Size ${i.size} · ` : ''}x{i.quantity}</p>
                    </div>
                    <span className="text-sm">{formatPrice(i.unit_price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <footer className="flex flex-wrap justify-between gap-2 border-t border-black/5 pt-4 text-sm">
                <span className="text-black/55">Giao đến: {o.shipping_address}</span>
                <span>
                  Tổng: <b>{formatPrice(o.total_amount)}</b>
                  {Number(o.shipping_fee) > 0 && <span className="text-black/45"> (gồm ship {formatPrice(o.shipping_fee)})</span>}
                </span>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}

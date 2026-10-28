import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Loader2, Lock } from 'lucide-react';
import { OrderSummary } from './Cart';
import { useStore } from '../context/StoreContext';
import { api, formatPrice } from '../lib/api';

export default function Checkout() {
  const { cart, user, authReady, clearCart, toast } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', shipping_address: '', note: '', payment_method: 'cod' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, full_name: f.full_name || user.full_name, phone: f.phone || user.phone || '', shipping_address: f.shipping_address || user.address || '' }));
  }, [user]);

  if (!authReady) return null;
  if (!user) return <Navigate to="/login?next=/checkout" replace />;
  if (!cart.length) return <Navigate to="/cart" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { order } = await api('/orders', {
        method: 'POST',
        body: { ...form, items: cart.map((i) => ({ product_id: i.product_id, size: i.size, quantity: i.quantity })) },
      });
      clearCart();
      toast(`Đặt hàng thành công! Mã đơn #${order.id}`);
      navigate(`/orders?new=${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-x py-10">
      <nav className="mb-4 text-sm text-black/50"><Link to="/cart" className="hover:text-ink">Giỏ hàng</Link> / <span className="text-ink">Thanh toán</span></nav>
      <h1 className="font-display text-4xl font-semibold">Thanh toán</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-3xl bg-white p-6 ring-1 ring-black/5 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold">Thông tin giao hàng</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">Họ và tên<input name="full_name" required value={form.full_name} onChange={onChange} className="input mt-1.5" /></label>
              <label className="text-sm">Số điện thoại<input name="phone" required pattern="[0-9+ ]{9,15}" value={form.phone} onChange={onChange} className="input mt-1.5" placeholder="09xx xxx xxx" /></label>
              <label className="text-sm sm:col-span-2">Địa chỉ nhận hàng<input name="shipping_address" required value={form.shipping_address} onChange={onChange} className="input mt-1.5" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" /></label>
              <label className="text-sm sm:col-span-2">Ghi chú (tuỳ chọn)<textarea name="note" rows={3} value={form.note} onChange={onChange} className="input mt-1.5" placeholder="Giao giờ hành chính, gói quà..." /></label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-black/5 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold">Phương thức thanh toán</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['cod', Banknote, 'Thanh toán khi nhận hàng', 'Trả tiền mặt cho shipper'],
                ['bank', CreditCard, 'Chuyển khoản ngân hàng', 'Thông tin TK gửi qua email'],
              ].map(([v, Icon, title, sub]) => (
                <label key={v} className={`flex cursor-pointer gap-3 rounded-2xl p-4 ring-1 transition ${form.payment_method === v ? 'bg-cream ring-ink' : 'ring-black/10 hover:ring-black/30'}`}>
                  <input type="radio" name="payment_method" value={v} checked={form.payment_method === v} onChange={onChange} className="mt-1 accent-ink" />
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium"><Icon size={16} /> {title}</p>
                    <p className="mt-0.5 text-xs text-black/50">{sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
            <ul className="max-h-64 space-y-3 overflow-y-auto">
              {cart.map((i) => (
                <li key={i.key} className="flex items-center gap-3 text-sm">
                  <div className="product-bg relative h-14 w-12 shrink-0 rounded-lg">
                    <img src={i.image} alt="" className="h-full w-full object-contain p-1" />
                    <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-white">{i.quantity}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{i.name}</p>
                    {i.size && <p className="text-xs text-black/45">Size {i.size}</p>}
                  </div>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
          <OrderSummary>
            {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={submitting} className="btn-dark mt-5 w-full" data-testid="place-order">
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />} Đặt hàng
            </button>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { CartLine, FreeShippingBar } from '../components/CartDrawer';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/api';

export function OrderSummary({ children }) {
  const { totals } = useStore();
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
      <h2 className="font-display text-xl font-semibold">Tóm tắt đơn hàng</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-black/60">Tạm tính ({totals.count} sản phẩm)</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-black/60">Phí giao hàng</dt>
          <dd>{totals.shipping ? formatPrice(totals.shipping) : <span className="text-emerald-600">Miễn phí</span>}</dd>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-3 text-base font-semibold">
          <dt>Tổng cộng</dt>
          <dd data-testid="order-total">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      <div className="mt-5"><FreeShippingBar subtotal={totals.subtotal} /></div>
      {children}
    </div>
  );
}

export default function Cart() {
  const { cart, clearCart } = useStore();

  if (!cart.length) {
    return (
      <div className="container-x flex flex-col items-center py-28 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-black/5"><ShoppingBag size={40} className="text-black/30" /></div>
        <h1 className="mt-6 font-display text-3xl font-semibold">Giỏ hàng trống</h1>
        <p className="mt-2 text-black/55">Hãy chọn cho mình vài món đồ thật ưng ý nhé.</p>
        <Link to="/shop" className="btn-dark mt-8">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-4xl font-semibold">Giỏ hàng</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl bg-white px-6 ring-1 ring-black/5">
          <ul className="divide-y divide-black/5">
            {cart.map((item) => <CartLine key={item.key} item={item} />)}
          </ul>
          <div className="flex justify-between border-t border-black/5 py-4 text-sm">
            <Link to="/shop" className="hover:text-gold">← Tiếp tục mua sắm</Link>
            <button onClick={clearCart} className="text-black/45 hover:text-red-600">Xoá giỏ hàng</button>
          </div>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary>
            <Link to="/checkout" className="btn-dark mt-5 w-full">Tiến hành thanh toán <ArrowRight size={16} /></Link>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}

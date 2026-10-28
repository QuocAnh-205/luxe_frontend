import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { FREE_SHIPPING_FROM, useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/api';

export function CartLine({ item }) {
  const { updateQty, removeFromCart, setCartOpen } = useStore();
  return (
    <li className="flex gap-4 py-4" data-testid="cart-line">
      <Link to={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="product-bg h-24 w-20 shrink-0 overflow-hidden rounded-xl">
        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link to={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="line-clamp-2 text-sm font-medium hover:text-gold">
            {item.name}
          </Link>
          <button onClick={() => removeFromCart(item.key)} className="text-black/30 hover:text-red-600" aria-label="Xoá">
            <Trash2 size={16} />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-black/50">
          {item.color}
          {item.size && ` · Size ${item.size}`}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center rounded-full ring-1 ring-black/10">
            <button className="p-1.5" onClick={() => updateQty(item.key, item.quantity - 1)} aria-label="Giảm">
              <Minus size={14} />
            </button>
            <span className="w-7 text-center text-sm">{item.quantity}</span>
            <button className="p-1.5" onClick={() => updateQty(item.key, item.quantity + 1)} aria-label="Tăng">
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </li>
  );
}

export function FreeShippingBar({ subtotal }) {
  const left = FREE_SHIPPING_FROM - subtotal;
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);
  return (
    <div className="rounded-xl bg-white p-3 text-xs ring-1 ring-black/5">
      <p className="mb-2 flex items-center gap-1.5">
        <Truck size={14} className="text-gold" />
        {left > 0 ? (
          <>Mua thêm <b>{formatPrice(left)}</b> để được miễn phí giao hàng</>
        ) : (
          <b>Bạn được miễn phí giao hàng!</b>
        )}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, totals, cartOpen, setCartOpen } = useStore();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
  }, [cartOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <h2 className="font-display text-xl font-semibold">Giỏ hàng ({totals.count})</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Đóng giỏ hàng">
            <X />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-black/5">
              <ShoppingBag size={32} className="text-black/30" />
            </div>
            <p className="text-black/60">Giỏ hàng của bạn đang trống</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-dark">
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              <FreeShippingBar subtotal={totals.subtotal} />
            </div>
            <ul className="flex-1 divide-y divide-black/5 overflow-y-auto px-6">
              {cart.map((item) => (
                <CartLine key={item.key} item={item} />
              ))}
            </ul>
            <div className="space-y-3 border-t border-black/5 bg-white/60 px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-black/60">Tạm tính</span>
                <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
              </div>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-dark w-full">
                Thanh toán
              </Link>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-light w-full">
                Xem giỏ hàng
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

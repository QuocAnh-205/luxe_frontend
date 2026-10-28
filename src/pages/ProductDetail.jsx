import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import ProductCard, { Stars } from '../components/ProductCard';
import { useFetch } from '../lib/useFetch';
import { discountPercent, formatPrice } from '../lib/api';
import { useStore } from '../context/StoreContext';
import NotFound from './NotFound';

const GENDER = { nam: 'Nam', nu: 'Nữ', unisex: 'Unisex' };

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/products/${slug}`);
  const { addToCart, toast } = useStore();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    setActive(0);
    setSize(null);
    setQty(1);
    setTab('desc');
    setSizeError(false);
  }, [slug]);

  if (error?.status === 404) return <NotFound />;
  if (loading || !data) {
    return (
      <div className="container-x grid animate-pulse gap-10 py-10 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-black/5" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 rounded bg-black/5" />
          <div className="h-10 w-3/4 rounded bg-black/5" />
          <div className="h-6 w-1/3 rounded bg-black/5" />
          <div className="h-32 rounded bg-black/5" />
        </div>
      </div>
    );
  }

  const { product: p, reviews, related } = data;
  const off = discountPercent(p);
  const needSize = p.sizes.length > 0;

  const add = () => {
    if (needSize && !size) {
      setSizeError(true);
      return;
    }
    addToCart(p, { size, quantity: qty });
    toast(`Đã thêm “${p.name}” vào giỏ`);
  };

  const ratingBars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="container-x py-8">
      <nav className="mb-6 text-sm text-black/50">
        <Link to="/" className="hover:text-ink">Trang chủ</Link> /{' '}
        <Link to={`/shop?category=${p.category_slug}`} className="hover:text-ink">{p.category_name}</Link> /{' '}
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row lg:sticky lg:top-28 lg:self-start">
          <div className="flex gap-3 sm:flex-col">
            {p.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={`product-bg h-20 w-20 overflow-hidden rounded-xl ring-2 transition sm:h-24 sm:w-24 ${active === i ? 'ring-ink' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                aria-label={`Ảnh ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-2" />
              </button>
            ))}
          </div>
          <div className="product-bg relative aspect-square flex-1 overflow-hidden rounded-3xl">
            <img key={p.images[active]} src={p.images[active]} alt={p.name} className="animate-fade-up h-full w-full object-contain p-8" data-testid="main-image" />
            <div className="absolute top-4 left-4 flex gap-2">
              {p.is_new && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">MỚI</span>}
              {off > 0 && <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">-{off}%</span>}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{p.category_name} · {GENDER[p.gender]}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold" data-testid="product-name">{p.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-black/55">
            <Stars value={p.rating} />
            <span>{p.rating} ({p.review_count} đánh giá)</span>
            <span className="text-black/20">|</span>
            <span>Đã bán {p.sold}</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(p.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-black/40 line-through">{formatPrice(p.original_price)}</span>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">Tiết kiệm {formatPrice(p.original_price - p.price)}</span>
              </>
            )}
          </div>
          <p className="mt-6 leading-relaxed text-black/70">{p.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
              <dt className="text-xs text-black/45">Màu sắc</dt>
              <dd className="mt-0.5 font-medium">{p.color}</dd>
            </div>
            <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
              <dt className="text-xs text-black/45">Chất liệu</dt>
              <dd className="mt-0.5 font-medium">{p.material}</dd>
            </div>
          </dl>

          {needSize && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Chọn size {size && <span className="text-black/50">: {size}</span>}</p>
                <span className="text-xs text-black/45 underline">Hướng dẫn chọn size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    className={`h-11 min-w-12 rounded-xl px-3 text-sm font-medium ring-1 transition ${size === s ? 'bg-ink text-white ring-ink' : 'bg-white ring-black/10 hover:ring-black/50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p className="mt-2 text-sm text-red-600">Vui lòng chọn size trước khi thêm vào giỏ</p>}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full bg-white ring-1 ring-black/10">
              <button className="p-3.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Giảm số lượng"><Minus size={16} /></button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button className="p-3.5" onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Tăng số lượng"><Plus size={16} /></button>
            </div>
            <button onClick={add} disabled={p.stock === 0} className="btn-dark flex-1" data-testid="add-to-cart">
              <ShoppingBag size={18} /> {p.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </button>
          </div>
          <p className="mt-3 text-xs text-black/50">
            {p.stock > 0 ? (p.stock <= 10 ? `Chỉ còn ${p.stock} sản phẩm` : 'Còn hàng') : 'Tạm hết hàng'}
          </p>

          <ul className="mt-8 grid gap-3 border-t border-black/10 pt-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck size={18} className="text-gold" /> Giao 2–4 ngày</li>
            <li className="flex items-center gap-2"><RotateCcw size={18} className="text-gold" /> Đổi trả 30 ngày</li>
            <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-gold" /> Chính hãng</li>
          </ul>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex gap-6 border-b border-black/10">
              {[
                ['desc', 'Đặc điểm nổi bật'],
                ['reviews', `Đánh giá (${reviews.length})`],
              ].map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${tab === k ? 'border-ink' : 'border-transparent text-black/45 hover:text-ink'}`}>
                  {l}
                </button>
              ))}
            </div>
            {tab === 'desc' ? (
              <ul className="mt-6 space-y-3">
                {(p.highlights || []).map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-black/75">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-light/50"><Check size={12} /></span>
                    {h}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-6 rounded-2xl bg-white p-5 ring-1 ring-black/5">
                  <div className="text-center">
                    <p className="font-display text-4xl font-semibold">{p.rating}</p>
                    <Stars value={p.rating} size={12} />
                  </div>
                  <div className="flex-1 space-y-1">
                    {ratingBars.map(({ star, count }) => (
                      <div key={star} className="flex items-center gap-2 text-xs text-black/50">
                        <span className="w-3">{star}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5">
                          <div className="h-full bg-gold" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                        </div>
                        <span className="w-4 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-black/5 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-sand text-sm font-semibold">{r.author_name.split(' ').pop()[0]}</span>
                        <div>
                          <p className="text-sm font-medium">{r.author_name}</p>
                          <Stars value={r.rating} size={11} />
                        </div>
                      </div>
                      <span className="text-xs text-black/40">{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <p className="mt-3 text-sm text-black/70">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-3xl font-semibold">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

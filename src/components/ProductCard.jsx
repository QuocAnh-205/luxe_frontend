import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { discountPercent, formatPrice } from '../lib/api';
import { useStore } from '../context/StoreContext';

export function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-gold text-gold' : 'fill-black/10 text-black/10'} />
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, toast } = useStore();
  const off = discountPercent(product);
  const hover = product.images?.[1];

  // Sản phẩm có size thì phải vào trang chi tiết chọn size, không thì thêm nhanh
  const quickAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast(`Đã thêm “${product.name}” vào giỏ`);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block" data-testid="product-card">
      <div className="product-bg relative aspect-[4/5] overflow-hidden rounded-2xl">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-contain p-6 transition duration-700 group-hover:scale-105 ${
            hover ? 'group-hover:opacity-0' : ''
          }`}
        />
        {hover && (
          <img
            src={hover}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-6 opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">Mới</span>}
          {off > 0 && <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-semibold text-white">-{off}%</span>}
        </div>
        {product.sizes.length === 0 && product.stock > 0 && (
          <button
            onClick={quickAdd}
            aria-label="Thêm nhanh vào giỏ"
            className="absolute right-3 bottom-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ink hover:text-white"
          >
            <Plus size={18} />
          </button>
        )}
        {product.sizes.length > 0 && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 rounded-xl bg-white/90 px-3 py-2 text-center text-[11px] text-black/60 opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
            Size: {product.sizes.join(' · ')}
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1 px-1">
        <p className="text-[11px] tracking-widest text-black/45 uppercase">{product.category_name}</p>
        <h3 className="line-clamp-1 text-[15px] font-medium transition group-hover:text-gold">{product.name}</h3>
        <div className="flex items-center gap-2 text-xs text-black/50">
          <Stars value={product.rating} size={12} />
          <span>({product.review_count})</span>
          <span className="hidden text-black/20 sm:inline">|</span>
          <span className="hidden sm:inline">Đã bán {product.sold}</span>
        </div>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-semibold" data-testid="price">{formatPrice(product.price)}</span>
          {off > 0 && <span className="text-sm text-black/40 line-through">{formatPrice(product.original_price)}</span>}
        </div>
      </div>
    </Link>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="animate-pulse">
      <div className="aspect-[4/5] rounded-2xl bg-black/5" />
      <div className="mt-4 h-3 w-1/3 rounded bg-black/5" />
      <div className="mt-2 h-4 w-3/4 rounded bg-black/5" />
      <div className="mt-2 h-4 w-1/4 rounded bg-black/5" />
    </div>
  ));
}

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard';
import { useFetch } from '../lib/useFetch';

const SORTS = [
  ['', 'Đề xuất'],
  ['newest', 'Mới nhất'],
  ['popular', 'Bán chạy'],
  ['rating', 'Đánh giá cao'],
  ['price_asc', 'Giá tăng dần'],
  ['price_desc', 'Giá giảm dần'],
];
const PRICES = [
  ['', '', 'Tất cả mức giá'],
  ['', '500000', 'Dưới 500.000₫'],
  ['500000', '1000000', '500.000₫ – 1.000.000₫'],
  ['1000000', '3000000', '1.000.000₫ – 3.000.000₫'],
  ['3000000', '', 'Trên 3.000.000₫'],
];
const GENDERS = [
  ['', 'Tất cả'],
  ['nu', 'Nữ'],
  ['nam', 'Nam'],
];

function Filters({ params, set, categories }) {
  const current = params.get('category') || '';
  const priceKey = `${params.get('min') || ''}-${params.get('max') || ''}`;
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-black/50 uppercase">Danh mục</p>
        <ul className="space-y-1">
          <li>
            <button onClick={() => set({ category: '' })} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${!current ? 'bg-ink text-white' : 'hover:bg-black/5'}`}>
              Tất cả sản phẩm
            </button>
          </li>
          {categories?.map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => set({ category: c.slug })}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${current === c.slug ? 'bg-ink text-white' : 'hover:bg-black/5'}`}
              >
                {c.name}
                <span className={`text-xs ${current === c.slug ? 'text-white/60' : 'text-black/35'}`}>{c.product_count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-black/50 uppercase">Dành cho</p>
        <div className="flex gap-2">
          {GENDERS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => set({ gender: v })}
              className={`rounded-full px-4 py-1.5 text-sm ring-1 ${(params.get('gender') || '') === v ? 'bg-ink text-white ring-ink' : 'ring-black/10 hover:ring-black/40'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-black/50 uppercase">Khoảng giá</p>
        <div className="space-y-2">
          {PRICES.map(([min, max, label]) => (
            <label key={label} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="price"
                checked={priceKey === `${min}-${max}`}
                onChange={() => set({ min, max })}
                className="h-4 w-4 accent-ink"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={!!params.get('sale')} onChange={(e) => set({ sale: e.target.checked ? '1' : '' })} className="h-4 w-4 accent-ink" />
          Đang giảm giá
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={!!params.get('new')} onChange={(e) => set({ new: e.target.checked ? '1' : '' })} className="h-4 w-4 accent-ink" />
          Hàng mới về
        </label>
      </div>
    </div>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: catData } = useFetch('/categories');
  const query = new URLSearchParams(params);
  query.set('limit', '12');
  const { data, loading, error } = useFetch(`/products?${query}`);

  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setParams(next);
    setFiltersOpen(false);
  };

  const category = catData?.categories.find((c) => c.slug === params.get('category'));
  const q = params.get('q');
  const title = q ? `Kết quả cho “${q}”` : category?.name || (params.get('sale') ? 'Đang giảm giá' : params.get('new') ? 'Hàng mới về' : 'Tất cả sản phẩm');
  const page = Number(params.get('page') || 1);
  const activeChips = [
    q && ['q', `Từ khoá: ${q}`],
    category && ['category', category.name],
    params.get('gender') && ['gender', params.get('gender') === 'nu' ? 'Nữ' : 'Nam'],
    (params.get('min') || params.get('max')) && ['price', 'Khoảng giá'],
    params.get('sale') && ['sale', 'Giảm giá'],
    params.get('new') && ['new', 'Hàng mới'],
  ].filter(Boolean);

  return (
    <div className="container-x py-10">
      <nav className="mb-4 text-sm text-black/50">
        <Link to="/" className="hover:text-ink">Trang chủ</Link> / <span className="text-ink">Cửa hàng</span>
      </nav>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-black/55">{category?.description || `${data?.total ?? '…'} sản phẩm`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(true)} className="btn-light !px-4 lg:hidden">
            <SlidersHorizontal size={16} /> Bộ lọc
          </button>
          <select
            value={params.get('sort') || ''}
            onChange={(e) => set({ sort: e.target.value })}
            className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-black/10 outline-none"
            aria-label="Sắp xếp"
          >
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeChips.map(([key, label]) => (
            <button
              key={key}
              onClick={() => set(key === 'price' ? { min: '', max: '' } : { [key]: '' })}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs ring-1 ring-black/10 hover:ring-black/40"
            >
              {label} <X size={12} />
            </button>
          ))}
          <button onClick={() => setParams({})} className="text-xs text-black/50 underline hover:text-ink">Xoá tất cả</button>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Filters params={params} set={set} categories={catData?.categories} />
          </div>
        </aside>

        <div>
          {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Không tải được sản phẩm: {error.message}</p>}
          {!loading && data?.items.length === 0 && (
            <div className="rounded-3xl bg-white/60 py-20 text-center">
              <p className="font-display text-2xl">Không tìm thấy sản phẩm phù hợp</p>
              <button onClick={() => setParams({})} className="btn-dark mt-6">Xem tất cả sản phẩm</button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {loading ? <ProductGridSkeleton count={9} /> : data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {data && data.pages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button disabled={page <= 1} onClick={() => set({ page: String(page - 1) })} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-black/10 disabled:opacity-30" aria-label="Trang trước">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => set({ page: String(n) })}
                  className={`h-10 w-10 rounded-full text-sm ${n === page ? 'bg-ink text-white' : 'ring-1 ring-black/10 hover:ring-black/40'}`}
                >
                  {n}
                </button>
              ))}
              <button disabled={page >= data.pages} onClick={() => set({ page: String(page + 1) })} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-black/10 disabled:opacity-30" aria-label="Trang sau">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bộ lọc trên mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${filtersOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${filtersOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setFiltersOpen(false)} />
        <div className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream p-6 transition-transform duration-300 ${filtersOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-xl font-semibold">Bộ lọc</p>
            <button onClick={() => setFiltersOpen(false)} aria-label="Đóng"><X /></button>
          </div>
          <Filters params={params} set={set} categories={catData?.categories} />
        </div>
      </div>
    </div>
  );
}

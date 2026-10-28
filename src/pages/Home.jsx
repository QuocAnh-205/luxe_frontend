import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Gem, RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import ProductCard, { ProductGridSkeleton } from '../components/ProductCard';
import { useFetch } from '../lib/useFetch';
import { useStore } from '../context/StoreContext';

const IMG = '/images/products';

const TABS = [
  { key: 'featured', label: 'Nổi bật', query: 'featured=1&limit=8' },
  { key: 'new', label: 'Hàng mới', query: 'new=1&sort=newest&limit=8' },
  { key: 'popular', label: 'Bán chạy', query: 'sort=popular&limit=8' },
];

const PERKS = [
  { icon: Truck, title: 'Giao hàng miễn phí', text: 'Cho đơn từ 1.000.000₫ toàn quốc' },
  { icon: RotateCcw, title: 'Đổi trả 30 ngày', text: 'Đổi size, đổi mẫu dễ dàng' },
  { icon: ShieldCheck, title: 'Chính hãng 100%', text: 'Bảo hành đồng hồ 24 tháng' },
  { icon: Gem, title: 'Gói quà miễn phí', text: 'Hộp quà sang trọng & thiệp viết tay' },
];

function Hero() {
  return (
    <section className="container-x pt-6 pb-16 lg:pt-10">
      <div className="grid items-stretch gap-4 lg:grid-cols-12">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:col-span-7">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative">
            <p className="eyebrow animate-fade-up !text-gold-light">Bộ sưu tập Thu – Đông 2026</p>
            <h1 className="animate-fade-up mt-5 font-display text-5xl leading-[1.05] font-semibold [animation-delay:100ms] sm:text-6xl xl:text-7xl">
              Thanh lịch
              <br />
              <span className="text-gold-light italic">trong từng</span> chi tiết
            </h1>
            <p className="animate-fade-up mt-6 max-w-md text-white/70 [animation-delay:200ms]">
              Đầm dạ hội, túi da thủ công, giày cao gót và đồng hồ cơ — tuyển chọn để bạn tỏa sáng ở mọi khoảnh khắc.
            </p>
            <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:300ms]">
              <Link to="/shop" className="btn-gold">
                Mua sắm ngay <ArrowRight size={16} />
              </Link>
              <Link to="/shop?new=1" className="btn border border-white/25 text-white hover:bg-white hover:text-ink">
                Hàng mới về
              </Link>
            </div>
          </div>
          <dl className="relative mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              ['45+', 'Mẫu tuyển chọn'],
              ['4.6★', 'Đánh giá trung bình'],
              ['24h', 'Giao nhanh nội thành'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl text-gold-light">{n}</dt>
                <dd className="mt-1 text-xs text-white/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          <Link
            to="/product/dam-da-hoi-tre-vai-hoa"
            className="group product-bg relative col-span-2 overflow-hidden rounded-[2rem] sm:col-span-1 sm:row-span-2"
          >
            <img
              src={`${IMG}/dam-da-hoi-tre-vai-hoa-1.webp`}
              alt="Đầm dạ hội trễ vai họa tiết hoa"
              className="h-full max-h-[520px] w-full object-contain p-6 transition duration-700 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-medium backdrop-blur">
              Đầm dạ hội · 1.890.000₫
            </span>
          </Link>
          <Link to="/product/tui-xach-saffiano-xanh-ngoc" className="group relative overflow-hidden rounded-[2rem] bg-[#dff1f1]">
            <img
              src={`${IMG}/tui-xach-saffiano-xanh-ngoc-1.webp`}
              alt="Túi xách tay da saffiano xanh ngọc"
              className="aspect-square w-full object-contain p-5 transition duration-700 group-hover:scale-105"
            />
            <ArrowUpRight className="absolute top-4 right-4 opacity-0 transition group-hover:opacity-100" size={20} />
          </Link>
          <Link to="/product/dong-ho-demi-vanh-khia-mat-xam" className="group relative overflow-hidden rounded-[2rem] bg-sand">
            <img
              src={`${IMG}/dong-ho-demi-vanh-khia-mat-xam-1.webp`}
              alt="Đồng hồ demi vành khía mặt xám"
              className="aspect-square w-full object-contain p-5 transition duration-700 group-hover:scale-105"
            />
            <ArrowUpRight className="absolute top-4 right-4 opacity-0 transition group-hover:opacity-100" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['Đầm dạ hội', 'Túi da thủ công', 'Đồng hồ cơ', 'Giày cao gót', 'Kính râm', 'Trang sức', 'Sơ mi', 'Sneaker'];
  return (
    <div className="overflow-hidden border-y border-black/10 bg-white/50 py-5">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl italic text-black/70">
            {w} <Sparkles size={16} className="text-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  const { data, loading } = useFetch('/categories');
  return (
    <section className="container-x py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Danh mục</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">Mua sắm theo phong cách</h2>
        </div>
        <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium hover:text-gold sm:flex">
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <div key={i} className="aspect-square animate-pulse rounded-3xl bg-black/5" />)
          : data?.categories.map((c) => (
              <Link
                key={c.id}
                to={`/shop?category=${c.slug}`}
                className="group product-bg relative aspect-square overflow-hidden rounded-3xl"
                data-testid="category-tile"
              >
                <img
                  src={c.image_url}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain p-8 pb-16 transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 backdrop-blur">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-black/50">{c.product_count} sản phẩm</p>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition group-hover:bg-gold">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

function ProductTabs() {
  const [tab, setTab] = useState(TABS[0]);
  const { data, loading } = useFetch(`/products?${tab.query}`);
  return (
    <section className="container-x py-10">
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Tuyển chọn</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">Được yêu thích nhất</h2>
        </div>
        <div className="flex gap-1 rounded-full bg-black/5 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${tab.key === t.key ? 'bg-ink text-white shadow' : 'text-black/60 hover:text-ink'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {loading ? <ProductGridSkeleton /> : data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="container-x py-20">
      <div className="grid gap-4 lg:grid-cols-2">
        <Link to="/shop?category=dong-ho" className="group relative overflow-hidden rounded-[2rem] bg-[#1c1a17] p-10 text-white">
          <div className="relative z-10 max-w-[50%]">
            <p className="eyebrow !text-gold-light">Đồng hồ</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Giờ khắc của sự tinh tế</h3>
            <p className="mt-3 text-sm text-white/60">Chronograph, moonphase và đồng hồ lặn — máy cơ automatic, kính sapphire.</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold-light">
              Khám phá <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </div>
          <img
            src={`${IMG}/dong-ho-moonphase-mat-trang-vang-hong-1.webp`}
            alt="Đồng hồ moonphase mặt trắng vỏ vàng hồng"
            className="absolute top-1/2 -right-10 h-[105%] -translate-y-1/2 object-contain transition duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/shop?category=giay-cao-got" className="group relative overflow-hidden rounded-[2rem] bg-[#f3e1dc] p-8">
            <p className="eyebrow">Giày cao gót</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Bước đi kiêu hãnh</h3>
            <img
              src={`${IMG}/giay-cao-got-satin-do-2.webp`}
              alt="Giày cao gót satin đỏ cherry"
              loading="lazy"
              className="mt-4 aspect-square w-full object-contain transition duration-700 group-hover:scale-105"
            />
          </Link>
          <Link to="/shop?category=kinh-mat" className="group relative overflow-hidden rounded-[2rem] bg-[#e4ebe3] p-8">
            <p className="eyebrow">Kính mắt</p>
            <h3 className="mt-2 font-display text-2xl font-semibold">Nắng hè rực rỡ</h3>
            <img
              src={`${IMG}/kinh-phi-cong-trong-gradient-xanh-2.webp`}
              alt="Kính phi công tròng gradient xanh"
              loading="lazy"
              className="mt-4 aspect-square w-full object-contain transition duration-700 group-hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Sale() {
  const { data, loading } = useFetch('/products?sale=1&limit=4&sort=price_desc');
  if (!loading && !data?.items.length) return null;
  return (
    <section className="container-x py-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow !text-red-600">Ưu đãi có hạn</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">Đang giảm giá</h2>
        </div>
        <Link to="/shop?sale=1" className="flex items-center gap-1 text-sm font-medium hover:text-gold">
          Tất cả ưu đãi <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {loading ? <ProductGridSkeleton count={4} /> : data.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function Perks() {
  return (
    <section className="container-x py-16">
      <div className="grid gap-px overflow-hidden rounded-3xl bg-black/5 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4 bg-cream p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/5">
              <Icon size={20} className="text-gold" />
            </span>
            <div>
              <p className="font-medium">{title}</p>
              <p className="mt-0.5 text-sm text-black/55">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const { toast } = useStore();
  const [email, setEmail] = useState('');
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-[2rem] bg-sand px-8 py-14 text-center sm:px-16">
        <p className="eyebrow">Bản tin LUXE</p>
        <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">Nhận ưu đãi 10% cho đơn đầu tiên</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-black/60">Cập nhật bộ sưu tập mới và ưu đãi riêng cho thành viên.</p>
        <form
          className="mx-auto mt-8 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast('Cảm ơn bạn đã đăng ký! Mã LUXE10 đã được gửi tới email.');
            setEmail('');
          }}
        >
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email của bạn" className="input !rounded-full" />
          <button className="btn-dark shrink-0">Đăng ký</button>
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <ProductTabs />
      <Editorial />
      <Sale />
      <Perks />
      <Newsletter />
    </>
  );
}

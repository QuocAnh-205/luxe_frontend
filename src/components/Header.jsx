import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Package, Search, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const NAV = [
  { to: '/shop', label: 'Cửa hàng' },
  { to: '/shop?new=1', label: 'Hàng mới' },
  { to: '/shop?category=dam-vay', label: 'Đầm & Váy' },
  { to: '/shop?category=tui-xach', label: 'Túi xách' },
  { to: '/shop?category=dong-ho', label: 'Đồng hồ' },
  { to: '/shop?sale=1', label: 'Sale', accent: true },
];

export default function Header() {
  const { totals, setCartOpen, user, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
    setQ('');
  };

  const isActive = (to) => `${location.pathname}${location.search}` === to;
  const firstName = user?.full_name.trim().split(' ').pop();

  return (
    <>
      <div className="bg-ink py-2 text-center text-xs tracking-wide text-white/80">
        Miễn phí giao hàng cho đơn từ <span className="font-semibold text-gold-light">1.000.000₫</span> · Đổi trả 30 ngày
      </div>
      <header
        // Nền trắng + viền dưới để tách khỏi nền kem của thân trang; cuộn xuống thì đổ bóng
        className={`sticky top-0 z-40 border-b border-black/[0.08] transition-shadow duration-300 ${
          scrolled ? 'bg-white/95 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl' : 'bg-white'
        }`}
      >
        {/* Hàng 1: tìm kiếm (trái) · logo (giữa) · tài khoản | giỏ hàng (phải) */}
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-20">
          <div className="flex items-center">
            <button className="-ml-2 p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu">
              <Menu size={22} />
            </button>
            <form onSubmit={submitSearch} className="relative hidden lg:block">
              <Search size={16} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-black/45" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-52 border-b border-black/15 bg-transparent py-2 pr-2 pl-7 text-sm outline-none transition-all placeholder:text-black/40 focus:w-72 focus:border-ink"
              />
            </form>
          </div>

          <Link to="/" className="font-display text-2xl font-bold tracking-[0.3em] lg:text-[2rem]">
            LUXE
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button className="rounded-full p-2 hover:bg-black/5 lg:hidden" onClick={() => setSearchOpen((v) => !v)} aria-label="Tìm kiếm">
              <Search size={20} />
            </button>

            {user ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-black/5" aria-label="Tài khoản">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-semibold text-gold-light">
                    {firstName[0]}
                  </span>
                  <span className="hidden max-w-28 truncate text-sm font-medium lg:block">{firstName}</span>
                  <ChevronDown size={14} className="hidden text-black/50 lg:block" />
                </button>
                <div className="invisible absolute right-0 mt-1 w-56 translate-y-1 rounded-2xl bg-white p-2 opacity-0 shadow-xl ring-1 ring-black/5 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="border-b border-black/5 px-3 py-2">
                    <p className="truncate text-sm font-semibold">{user.full_name}</p>
                    <p className="truncate text-xs text-black/50">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5">
                      <LayoutDashboard size={16} /> Trang quản trị
                    </Link>
                  )}
                  <Link to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5">
                    <Package size={16} /> Đơn hàng của tôi
                  </Link>
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-black/5">
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 ring-black/15 transition hover:bg-ink hover:text-white hover:ring-ink sm:flex"
                >
                  <User size={16} /> Đăng nhập
                </Link>
                <Link to="/login" className="rounded-full p-2 hover:bg-black/5 sm:hidden" aria-label="Đăng nhập">
                  <User size={20} />
                </Link>
              </>
            )}

            {/* Vạch ngăn: tách khu vực tài khoản khỏi giỏ hàng */}
            <span className="mx-1 hidden h-6 w-px bg-black/15 sm:block" />

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full p-2 hover:bg-black/5"
              aria-label="Giỏ hàng"
              data-testid="cart-button"
            >
              <span className="relative">
                <ShoppingBag size={20} />
                {totals.count > 0 && (
                  <span className="absolute -top-2 -right-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                    {totals.count}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-medium lg:block">Giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* Hàng 2 (desktop): menu danh mục căn giữa */}
        <nav className="hidden h-12 items-center justify-center gap-9 border-t border-black/[0.06] lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={`relative text-[13px] font-medium tracking-wider uppercase transition hover:text-gold ${n.accent ? 'text-red-600' : ''} ${
                isActive(n.to) ? 'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-current' : ''
              }`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {searchOpen && (
          <form onSubmit={submitSearch} className="container-x pb-3 lg:hidden">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm..." className="input" />
          </form>
        )}
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-cream p-6 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="font-display text-2xl font-bold tracking-[0.2em]">LUXE</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Đóng menu">
              <X />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={`rounded-xl px-3 py-3 text-lg font-medium hover:bg-black/5 ${n.accent ? 'text-red-600' : ''}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-black/10 pt-4 text-sm">
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="block py-2">Trang quản trị</Link>}
                <Link to="/orders" className="block py-2">Đơn hàng của tôi</Link>
                <button onClick={logout} className="py-2">Đăng xuất</button>
              </>
            ) : (
              <Link to="/login" className="btn-dark w-full">Đăng nhập</Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

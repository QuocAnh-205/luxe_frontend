import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';

const COLS = [
  {
    title: 'Mua sắm',
    links: [
      ['Đầm & Váy', '/shop?category=dam-vay'],
      ['Áo thun & Hoodie', '/shop?category=ao-thun-hoodie'],
      ['Túi xách', '/shop?category=tui-xach'],
      ['Giày nữ', '/shop?category=giay-cao-got'],
      ['Đồng hồ', '/shop?category=dong-ho'],
      ['Nước hoa', '/shop?category=nuoc-hoa'],
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      ['Đơn hàng của tôi', '/orders'],
      ['Giỏ hàng', '/cart'],
      ['Hàng mới về', '/shop?new=1'],
      ['Đang giảm giá', '/shop?sale=1'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl font-bold tracking-[0.2em] text-white">LUXE</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Thời trang & phụ kiện cao cấp được tuyển chọn kỹ lưỡng — từ những chiếc đầm dạ hội, túi da thủ công đến
            đồng hồ cơ tinh xảo.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-gold-light" /> 123 abc, Đà Nẵng</li>
            <li>
              <a href="tel:0123456789" className="flex items-center gap-2 transition hover:text-gold-light">
                <Phone size={16} className="text-gold-light" /> 0123456789
              </a>
            </li>
            <li>
              <a href="mailto:quocanh@luxe.vn" className="flex items-center gap-2 transition hover:text-gold-light">
                <Mail size={16} className="text-gold-light" /> quocanh@luxe.vn
              </a>
            </li>
          </ul>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{c.title}</p>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-gold-light">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs sm:flex-row">
          <p data-testid="copyright">© 2026 Bản quyền thuộc về LUXE Fashion.</p>
          <div className="flex gap-4">
            <Facebook size={18} className="hover:text-white" />
            <Instagram size={18} className="hover:text-white" />
            <Youtube size={18} className="hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Quote, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const IMG = '/images/products';

// Khung chung cho Đăng nhập / Đăng ký / Quên mật khẩu: panel thương hiệu bên trái, form bên phải
export function AuthShell({ title, subtitle, tabs, children }) {
  return (
    <div className="container-x py-8 lg:py-12">
      <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/5 lg:grid-cols-[1.05fr_1fr]">
        <BrandPanel />
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            {tabs && <AuthTabs active={tabs} />}
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-black/55">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthTabs({ active }) {
  return (
    <div className="mb-8 grid grid-cols-2 rounded-full bg-black/5 p-1 text-sm font-medium" role="tablist">
      {[
        ['login', '/login', 'Đăng nhập'],
        ['register', '/register', 'Đăng ký'],
      ].map(([key, to, label]) => (
        <Link
          key={key}
          to={to}
          role="tab"
          aria-selected={active === key}
          className={`rounded-full py-2.5 text-center transition ${active === key ? 'bg-ink text-white shadow' : 'text-black/55 hover:text-ink'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gold/30 blur-3xl" />
      <div className="absolute -right-24 -bottom-40 h-96 w-96 rounded-full bg-gold-light/10 blur-3xl" />

      <Link to="/" className="relative font-display text-3xl font-bold tracking-[0.25em] text-gold-light">
        LUXE
      </Link>
      <div className="relative mt-10">
        <p className="eyebrow !text-gold-light">Thành viên LUXE</p>
        <h2 className="mt-4 font-display text-4xl leading-tight font-semibold xl:text-5xl">
          Phong cách của bạn,
          <br />
          <span className="text-gold-light italic">trải nghiệm</span> của riêng bạn.
        </h2>
      </div>

      {/* Bộ sưu tập ảnh */}
      <div className="relative my-10 grid flex-1 grid-cols-3 items-center gap-4">
        {[
          ['dam-da-hoi-tre-vai-hoa-1', 'Đầm dạ hội', '-rotate-6 translate-y-4'],
          ['tui-xach-saffiano-xanh-ngoc-1', 'Túi xách', 'rotate-0 -translate-y-4'],
          ['dong-ho-moonphase-mat-trang-vang-hong-1', 'Đồng hồ', 'rotate-6 translate-y-6'],
        ].map(([img, label, tf]) => (
          <div key={img} className={`product-bg aspect-[3/4] rounded-3xl p-3 shadow-2xl ring-1 ring-white/10 ${tf}`}>
            <img src={`${IMG}/${img}.webp`} alt={label} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>

      <ul className="relative grid grid-cols-3 gap-3 text-xs text-white/70">
        {[
          [Truck, 'Freeship từ 1 triệu'],
          [RotateCcw, 'Đổi trả 30 ngày'],
          [ShieldCheck, 'Hàng chính hãng'],
        ].map(([Icon, text]) => (
          <li key={text} className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10">
            <Icon size={16} className="shrink-0 text-gold-light" /> {text}
          </li>
        ))}
      </ul>
      <figure className="relative mt-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <Quote size={18} className="text-gold-light" />
        <blockquote className="mt-2 text-sm leading-relaxed text-white/80">
          “Đặt hàng tối hôm trước, sáng hôm sau đã nhận được chiếc đầm. Đóng gói như một món quà.”
        </blockquote>
        <figcaption className="mt-3 text-xs text-white/50">Trần Thu Hà · Khách hàng thân thiết</figcaption>
      </figure>
    </div>
  );
}

// Ô nhập có icon bên trái
export function Field({ label, icon: Icon, error, hint, right, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium">
        {label}
        {right}
      </span>
      <span className="relative block">
        {Icon && <Icon size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-black/35" />}
        {children || <input {...props} className={`input h-12 ${Icon ? '!pl-11' : ''} ${error ? '!border-red-400 focus:!ring-red-100' : ''}`} />}
      </span>
      {error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : hint && <span className="mt-1.5 block text-xs text-black/45">{hint}</span>}
    </label>
  );
}

// Ô mật khẩu có nút ẩn/hiện
export function PasswordInput({ label = 'Mật khẩu', icon, error, hint, right, ...props }) {
  const [show, setShow] = useState(false);
  const Icon = icon;
  return (
    <Field label={label} error={error} hint={hint} right={right}>
      {Icon && <Icon size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-black/35" />}
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`input h-12 !pr-12 ${Icon ? '!pl-11' : ''} ${error ? '!border-red-400 focus:!ring-red-100' : ''}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-black/45 transition hover:bg-black/5 hover:text-ink"
        aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        aria-pressed={show}
        title={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </Field>
  );
}

export function passwordScore(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return pw.length < 6 ? Math.min(s, 1) : Math.max(s, 1);
}

const STRENGTH = [
  ['', ''],
  ['Yếu', 'bg-red-500'],
  ['Trung bình', 'bg-amber-500'],
  ['Khá', 'bg-lime-500'],
  ['Mạnh', 'bg-emerald-500'],
];

export function PasswordStrength({ password }) {
  if (!password) return null;
  const score = passwordScore(password);
  const [label, color] = STRENGTH[score];
  return (
    <div className="mt-2" data-testid="password-strength">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? color : 'bg-black/10'}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-black/50">
        Độ mạnh: <b className="text-ink">{label}</b> · Nên có ≥ 8 ký tự, chữ hoa, chữ số và ký tự đặc biệt
      </p>
    </div>
  );
}

// 6 ô nhập OTP, hỗ trợ dán cả mã, tự nhảy ô, Backspace lùi ô
export function OtpInput({ value, onChange, disabled, error }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const setAt = (i, d) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join('').slice(0, 6));
  };
  const handleChange = (i, e) => {
    const v = e.target.value.replace(/\D/g, '');
    if (!v) return setAt(i, '');
    if (v.length > 1) {
      onChange((digits.slice(0, i).join('') + v).slice(0, 6));
      refs.current[Math.min(i + v.length, 5)]?.focus();
      return;
    }
    setAt(i, v);
    if (i < 5) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const v = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!v) return;
    e.preventDefault();
    onChange(v);
    refs.current[Math.min(v.length, 5)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={6}
          disabled={disabled}
          aria-label={`Chữ số OTP thứ ${i + 1}`}
          data-testid="otp-digit"
          className={`h-14 w-full min-w-0 rounded-xl border bg-white text-center text-2xl font-semibold outline-none transition focus:border-ink focus:ring-4 focus:ring-black/5 sm:h-16 ${
            error ? 'border-red-400' : d ? 'border-ink/40' : 'border-black/10'
          }`}
        />
      ))}
    </div>
  );
}

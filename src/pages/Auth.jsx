import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useStore } from '../context/StoreContext';

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container-x grid min-h-[75vh] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="product-bg relative hidden h-full min-h-[560px] overflow-hidden rounded-[2rem] lg:block">
        <img src="/images/products/dam-corset-da-do-1.webp" alt="Đầm corset da đỏ" className="absolute inset-0 h-full w-full object-contain p-10" />
        <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/80 p-5 backdrop-blur">
          <p className="font-display text-2xl font-semibold">Thành viên LUXE</p>
          <p className="mt-1 text-sm text-black/60">Theo dõi đơn hàng, lưu địa chỉ và nhận ưu đãi riêng.</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-black/55">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function useAuthSubmit(path) {
  const { login, toast } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (body, welcome) => {
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api(path, { method: 'POST', body, token: '' });
      login(token, user);
      toast(welcome(user));
      navigate(params.get('next') || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { submit, loading, error, next: params.get('next') };
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { submit, loading, error, next } = useAuthSubmit('/auth/login');
  return (
    <AuthLayout title="Đăng nhập" subtitle="Chào mừng bạn quay lại LUXE.">
      <form onSubmit={(e) => { e.preventDefault(); submit(form, (u) => `Xin chào, ${u.full_name}!`); }} className="mt-8 space-y-4">
        <label className="block text-sm">Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mt-1.5" /></label>
        <label className="block text-sm">Mật khẩu<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input mt-1.5" /></label>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="btn-dark w-full">{loading && <Loader2 size={16} className="animate-spin" />} Đăng nhập</button>
        <button type="button" onClick={() => setForm({ email: 'demo@luxe.vn', password: 'Demo@123' })} className="btn-light w-full">
          Dùng tài khoản demo
        </button>
        <p className="text-center text-sm text-black/55">
          Chưa có tài khoản? <Link to={`/register${next ? `?next=${next}` : ''}`} className="font-medium text-ink underline">Đăng ký ngay</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const { submit, loading, error, next } = useAuthSubmit('/auth/register');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <AuthLayout title="Tạo tài khoản" subtitle="Chỉ mất 30 giây để trở thành thành viên LUXE.">
      <form onSubmit={(e) => { e.preventDefault(); submit(form, () => 'Tạo tài khoản thành công!'); }} className="mt-8 space-y-4">
        <label className="block text-sm">Họ và tên<input required value={form.full_name} onChange={set('full_name')} className="input mt-1.5" /></label>
        <label className="block text-sm">Email<input type="email" required value={form.email} onChange={set('email')} className="input mt-1.5" /></label>
        <label className="block text-sm">Số điện thoại<input value={form.phone} onChange={set('phone')} className="input mt-1.5" /></label>
        <label className="block text-sm">Mật khẩu<input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input mt-1.5" placeholder="Tối thiểu 6 ký tự" /></label>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="btn-dark w-full">{loading && <Loader2 size={16} className="animate-spin" />} Đăng ký</button>
        <p className="text-center text-sm text-black/55">
          Đã có tài khoản? <Link to={`/login${next ? `?next=${next}` : ''}`} className="font-medium text-ink underline">Đăng nhập</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

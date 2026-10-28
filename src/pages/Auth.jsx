import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, KeyRound, Loader2, Lock, Mail, MailCheck, Phone, Sparkles, User } from 'lucide-react';
import { api } from '../lib/api';
import { useStore } from '../context/StoreContext';
import { AuthShell, Field, OtpInput, PasswordInput, PasswordStrength } from '../components/AuthUI';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function ErrorBox({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
      {children}
    </p>
  );
}

function SubmitButton({ loading, children, ...props }) {
  return (
    <button disabled={loading} className="btn-dark h-12 w-full text-[15px]" {...props}>
      {loading ? <Loader2 size={18} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

// Đăng nhập/đăng ký xong thì lưu token, chào và quay lại trang trước đó (?next=)
function useAuthSuccess() {
  const { login, toast } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  return {
    next,
    done: ({ token, user }, message) => {
      login(token, user);
      toast(message(user));
      navigate(next || '/');
    },
  };
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { done, next } = useAuthSuccess();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      done(await api('/auth/login', { method: 'POST', body: form, token: '' }), (u) => `Xin chào, ${u.full_name}!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell tabs="login" title="Chào mừng trở lại" subtitle="Đăng nhập để theo dõi đơn hàng và nhận ưu đãi dành riêng cho thành viên.">
      <form onSubmit={submit} className="space-y-5">
        <Field
          label="Email"
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          placeholder="ban@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <PasswordInput
          icon={Lock}
          required
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          right={
            <Link to="/forgot-password" className="text-xs font-medium text-gold hover:text-ink">
              Quên mật khẩu?
            </Link>
          }
        />
        <ErrorBox>{error}</ErrorBox>
        <SubmitButton loading={loading}>
          Đăng nhập <ArrowRight size={16} />
        </SubmitButton>

        <div className="flex items-center gap-3 text-xs text-black/35">
          <span className="h-px flex-1 bg-black/10" /> hoặc <span className="h-px flex-1 bg-black/10" />
        </div>
        <button
          type="button"
          onClick={() => setForm({ email: 'demo@luxe.vn', password: 'Demo@123' })}
          className="btn-light h-12 w-full"
        >
          <Sparkles size={16} className="text-gold" /> Dùng tài khoản demo
        </button>
        <p className="text-center text-sm text-black/55">
          Chưa có tài khoản?{' '}
          <Link to={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-ink underline-offset-4 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '', agree: false });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { done, next } = useAuthSuccess();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errors = {
    full_name: form.full_name.trim().length < 2 && 'Vui lòng nhập họ tên',
    email: !EMAIL_RE.test(form.email) && 'Email không hợp lệ',
    phone: form.phone && !/^[0-9+ ]{9,15}$/.test(form.phone) && 'Số điện thoại không hợp lệ',
    password: form.password.length < 6 && 'Mật khẩu tối thiểu 6 ký tự',
    confirm: form.confirm !== form.password && 'Mật khẩu nhập lại không khớp',
    agree: !form.agree && 'Bạn cần đồng ý với điều khoản',
  };
  const show = (k) => touched[k] && errors[k];

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ full_name: true, email: true, phone: true, password: true, confirm: true, agree: true });
    if (Object.values(errors).some(Boolean)) return;
    setError('');
    setLoading(true);
    try {
      const { full_name, email, phone, password } = form;
      done(await api('/auth/register', { method: 'POST', body: { full_name, email, phone, password }, token: '' }), () => 'Tạo tài khoản thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell tabs="register" title="Tạo tài khoản" subtitle="Chỉ mất 30 giây để trở thành thành viên LUXE và nhận ưu đãi 10% cho đơn đầu tiên.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Họ và tên" icon={User} autoComplete="name" placeholder="Nguyễn Văn A" value={form.full_name} onChange={set('full_name')} onBlur={blur('full_name')} error={show('full_name')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" icon={Mail} type="email" autoComplete="email" placeholder="ban@email.com" value={form.email} onChange={set('email')} onBlur={blur('email')} error={show('email')} />
          <Field label="Số điện thoại" icon={Phone} type="tel" autoComplete="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={set('phone')} onBlur={blur('phone')} error={show('phone')} hint="Không bắt buộc" />
        </div>
        <div>
          <PasswordInput icon={Lock} autoComplete="new-password" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set('password')} onBlur={blur('password')} error={show('password')} />
          <PasswordStrength password={form.password} />
        </div>
        <PasswordInput
          label="Nhập lại mật khẩu"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={form.confirm}
          onChange={set('confirm')}
          onBlur={blur('confirm')}
          error={show('confirm')}
          right={form.confirm && form.confirm === form.password && <span className="flex items-center gap-1 text-xs text-emerald-600"><Check size={14} /> Khớp</span>}
        />
        <label className="flex cursor-pointer items-start gap-3 text-sm text-black/65">
          <input type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-0.5 h-4 w-4 accent-ink" />
          <span>
            Tôi đồng ý với <span className="font-medium text-ink underline">Điều khoản dịch vụ</span> và{' '}
            <span className="font-medium text-ink underline">Chính sách bảo mật</span> của LUXE
          </span>
        </label>
        {show('agree') && <p className="-mt-2 text-xs text-red-600">{errors.agree}</p>}
        <ErrorBox>{error}</ErrorBox>
        <SubmitButton loading={loading}>
          Tạo tài khoản <ArrowRight size={16} />
        </SubmitButton>
        <p className="text-center text-sm text-black/55">
          Đã có tài khoản?{' '}
          <Link to={`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-ink underline-offset-4 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

const STEPS = ['Email', 'Mã OTP', 'Mật khẩu mới'];

function Stepper({ step }) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Các bước">
      {STEPS.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${
              i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-ink text-white' : 'bg-black/5 text-black/40'
            }`}
          >
            {i < step ? <Check size={14} /> : i + 1}
          </span>
          <span className={`hidden text-xs font-medium sm:block ${i === step ? 'text-ink' : 'text-black/40'}`}>{label}</span>
          {i < STEPS.length - 1 && <span className={`h-px flex-1 ${i < step ? 'bg-emerald-500' : 'bg-black/10'}`} />}
        </li>
      ))}
    </ol>
  );
}

export function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [pw, setPw] = useState({ password: '', confirm: '' });
  const [cooldown, setCooldown] = useState(0);
  const [debugOtp, setDebugOtp] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { done } = useAuthSuccess();

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const run = async (fn) => {
    setError('');
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = () =>
    run(async () => {
      try {
        const res = await api('/auth/forgot-password', { method: 'POST', body: { email }, token: '' });
        setNotice(res.message);
        setDebugOtp(res.debug_otp || '');
        setCooldown(res.resend_after || 60);
        setOtp('');
        setStep(1);
      } catch (err) {
        if (err.status === 429 && step === 0) setStep(1);
        throw err;
      }
    });

  const verify = () =>
    run(async () => {
      const res = await api('/auth/verify-otp', { method: 'POST', body: { email, otp }, token: '' });
      setResetToken(res.reset_token);
      setStep(2);
    });

  const reset = () =>
    run(async () => {
      if (pw.password.length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự');
      if (pw.password !== pw.confirm) throw new Error('Mật khẩu nhập lại không khớp');
      const res = await api('/auth/reset-password', { method: 'POST', body: { reset_token: resetToken, password: pw.password }, token: '' });
      done(res, () => 'Đặt lại mật khẩu thành công!');
    });

  // Tự xác thực khi đã nhập đủ 6 số
  useEffect(() => {
    if (step === 1 && otp.length === 6 && !loading) verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const titles = [
    ['Quên mật khẩu?', 'Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP gồm 6 chữ số để đặt lại mật khẩu.'],
    ['Nhập mã xác thực', null],
    ['Tạo mật khẩu mới', 'Mật khẩu mới phải khác mật khẩu cũ và có ít nhất 6 ký tự.'],
  ];

  return (
    <AuthShell title={titles[step][0]} subtitle={titles[step][1]}>
      <Stepper step={step} />

      {step === 0 && (
        <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-5">
          <Field label="Email" icon={Mail} type="email" required autoFocus autoComplete="email" placeholder="ban@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <ErrorBox>{error}</ErrorBox>
          <SubmitButton loading={loading} data-testid="send-otp">
            Gửi mã OTP <ArrowRight size={16} />
          </SubmitButton>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); verify(); }} className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl bg-cream p-4 text-sm">
            <MailCheck size={20} className="mt-0.5 shrink-0 text-gold" />
            <p className="text-black/65">
              {notice || 'Mã OTP đã được gửi.'} Email: <b className="break-all text-ink">{email}</b>
            </p>
          </div>
          {debugOtp && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800 ring-1 ring-amber-200" data-testid="debug-otp">
              Chế độ thử nghiệm (chưa cấu hình gửi email): mã OTP là <b className="font-mono text-sm">{debugOtp}</b>
            </p>
          )}
          <OtpInput value={otp} onChange={setOtp} disabled={loading} error={!!error} />
          <ErrorBox>{error}</ErrorBox>
          <SubmitButton loading={loading} disabled={loading || otp.length < 6}>
            Xác nhận mã <ArrowRight size={16} />
          </SubmitButton>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => { setStep(0); setError(''); }} className="flex items-center gap-1 text-black/55 hover:text-ink">
              <ArrowLeft size={14} /> Đổi email
            </button>
            <button type="button" onClick={sendOtp} disabled={cooldown > 0 || loading} className="font-medium text-gold hover:text-ink disabled:text-black/35" data-testid="resend-otp">
              {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi lại mã'}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); reset(); }} className="space-y-5">
          <div>
            <PasswordInput label="Mật khẩu mới" icon={KeyRound} autoFocus autoComplete="new-password" placeholder="Tối thiểu 6 ký tự" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} />
            <PasswordStrength password={pw.password} />
          </div>
          <PasswordInput label="Nhập lại mật khẩu mới" icon={Lock} autoComplete="new-password" placeholder="Nhập lại mật khẩu" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          <ErrorBox>{error}</ErrorBox>
          <SubmitButton loading={loading}>
            Đặt lại mật khẩu <Check size={16} />
          </SubmitButton>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-black/55">
        Nhớ ra mật khẩu?{' '}
        <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </AuthShell>
  );
}

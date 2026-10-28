import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-32 text-center">
      <p className="font-display text-8xl font-semibold text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Không tìm thấy trang</h1>
      <p className="mt-2 text-black/55">Trang bạn tìm có thể đã được chuyển hoặc không tồn tại.</p>
      <Link to="/" className="btn-dark mt-8">Về trang chủ</Link>
    </div>
  );
}

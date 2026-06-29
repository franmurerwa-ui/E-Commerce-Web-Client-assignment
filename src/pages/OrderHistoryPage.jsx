import { Link } from 'react-router-dom';
import { useOrders } from '../features/orders/hooks';
import Button from '../components/Button';
import { PackageIcon, ChevronRightIcon } from '../components/icons';
import { formatPrice } from '../utils/currency';

const STATUS_STYLES = {
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  DELIVERED: 'bg-blue-50 text-blue-700 border border-blue-200',
  CANCELLED: 'bg-red-50 text-red-600 border border-red-200',
};

export default function OrderHistoryPage() {
  const { data: orders = [] } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mb-5">
            <PackageIcon className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">No orders yet</h2>
          <p className="text-sm text-slate-400 mb-6">Your order history will appear here</p>
          <Link to="/"><Button>Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
        </div>
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/order-confirmation/${order.id}`} className="group block rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-mono text-xs text-slate-400 mb-1">{order.id}</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] ?? STATUS_STYLES.CONFIRMED}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-slate-900">{formatPrice(order.total)}</span>
                  <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-slate-500">
                    <span className="truncate mr-4">{item.title.slice(0, 45)}{item.title.length > 45 ? '…' : ''} ×{item.qty}</span>
                    <span className="font-medium text-slate-700 shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

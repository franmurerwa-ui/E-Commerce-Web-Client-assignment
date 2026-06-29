import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../features/orders/hooks';
import Button from '../components/Button';
import { CheckCircleIcon, PackageIcon } from '../components/icons';
import { formatPrice } from '../utils/currency';

const STATUS_STYLES = {
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
  DELIVERED: 'bg-blue-50 text-blue-700 border border-blue-200',
  CANCELLED: 'bg-red-50 text-red-600 border border-red-200',
};

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { data: order } = useOrder(id);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 mb-5">
            <CheckCircleIcon className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 text-sm">Thank you for your purchase. Your order is being processed.</p>
          {order && <p className="mt-3 text-xs text-slate-400">Order ID: <span className="font-mono font-semibold text-slate-600">{order.id}</span></p>}
        </div>

        {order && (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <PackageIcon className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Order date</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] ?? STATUS_STYLES.CONFIRMED}`}>
                {order.status}
              </span>
            </div>

            <div className="px-6 py-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Items</p>
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{item.qty}</span>
                      <span className="text-slate-700 font-medium">{item.title.slice(0, 38)}{item.title.length > 38 ? '…' : ''}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>Total</span>
                <span className="text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"><Button size="lg" className="flex-1 sm:flex-none">Continue Shopping</Button></Link>
          <Link to="/orders"><Button variant="secondary" size="lg" className="flex-1 sm:flex-none">View All Orders</Button></Link>
        </div>
      </div>
    </div>
  );
}

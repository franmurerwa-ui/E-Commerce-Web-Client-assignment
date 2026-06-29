import { Link } from 'react-router-dom';
import { useCart, useUpdateQty, useRemoveFromCart } from '../features/cart/hooks';
import Button from '../components/Button';
import { TrashIcon, ShoppingCartIcon } from '../components/icons';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

const FALLBACK = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80&h=80&fit=crop';

const getCartImage = (image) => {
  if (!image || typeof image !== 'string') return FALLBACK;
  if (image.startsWith('http') && !image.includes('placeimg') && !image.includes('api.escuelajs.co/api/v1/files/') && !image.includes('kjkfjw.jskfj')) {
    return image;
  }
  return FALLBACK;
};

export default function CartPage() {
  const { data: cart = [] } = useCart();
  const updateQty = useUpdateQty();
  const remove = useRemoveFromCart();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mb-5">
            <ShoppingCartIcon className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h2>
          <p className="text-sm text-slate-400 mb-6">Add products to get started</p>
          <Link to="/"><Button size="md">Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 flex flex-col gap-3">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <img
                  src={getCartImage(item.image)}
                  alt={item.title}
                  className="h-16 w-16 rounded-xl object-cover shrink-0 bg-slate-100"
                  onError={(e) => { e.target.src = FALLBACK; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm leading-snug truncate">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => updateQty.mutate({ id: item.id, qty: item.qty - 1 })} disabled={item.qty <= 1} className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold disabled:opacity-30">−</button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.qty}</span>
                  <button onClick={() => updateQty.mutate({ id: item.id, qty: item.qty + 1 })} className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold">+</button>
                </div>
                <p className="text-sm font-bold text-slate-900 w-20 text-right shrink-0">{formatPrice(item.price * item.qty)}</p>
                <button onClick={() => { remove.mutate(item.id); toast.success('Item removed'); }} className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all ml-1">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-72 shrink-0">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 lg:sticky lg:top-24 flex flex-col gap-4">
              <h2 className="font-bold text-slate-900 text-base">Order Summary</h2>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium text-slate-700">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>
              <Link to="/checkout"><Button size="lg" className="w-full mt-1">Proceed to Checkout</Button></Link>
              <Link to="/" className="text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

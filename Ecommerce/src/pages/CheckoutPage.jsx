import { useNavigate, Link } from 'react-router-dom';
import { useCart, useClearCart } from '../features/cart/hooks';
import { usePlaceOrder } from '../features/orders/hooks';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { CheckCircleIcon } from '../components/icons';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart = [] } = useCart();
  const clearCart = useClearCart();
  const placeOrder = usePlaceOrder();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-lg font-bold text-slate-700 mb-4">Nothing to checkout</p>
          <Link to="/"><Button>Back to Products</Button></Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    placeOrder.mutate(cart, {
      onSuccess: (order) => {
        clearCart.mutate();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.id}`);
      },
      onError: () => toast.error('Failed to place order. Please try again.'),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Final Step</p>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Ready to place your order</p>
                  <p className="text-xs text-slate-400">Your cart items will be confirmed and processed</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-500 leading-relaxed">
                By placing this order you agree to our terms. Orders are processed immediately after confirmation.
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full text-base" disabled={placeOrder.isPending}>
              {placeOrder.isPending
                ? <><Spinner className="h-4 w-4" /> Placing Order...</>
                : `Confirm Order — ${formatPrice(total)}`}
            </Button>
            <Link to="/cart" className="block text-center mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors">← Back to Cart</Link>
          </form>

          <div className="lg:w-72 shrink-0">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 text-sm mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-slate-500 truncate mr-2">{item.title.slice(0, 26)}{item.title.length > 26 ? '…' : ''} ×{item.qty}</span>
                    <span className="font-semibold text-slate-800 shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-base">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

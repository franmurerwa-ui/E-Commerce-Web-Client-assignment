import { Link } from 'react-router-dom';
import { useAddToCart, useCart } from '../features/cart/hooks';
import { CheckCircleIcon } from './icons';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

const FALLBACK = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop';

const isSafeImage = (img) => {
  if (!img || typeof img !== 'string') return false;
  return img.startsWith('http') && !img.includes('placeimg') && !img.includes('api.escuelajs.co/api/v1/files/') && !img.includes('kjkfjw.jskfj');
};

const getImage = (product) => {
  const img = product.images?.[0];
  return isSafeImage(img) ? img : FALLBACK;
};

export default function ProductCard({ product }) {
  const addToCart = useAddToCart();
  const { data: cart = [] } = useCart();
  const inCart = cart.some((i) => i.id === product.id);
  const image = getImage(product);

  const handleAdd = (e) => {
    e.preventDefault();
    if (inCart) return;
    addToCart.mutate(product, {
      onSuccess: () => toast.success(`${product.title.slice(0, 28)} added`),
      onError: () => toast.error('Failed to add to cart'),
    });
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-orange-100 overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/80 transition-all duration-200"
    >
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {product.category?.name}
        </span>
      </div>

      <div className="relative aspect-square bg-orange-50 overflow-hidden">
        <img
          src={image}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        {inCart && (
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50/90 backdrop-blur-sm border border-orange-200 px-2 py-0.5 rounded-full shadow-sm">
              <CheckCircleIcon className="h-3 w-3" /> In Cart
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={addToCart.isPending || inCart}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {inCart ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}

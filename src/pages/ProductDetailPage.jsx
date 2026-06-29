import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../features/products/hooks';
import { useAddToCart, useCart } from '../features/cart/hooks';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { ChevronLeftIcon, CheckCircleIcon, ShoppingCartIcon } from '../components/icons';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

const FALLBACK = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=600&fit=crop';

const isSafeImage = (img) => {
  if (!img || typeof img !== 'string') return false;
  return img.startsWith('http') && !img.includes('placeimg') && !img.includes('api.escuelajs.co/api/v1/files/') && !img.includes('kjkfjw.jskfj');
};

const getImages = (product) => {
  const imgs = (product.images ?? []).filter(isSafeImage);
  return imgs.length ? imgs : [FALLBACK];
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading, isError, error } = useProduct(id);
  const addToCart = useAddToCart();
  const { data: cart = [] } = useCart();
  const inCart = product ? cart.some((i) => i.id === product.id) : false;

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-slate-400">Loading product...</p>
    </div>
  );

  if (isError) return (
    <div className="text-center py-32">
      <p className="text-red-500 font-medium text-sm">{error.message}</p>
    </div>
  );

  const images = getImages(product);

  const handleAdd = () => {
    addToCart.mutate(product, {
      onSuccess: () => toast.success('Added to cart!'),
      onError: () => toast.error('Failed to add to cart'),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors group">
          <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* Images */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = FALLBACK; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-slate-900' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.src = FALLBACK; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              {product.category?.name && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide mb-3">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-2xl font-bold text-slate-900 leading-snug">{product.title}</h1>
            </div>

            <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>

            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-5">{product.description}</p>

            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleAdd}
                disabled={addToCart.isPending || inCart}
                variant={inCart ? 'secondary' : 'primary'}
              >
                {inCart
                  ? <><CheckCircleIcon className="h-4 w-4 text-emerald-500" /> Already in Cart</>
                  : addToCart.isPending ? 'Adding...'
                  : <><ShoppingCartIcon className="h-4 w-4" /> Add to Cart</>
                }
              </Button>
              {inCart && (
                <Link to="/cart" className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors">
                  View cart →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

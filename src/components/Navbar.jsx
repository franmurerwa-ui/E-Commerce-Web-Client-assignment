import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/hooks';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon } from './icons';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { data: cart = [] } = useCart();
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initialTheme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">ShopWave</span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) =>
            `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
          }>
            Products
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) =>
            `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
          }>
            Orders
          </NavLink>
        </nav>

        <button
          type="button"
          className="sm:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          onClick={() => setMobileNavOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={mobileNavOpen ? 'M18 6L6 18M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'} />
          </svg>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700 text-sm font-medium"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover border border-slate-200"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff&size=64`; }}
                />
                <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
                <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-100 shadow-lg shadow-slate-100/80 overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>
                  {/* Links */}
                  <div className="py-1">
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                      </svg>
                      Order History
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <ShoppingCartIcon className="h-4 w-4 text-slate-400" />
                      Cart {itemCount > 0 && <span className="ml-auto text-xs font-bold text-slate-500">({itemCount})</span>}
                    </Link>
                  </div>
                  {/* Sign out */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
      {mobileNavOpen && (
        <div className="sm:hidden absolute inset-x-0 top-full bg-white border-t border-slate-200 shadow-lg z-40">
          <div className="px-4 py-3 flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`
              }
              onClick={() => setMobileNavOpen(false)}
            >
              Products
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`
              }
              onClick={() => setMobileNavOpen(false)}
            >
              Orders
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

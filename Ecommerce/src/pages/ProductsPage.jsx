import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from '../components/icons';
import { useProducts, useCategories } from '../features/products/hooks';

const LIMIT = 12;

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '', categoryId: '' });
  const [page, setPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: { products = [] } = {}, isLoading, isError, error, isFetching } = useProducts({ page, limit: LIMIT, ...filters });
  const { data: categories = [] } = useCategories();

  const updateFilter = (patch) => { setFilters((f) => ({ ...f, ...patch })); setPage(1); };
  const handleSearch = (e) => { e.preventDefault(); updateFilter({ search: searchInput }); };
  const clearAll = () => { setFilters({ search: '', categoryId: '', priceMin: '', priceMax: '', sort: '' }); setSearchInput(''); setPage(1); };

  const activeFilterCount = [filters.categoryId].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Store</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-6">All Products</h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-full">
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
            <Button type="submit" size="md" className="w-full sm:w-auto">Search</Button>
            {(filters.search || activeFilterCount > 0) && (
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={clearAll}>
                <XIcon className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-slate-500">{products.length} products</p>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-slate-50 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Filters</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar categories={categories} filters={filters} onChange={(patch) => { updateFilter(patch); }} />
              </div>
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar categories={categories} filters={filters} onChange={updateFilter} />
          </div>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            {(filters.search || activeFilterCount > 0) && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs text-slate-400">Active:</span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-medium">
                    "{filters.search}" <button onClick={() => { updateFilter({ search: '' }); setSearchInput(''); }}><XIcon className="h-3 w-3 ml-1" /></button>
                  </span>
                )}
                {filters.categoryId && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium border border-orange-200">
                    {categories.find((c) => String(c.id) === filters.categoryId)?.name}
                    <button onClick={() => updateFilter({ categoryId: '' })}><XIcon className="h-3 w-3 ml-1" /></button>
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Spinner className="h-8 w-8" />
                <p className="text-sm text-slate-400">Loading products...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-32">
                <p className="text-red-500 font-medium text-sm">{error.message}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 mb-4">
                  <SearchIcon className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-base font-semibold text-slate-700">No products found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                <button onClick={clearAll} className="mt-4 text-sm font-medium text-slate-900 underline underline-offset-2">Clear all filters</button>
              </div>
            ) : (
              <>
                {isFetching && !isLoading && <div className="flex justify-center mb-5"><Spinner className="h-5 w-5" /></div>}
                <div className="flex items-center justify-between mb-5">
                  <p className="text-xs text-slate-400 font-medium">{products.length} products{products.length === LIMIT ? '+' : ''}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                <div className="flex items-center justify-center gap-3 mt-12">
                  <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isFetching}>
                    <ChevronLeftIcon className="h-4 w-4" /> Prev
                  </Button>
                  <span className="text-xs font-medium text-slate-500 px-4 py-2 rounded-lg bg-white border border-slate-200">Page {page}</span>
                  <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={products.length < LIMIT || isFetching}>
                    Next <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { XIcon, PlusIcon } from './icons';
import { useCreateCategory } from '../features/products/hooks';
import toast from 'react-hot-toast';

export default function FilterSidebar({ categories = [], filters, onChange }) {
  const { categoryId } = filters;
  const [newCat, setNewCat] = useState('');
  const [showCatForm, setShowCatForm] = useState(false);
  const createCategory = useCreateCategory();

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    createCategory.mutate({ name: newCat.trim() }, {
      onSuccess: () => { toast.success(`"${newCat.trim()}" created`); setNewCat(''); setShowCatForm(false); },
      onError: () => toast.error('Failed to create category'),
    });
  };

  const checkIcon = (
    <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-24">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-900">Filters</span>
          {categoryId && (
            <button
              onClick={() => onChange({ categoryId: '' })}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Category</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onChange({ categoryId: '' })}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${!categoryId ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-orange-50'}`}
            >
              All Categories
              {!categoryId && checkIcon}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onChange({ categoryId: categoryId === String(cat.id) ? '' : String(cat.id) })}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${categoryId === String(cat.id) ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-orange-50'}`}
              >
                <span className="truncate">{cat.name}</span>
                {categoryId === String(cat.id) && checkIcon}
              </button>
            ))}
          </div>

          {/* New category */}
          <div className="mt-3">
            {showCatForm ? (
              <form onSubmit={handleCreateCategory} className="flex flex-col gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Category name..."
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 bg-slate-50"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={createCategory.isPending || !newCat.trim()}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors"
                  >
                    {createCategory.isPending ? '...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCatForm(false); setNewCat(''); }}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCatForm(true)}
                className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-400 border border-dashed border-slate-200 hover:border-slate-300 hover:text-slate-600 transition-all"
              >
                <PlusIcon className="h-3 w-3" /> New Category
              </button>
            )}
          </div>
        </div>

        {/* Active filter chip */}
        {categoryId && (
          <div className="px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-2">Active filter</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium border border-orange-200">
              {categories.find((c) => String(c.id) === categoryId)?.name ?? 'Category'}
              <button onClick={() => onChange({ categoryId: '' })} className="hover:text-orange-500 transition-colors">
                <XIcon className="h-2.5 w-2.5" />
              </button>
            </span>
          </div>
        )}

      </div>
    </aside>
  );
}

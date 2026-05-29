import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dummyApi, toINR } from '../api/axiosInstance';

const CATEGORIES = [
  { label: 'All',              value: '' },
  { label: "Men's Shirts",     value: 'mens-shirts' },
  { label: "Men's Shoes",      value: 'mens-shoes' },
  { label: "Men's Watches",    value: 'mens-watches' },
  { label: "Women's Dresses",  value: 'womens-dresses' },
  { label: "Women's Shoes",    value: 'womens-shoes' },
  { label: "Women's Bags",     value: 'womens-bags' },
  { label: "Women's Jewellery",value: 'womens-jewellery' },
  { label: 'Sunglasses',       value: 'sunglasses' },
  { label: 'Fragrances',       value: 'fragrances' },
];

const SORT_OPTIONS = [
  { label: 'Relevance',     value: '' },
  { label: 'Price: Low–High', value: 'asc' },
  { label: 'Price: High–Low', value: 'desc' },
  { label: 'Top Rated',      value: 'rating' },
  { label: 'Discount',       value: 'discount' },
];

function ProductCard({ product, onClick }) {
  const [wish, setWish] = useState(false);
  const price = toINR(product.price);
  const discounted = Math.round(price * (1 - product.discountPercentage / 100));
  const disc = Math.round(product.discountPercentage);

  return (
    <div onClick={onClick} className="group cursor-pointer">
      <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-[3/4] mb-3">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {disc > 5 && (
          <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {disc}% OFF
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); setWish(w => !w); }}
          className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className={`w-4 h-4 ${wish ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"/>
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full py-2.5 bg-gray-900 text-white text-xs font-semibold tracking-wide hover:bg-pink-600 transition-colors">
            QUICK VIEW
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">{product.brand}</p>
      <p className="text-sm text-gray-800 font-medium truncate mt-0.5 leading-snug">{product.title}</p>
      <div className="flex items-center gap-1 mt-1">
        <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>
        <span className="text-xs text-gray-500">{product.rating}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-sm font-bold text-gray-900">₹{discounted.toLocaleString('en-IN')}</span>
        {disc > 5 && <span className="text-xs text-gray-400 line-through">₹{price.toLocaleString('en-IN')}</span>}
        {disc > 5 && <span className="text-xs text-pink-500 font-semibold">({disc}% off)</span>}
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || '';
  const page     = Number(searchParams.get('page') || '1');
  const limit    = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url, res;
      const skip = (page - 1) * limit;

      if (keyword) {
        res = await dummyApi.get(`/products/search?q=${keyword}&limit=${limit}&skip=${skip}`);
      } else if (category) {
        res = await dummyApi.get(`/products/category/${category}?limit=${limit}&skip=${skip}`);
      } else {
        res = await dummyApi.get(`/products?limit=${limit}&skip=${skip}`);
      }

      let items = res.data.products;
      const tot = res.data.total;

      if (sort === 'asc')     items = [...items].sort((a, b) => a.price - b.price);
      if (sort === 'desc')    items = [...items].sort((a, b) => b.price - a.price);
      if (sort === 'rating')  items = [...items].sort((a, b) => b.rating - a.rating);
      if (sort === 'discount')items = [...items].sort((a, b) => b.discountPercentage - a.discountPercentage);

      setProducts(items);
      setTotal(tot);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearAll = () => setSearchParams({});

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen pt-16 bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSidebarOpen(s => !s)}
              className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:border-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h4"/></svg>
              FILTERS
            </button>
            {/* sort chips */}
            {SORT_OPTIONS.slice(1).map(opt => (
              <button
                key={opt.value}
                onClick={() => set('sort', sort === opt.value ? '' : opt.value)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  sort === opt.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-300 text-gray-600 hover:border-gray-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="flex-shrink-0 text-sm text-gray-400">{total.toLocaleString()} items</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 flex gap-6">

        {/* Sidebar */}
        {(sidebarOpen) && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-64 bg-white lg:bg-transparent lg:w-56 flex-shrink-0 overflow-y-auto lg:overflow-visible shadow-xl lg:shadow-none transition-transform`}>
              <div className="lg:sticky lg:top-32 bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Filters</h3>
                  <button onClick={clearAll} className="text-xs text-pink-600 font-semibold hover:underline">Clear All</button>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
                  <div className="space-y-1">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => { set('category', cat.value); setSidebarOpen(false); }}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          category === cat.value
                            ? 'bg-pink-600 text-white font-semibold'
                            : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {keyword && (
            <p className="text-sm text-gray-500 mb-4">
              Search results for <span className="font-semibold text-gray-800">"{keyword}"</span>
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}`)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">No products found</h3>
              <p className="text-sm text-gray-400 mb-5">Try a different search or remove filters.</p>
              <button onClick={clearAll} className="px-6 py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-full hover:bg-pink-500 transition-colors">
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(Math.min(totalPages, 8))].map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => set('page', String(p))}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                      page === p
                        ? 'bg-pink-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-600'
                    }`}>
                    {p}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyApi, toINR } from '../api/axiosInstance';

const CATEGORIES = [
  { name: "Men's Fashion",    slug: 'mens-shirts',    emoji: '👔' },
  { name: "Women's Fashion",  slug: 'womens-dresses', emoji: '👗' },
  { name: 'Footwear',        slug: 'womens-shoes',   emoji: '👟' },
  { name: 'Watches',         slug: 'mens-watches',   emoji: '⌚' },
  { name: 'Jewellery',       slug: 'womens-jewellery',emoji: '💍' },
  { name: 'Sunglasses',      slug: 'sunglasses',     emoji: '🕶️' },
];

const BANNERS = [
  { tag: 'New Collection', headline: 'Style That\nSpeaks Louder', sub: 'Discover the season\'s hottest fashion trends', cta: 'Shop Now', bg: 'from-[#1a1a2e] to-[#16213e]', accent: '#e94560' },
  { tag: 'Up to 70% Off',  headline: 'End of Season\nSale Is Live',  sub: 'Premium brands at prices you\'ll love',          cta: 'Grab Deals', bg: 'from-[#0f0c29] to-[#302b63]', accent: '#f7971e' },
  { tag: 'Just Arrived',   headline: 'Fresh Drops\nEvery Day',       sub: 'Stay ahead of fashion with our daily updates',   cta: 'Explore',   bg: 'from-[#134e5e] to-[#71b280]', accent: '#fff' },
];

function ProductMiniCard({ product }) {
  const navigate = useNavigate();
  const price = toINR(product.price);
  const discounted = Math.round(price * (1 - product.discountPercentage / 100));

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="cursor-pointer group flex-shrink-0 w-40 sm:w-48"
    >
      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-[3/4] mb-2">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPercentage > 10 && (
          <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 truncate">{product.brand}</p>
      <p className="text-xs font-medium text-gray-900 truncate leading-tight">{product.title}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-sm font-bold text-gray-900">₹{discounted.toLocaleString('en-IN')}</span>
        {product.discountPercentage > 5 && (
          <span className="text-xs text-gray-400 line-through">₹{price.toLocaleString('en-IN')}</span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          dummyApi.get('/products?limit=10&select=id,title,price,thumbnail,discountPercentage,brand,rating,category'),
          dummyApi.get('/products?limit=20&skip=10&select=id,title,price,thumbnail,discountPercentage,brand,rating,category'),
        ]);
        setFeatured(featRes.data.products);
        setTrending(trendRes.data.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const b = BANNERS[bannerIdx];

  return (
    <main className="min-h-screen pt-16 bg-white">

      {/* ── HERO BANNER ── */}
      <section className={`relative bg-gradient-to-r ${b.bg} min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden transition-all duration-700`}>
        {/* background shimmer */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_60%_50%,white,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full border mb-5"
              style={{ color: b.accent, borderColor: b.accent + '55' }}>
              {b.tag}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5 whitespace-pre-line tracking-tight">
              {b.headline}
            </h1>
            <p className="text-base text-white/60 mb-8 max-w-sm leading-relaxed">{b.sub}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3.5 rounded-full text-sm font-bold transition-all active:scale-95"
                style={{ background: b.accent, color: b.accent === '#fff' ? '#000' : '#fff' }}
              >
                {b.cta}
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-8 py-3.5 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                View All →
              </button>
            </div>
          </div>

          {/* right side floating product cards preview */}
          {featured.length > 0 && (
            <div className="hidden lg:grid grid-cols-2 gap-3 opacity-80">
              {featured.slice(0, 4).map(p => (
                <div key={p.id} className="rounded-2xl overflow-hidden aspect-square bg-white/10">
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === bannerIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30'}`} />
          ))}
        </div>
      </section>

      {/* ── MYNTRA-STYLE STRIP OFFERS ── */}
      <section className="bg-pink-50 border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-wrap justify-center gap-6 sm:gap-12">
          {[
            ['🚚', 'Free Delivery', 'On orders above ₹999'],
            ['↩️', 'Easy Returns',  '30-day no-questions returns'],
            ['✅', '100% Authentic', 'All products guaranteed genuine'],
            ['💳', 'Pay Later',     'Easy EMI & Buy Now Pay Later'],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex items-center gap-2.5">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-800">{title}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY GRID (Myntra style) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
          <Link to="/products" className="text-sm text-pink-600 font-semibold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-pink-50 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-sm"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-pink-600 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS horizontal scroll ── */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-pink-500 font-semibold uppercase tracking-widest mb-0.5">Handpicked For You</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Top Picks</h2>
            </div>
            <Link to="/products" className="text-sm text-pink-600 font-semibold hover:underline">See All</Link>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-40 sm:w-48">
                  <div className="bg-gray-200 rounded-xl animate-pulse aspect-[3/4] mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-1 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
              {featured.map(p => <ProductMiniCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BIG PROMO BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 relative flex items-center min-h-[200px] px-8 sm:px-14 py-10">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(ellipse_at_right,#e94560,transparent_70%)]" />
          <div className="relative z-10">
            <p className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-2">Limited Time</p>
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-3">Flat 40% Off<br/>On Premium Brands</h3>
            <button onClick={() => navigate('/products')} className="mt-2 px-7 py-3 bg-pink-600 text-white text-sm font-bold rounded-full hover:bg-pink-500 transition-colors">
              Shop the Sale →
            </button>
          </div>
        </div>
      </section>

      {/* ── TRENDING NOW ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-pink-500 font-semibold uppercase tracking-widest mb-0.5">What's Hot</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Trending Now</h2>
          </div>
          <Link to="/products" className="text-sm text-pink-600 font-semibold hover:underline">View All</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.map(p => <ProductMiniCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── FOOTER STRIP ── */}
      <div className="bg-gray-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">SB</span>
            </div>
            <span className="text-lg font-black tracking-tight">Shopping Bhandar</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-400 border-t border-gray-800 pt-8">
            <p>India's premium fashion destination — bringing you the best of style, every single day.</p>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="hover:text-white transition-colors">All Products</Link>
              <Link to="/login"    className="hover:text-white transition-colors">My Account</Link>
              <Link to="/cart"     className="hover:text-white transition-colors">My Cart</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p>📞 1800-000-0000 (Toll Free)</p>
              <p>📧 support@shoppingbhandar.in</p>
              <p>🕐 Mon–Sat, 9am–9pm</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-8">© {new Date().getFullYear()} Shopping Bhandar. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
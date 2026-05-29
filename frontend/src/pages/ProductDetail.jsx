import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyApi, toINR } from '../api/axiosInstance';

const TABS = ['Description', 'Specifications', 'Reviews'];

export default function ProductDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [product,  setProduct]  = useState(null);
  const [similar,  setSimilar]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [qty,      setQty]      = useState(1);
  const [tab,      setTab]      = useState('Description');
  const [size,     setSize]     = useState('');
  const [pincode,  setPincode]  = useState('');
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setImgIdx(0); setTab('Description'); setSize(''); setAdded(false);
    (async () => {
      setLoading(true);
      try {
        const { data } = await dummyApi.get(`/products/${id}`);
        setProduct(data);
        const cat = await dummyApi.get(`/products/category/${data.category}?limit=6`);
        setSimilar(cat.data.products.filter(p => p.id !== data.id).slice(0, 5));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(i => i._id === String(product.id));
    if (idx > -1) {
      cart[idx].quantity += qty;
    } else {
      cart.push({
        _id: String(product.id),
        name: product.title,
        price: toINR(product.price),
        discountPrice: Math.round(toINR(product.price) * (1 - product.discountPercentage / 100)),
        images: product.images,
        category: product.category,
        quantity: qty,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Product not found.</p>
      <button onClick={() => navigate('/products')} className="px-6 py-2 bg-pink-600 text-white rounded-full text-sm font-semibold">
        Back to Products
      </button>
    </div>
  );

  const price      = toINR(product.price);
  const discounted = Math.round(price * (1 - product.discountPercentage / 100));
  const disc       = Math.round(product.discountPercentage);
  const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="min-h-screen pt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-pink-500 transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-pink-500 transition-colors">Products</button>
          <span>/</span>
          <button onClick={() => navigate(`/products?category=${product.category}`)} className="hover:text-pink-500 transition-colors capitalize">{product.category?.replace(/-/g, ' ')}</button>
          <span>/</span>
          <span className="text-gray-600 line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* LEFT — Image Gallery (Myntra style) */}
          <div className="flex gap-3">
            {/* Vertical thumbnails */}
            {product.images?.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2 w-14 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`rounded-lg overflow-hidden aspect-square border-2 transition-all ${i === imgIdx ? 'border-pink-500 scale-105' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative">
              <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square sticky top-24">
                <img
                  src={product.images?.[imgIdx] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {disc > 5 && (
                  <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {disc}% OFF
                  </div>
                )}
                {/* nav arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button onClick={() => setImgIdx(i => Math.min(product.images.length - 1, i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </>
                )}
              </div>
              {/* Mobile thumbnail strip */}
              {product.images?.length > 1 && (
                <div className="sm:hidden flex gap-2 mt-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 ${i === imgIdx ? 'border-pink-500' : 'border-gray-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-5">

            {/* Brand + Title */}
            <div>
              <p className="text-sm font-black text-pink-600 uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <svg className="w-3 h-3 fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>
                </div>
                <span className="text-sm text-gray-400">{product.reviews?.length || 0} Reviews</span>
                <span className="text-sm text-gray-400">|</span>
                <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y border-dashed border-gray-200">
              <span className="text-3xl font-black text-gray-900">₹{discounted.toLocaleString('en-IN')}</span>
              {disc > 5 && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-base font-bold text-pink-600">({disc}% OFF)</span>
                </>
              )}
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-700">SELECT SIZE</p>
                <button className="text-xs text-pink-600 font-semibold underline underline-offset-2">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(size === s ? '' : s)}
                    className={`w-11 h-11 rounded-full text-sm font-semibold border-2 transition-all ${
                      size === s
                        ? 'border-pink-600 bg-pink-600 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-pink-400 hover:text-pink-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-gray-700">QTY:</p>
              <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-lg transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-700 text-lg transition-colors">+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-full text-sm font-black uppercase tracking-wide transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.stock > 0
                      ? 'bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                }`}
              >
                {added ? '✓ Added to Bag!' : product.stock > 0 ? '🛍 Add to Bag' : 'Out of Stock'}
              </button>
              <button
                onClick={() => { handleAddToCart(); navigate('/cart'); }}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-full text-sm font-black uppercase tracking-wide transition-all ${
                  product.stock > 0
                    ? 'bg-pink-600 text-white hover:bg-pink-500'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Pincode check */}
            <div className="border border-dashed border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-600 mb-2">CHECK DELIVERY</p>
              <div className="flex gap-2">
                <input
                  type="text" maxLength={6} placeholder="Enter Pincode"
                  value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400"
                />
                <button className="px-4 py-2 text-sm font-semibold text-pink-600 border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors">Check</button>
              </div>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['🚚','Free Delivery','Above ₹999'],['↩️','14 Day','Returns'],['✅','100%','Authentic']].map(([icon, l1, l2]) => (
                <div key={l1} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl mb-1">{icon}</p>
                  <p className="text-xs font-bold text-gray-800">{l1}</p>
                  <p className="text-[10px] text-gray-500">{l2}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="flex border-b border-gray-200 gap-8 mb-8">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-3 text-sm font-black uppercase tracking-wide transition-all border-b-2 -mb-px ${
                  tab === t ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'Description' && (
            <div className="max-w-3xl">
              <p className="text-gray-600 leading-relaxed text-[15px]">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-semibold rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {tab === 'Specifications' && (
            <div className="max-w-2xl">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Brand',        product.brand],
                    ['Category',     product.category?.replace(/-/g,' ')],
                    ['SKU',          product.sku],
                    ['Weight',       product.weight ? `${product.weight} kg` : '—'],
                    ['Dimensions',   product.dimensions ? `${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth} cm` : '—'],
                    ['Availability', product.availabilityStatus],
                    ['Min. Order',   product.minimumOrderQuantity],
                    ['Warranty',     product.warrantyInformation],
                    ['Shipping',     product.shippingInformation],
                    ['Return',       product.returnPolicy],
                  ].map(([key, val], i) => val && (
                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 font-semibold text-gray-700 capitalize w-40 rounded-l-lg">{key}</td>
                      <td className="py-3 px-4 text-gray-500 capitalize rounded-r-lg">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'Reviews' && (
            <div className="max-w-2xl space-y-4">
              {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        {r.reviewerName?.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{r.reviewerName}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                      {r.rating}
                      <svg className="w-3 h-3 fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/></svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(r.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-400">No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-black text-gray-900 mb-5">Similar Products</h2>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {similar.map(p => {
                const pp = toINR(p.price);
                const dp = Math.round(pp * (1 - p.discountPercentage / 100));
                return (
                  <div key={p.id} onClick={() => navigate(`/products/${p.id}`)}
                    className="flex-shrink-0 w-36 sm:w-44 cursor-pointer group">
                    <div className="rounded-xl overflow-hidden bg-gray-50 aspect-[3/4] mb-2">
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{p.brand}</p>
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.title}</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold text-gray-900">₹{dp.toLocaleString('en-IN')}</span>
                      {p.discountPercentage > 5 && <span className="text-xs text-pink-500 font-semibold">({Math.round(p.discountPercentage)}% off)</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Cart uses localStorage for simplicity; swap with Redux slice if needed
const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

export default function Cart() {
  const [items, setItems] = useState(getCart);
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const update = (id, qty) => {
    const next = qty < 1
      ? items.filter((i) => i._id !== id)
      : items.map((i) => i._id === id ? { ...i, quantity: qty } : i);
    setItems(next);
    saveCart(next);
  };

  const remove = (id) => update(id, 0);

  const subtotal  = items.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping  = subtotal > 999 ? 0 : 99;
  const tax       = Math.round(subtotal * 0.18);
  const total     = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout', { state: { items, subtotal, shipping, tax, total } });
  };

  if (items.length === 0) return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <div className="text-6xl">🛒</div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Your cart is empty</h2>
        <p className="text-sm text-gray-400">Add some products to get started.</p>
      </div>
      <Link to="/products" className="px-8 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.discountPrice || item.price;
              return (
                <div key={item._id} className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                  <Link to={`/products/${item._id}`} className="flex-shrink-0">
                    <img
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id}`}>
                      <h3 className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.category}</p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button onClick={() => update(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 text-lg">−</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => update(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 text-lg">+</button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{(price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button onClick={() => remove(item._id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900 text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {subtotal <= 999 && (
                <p className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  Add ₹{(999 - subtotal + 1).toLocaleString('en-IN')} more for free shipping!
                </p>
              )}

              <button
                onClick={handleCheckout}
                className="w-full mt-5 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-black mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

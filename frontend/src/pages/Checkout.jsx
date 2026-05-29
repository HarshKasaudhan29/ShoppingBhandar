import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';

const INITIAL_ADDR = { street: '', city: '', state: '', pincode: '', country: 'India' };

export default function Checkout() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { user }    = useSelector((s) => s.auth);
  const [address, setAddress]   = useState(INITIAL_ADDR);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');

  const items    = state?.items    || [];
  const total    = state?.total    || 0;
  const subtotal = state?.subtotal || 0;
  const shipping = state?.shipping || 0;
  const tax      = state?.tax      || 0;

  const handleChange = (e) =>
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const s = document.createElement('script');
      s.src   = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload  = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const { street, city, state: st, pincode } = address;
    if (!street || !city || !st || !pincode) {
      setError('Please fill all address fields.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order in DB
      const { data: order } = await axiosInstance.post('/orders', {
        orderItems: items.map((i) => ({
          product:  i._id,
          name:     i.name,
          image:    i.images?.[0] || '',
          price:    i.discountPrice || i.price,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        itemsPrice:    subtotal,
        shippingPrice: shipping,
        taxPrice:      tax,
        totalPrice:    total,
      });

      // 2. Create Razorpay order
      const { data: rzp } = await axiosInstance.post('/payment/create-order', { orderId: order._id });

      // 3. Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) { setError('Payment gateway failed to load.'); setLoading(false); return; }

      // 4. Open Razorpay
      const options = {
        key:         rzp.key,
        amount:      rzp.amount,
        currency:    rzp.currency,
        name:        'Shopping Bhandar',
        description: 'Order Payment',
        order_id:    rzp.id,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#000000' },
        handler: async (response) => {
          try {
            await axiosInstance.post('/payment/verify', {
              ...response,
              orderId: order._id,
            });
            localStorage.removeItem('cart');
            navigate('/orders/' + order._id, { replace: true });
          } catch {
            setError('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  const fields = [
    { name: 'street',  label: 'Street Address', placeholder: '123 MG Road', full: true },
    { name: 'city',    label: 'City',            placeholder: 'Mumbai' },
    { name: 'state',   label: 'State',           placeholder: 'Maharashtra' },
    { name: 'pincode', label: 'Pincode',         placeholder: '400001' },
    { name: 'country', label: 'Country',         placeholder: 'India' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Shipping Address */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Shipping Address</h2>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(({ name, label, placeholder, full }) => (
                  <div key={name} className={full ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-widest">
                      {label}
                    </label>
                    <input
                      type="text" name={name} required
                      value={address[name]} onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors bg-gray-50 focus:bg-white"
                    />
                  </div>
                ))}
              </div>

              {/* Order items preview */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-50"
                        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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

                <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <p className="text-xs text-gray-500">Secured by Razorpay. Your payment info is safe.</p>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full mt-5 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    `Pay ₹${total.toLocaleString('en-IN')}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

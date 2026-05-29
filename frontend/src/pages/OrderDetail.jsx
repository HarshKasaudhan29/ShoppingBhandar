import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await axiosInstance.get(`/orders/${id}`);
        if (active) setOrder(data);
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Unable to load order.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
        <p className="text-sm text-red-600">{error || 'Order not found.'}</p>
        <Link to="/orders" className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
            {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id || item.product} className="flex items-center gap-4">
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl bg-gray-50"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>{formatMoney(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'Free' : formatMoney(order.shippingPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatMoney(order.taxPrice)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatMoney(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Shipping</h2>
              <p className="text-sm text-gray-600 leading-6">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Payment</h2>
              <p className="text-sm text-gray-600">{order.paymentInfo?.status || 'Pending'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

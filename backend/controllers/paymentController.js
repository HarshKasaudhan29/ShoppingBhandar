import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

let razorpayInstance;

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured');
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: 'przp_test_Stdgo6DPKmB1GT',
      key_secret: '6yXwdO0iY3ZGJAXbqT6MlQAl',
    });
  }

  return razorpayInstance;
};

export const createOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const options = {
      amount:   Math.round(order.totalPrice * 100),
      currency: 'INR',
      receipt:  `receipt_${orderId}`,
    };

    const razorpayOrder = await getRazorpayInstance().orders.create(options);

    order.paymentInfo.razorpay_order_id = razorpayOrder.id;
    await order.save();

    res.json({
      id:       razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount:   razorpayOrder.amount,
      key:      process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay credentials are not configured' });
    }

    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: 'Invalid payment signature' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentInfo = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: 'Paid',
      paidAt: new Date(),
    };
    order.orderStatus = 'Processing';
    await order.save();

    res.json({ message: 'Payment verified successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

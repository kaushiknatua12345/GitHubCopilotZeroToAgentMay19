import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { api } from '../../../api/config';

interface ShippingForm {
  name: string;
  email: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
}

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ShippingForm>({
    name: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  if (items.length === 0) {
    navigate('/products');
    return null;
  }

  const SHIPPING_COST = 10;
  const DISCOUNT_RATE = 0.05;

  const subtotal = items.reduce((sum, item) => {
    const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
    return sum + effectivePrice * item.quantity;
  }, 0);
  const discount = subtotal * DISCOUNT_RATE;
  const grandTotal = subtotal - discount + SHIPPING_COST;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const orderId = Date.now();

    try {
      await axios.post(`${api.baseURL}${api.endpoints.orders}`, {
        orderId,
        branchId: 1,
        orderDate: new Date().toISOString(),
        name: `Order for ${form.name}`,
        description: `${items.length} item(s) — shipped to ${form.city}, ${form.state}`,
        status: 'pending',
      });

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
        await axios.post(`${api.baseURL}${api.endpoints.orderDetails}`, {
          orderDetailId: orderId + i + 1,
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: effectivePrice,
          notes: '',
        });
      }

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch {
      setError('Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-300`;
  const labelClass = `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="lg:flex-1 space-y-5">
            <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>Address *</label>
                  <input id="address" name="address" value={form.address} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="address2" className={labelClass}>Address Line 2</label>
                  <input id="address2" name="address2" value={form.address2} onChange={handleChange} className={inputClass} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className={labelClass}>City *</label>
                    <input id="city" name="city" value={form.city} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelClass}>State *</label>
                    <input id="state" name="state" value={form.state} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className={labelClass}>Postal Code *</label>
                    <input id="postalCode" name="postalCode" value={form.postalCode} onChange={handleChange} className={inputClass} required />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-accent'} text-white`}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Order Summary</h2>
              <div className="space-y-3">
                {items.map(item => {
                  const effectivePrice = item.discount ? item.price * (1 - item.discount) : item.price;
                  return (
                    <div key={item.productId} className={`flex justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(effectivePrice * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
                <hr className={darkMode ? 'border-gray-700' : 'border-gray-300'} />
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Discount (5%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Shipping</span>
                  <span>${SHIPPING_COST.toFixed(2)}</span>
                </div>
                <hr className={darkMode ? 'border-gray-700' : 'border-gray-300'} />
                <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

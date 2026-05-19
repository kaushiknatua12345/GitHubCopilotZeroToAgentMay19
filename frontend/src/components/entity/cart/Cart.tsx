import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

const SHIPPING_COST = 10;
const DISCOUNT_RATE = 0.05;

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const effectivePrice = item.discount
      ? item.price * (1 - item.discount)
      : item.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const discount = subtotal * DISCOUNT_RATE;
  const grandTotal = subtotal - discount + SHIPPING_COST;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto text-center py-20">
          <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Your cart is empty</h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add some products to get started!</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Table */}
          <div className="lg:flex-1">
            <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} overflow-hidden`}>
              {/* Table Header */}
              <div className={`grid grid-cols-[60px_100px_1fr_120px_100px_100px_60px] gap-2 px-4 py-3 ${darkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-gray-100 text-gray-600'} text-sm font-semibold`}>
                <span>S. No.</span>
                <span>Product Image</span>
                <span>Product Name</span>
                <span className="text-center">Unit Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-center">Total</span>
                <span className="text-center">Remove</span>
              </div>

              {/* Cart Items */}
              {items.map((item, index) => {
                const effectivePrice = item.discount
                  ? item.price * (1 - item.discount)
                  : item.price;
                const itemTotal = effectivePrice * item.quantity;

                return (
                  <div
                    key={item.productId}
                    className={`grid grid-cols-[60px_100px_1fr_120px_100px_100px_60px] gap-2 px-4 py-4 items-center ${darkMode ? 'border-t border-gray-700/50' : 'border-t border-gray-200'}`}
                  >
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-center font-medium`}>
                      {index + 1}
                    </span>
                    <div className={`h-20 w-20 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                      <img
                        src={`/${item.imgName}`}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'} font-medium`}>
                      {item.name}
                    </span>
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
                      ${effectivePrice.toFixed(2)}
                    </span>
                    <div className="flex justify-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateQuantity(item.productId, val);
                          }
                        }}
                        className={`w-16 text-center rounded-md border py-1 ${darkMode ? 'bg-gray-800 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                      />
                    </div>
                    <span className={`${darkMode ? 'text-light' : 'text-gray-800'} text-center font-semibold`}>
                      ${itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="flex justify-center text-primary hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              {/* Bottom Actions */}
              <div className={`flex items-center justify-between px-4 py-4 ${darkMode ? 'border-t border-gray-700/50' : 'border-t border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600 text-light placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
                {couponApplied && (
                  <span className="text-primary text-sm font-medium">Coupon applied!</span>
                )}
                <button
                  onClick={() => {
                    // Force re-render to reflect any manual quantity changes
                  }}
                  className="bg-primary hover:bg-accent text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-6`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-6 text-center`}>
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold">Discount(5%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="font-semibold">Shipping</span>
                  <span>${SHIPPING_COST.toFixed(2)}</span>
                </div>
                <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-300'}`} />
                <div className={`flex justify-between text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

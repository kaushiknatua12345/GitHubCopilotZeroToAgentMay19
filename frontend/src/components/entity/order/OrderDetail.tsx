import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../api/config';

interface Order {
  orderId: number;
  branchId: number;
  orderDate: string;
  name: string;
  description: string;
  status: string;
}

interface OrderDetailItem {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  notes: string;
}

interface Product {
  productId: number;
  name: string;
  imgName: string;
  price: number;
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { darkMode } = useTheme();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const id = parseInt(orderId || '0');
  const [updating, setUpdating] = useState(false);

  const { data: order, isLoading } = useQuery(['order', id], async () => {
    const { data } = await axios.get<Order>(`${api.baseURL}${api.endpoints.orders}/${id}`);
    return data;
  });

  const { data: allDetails } = useQuery('orderDetails', async () => {
    const { data } = await axios.get<OrderDetailItem[]>(`${api.baseURL}${api.endpoints.orderDetails}`);
    return data;
  });

  const { data: products } = useQuery('products', async () => {
    const { data } = await axios.get<Product[]>(`${api.baseURL}${api.endpoints.products}`);
    return data;
  });

  const details = allDetails?.filter(d => d.orderId === id) || [];
  const productMap = new Map(products?.map(p => [p.productId, p]) || []);
  const total = details.reduce((sum, d) => sum + d.unitPrice * d.quantity, 0);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await axios.put(`${api.baseURL}${api.endpoints.orders}/${id}`, {
        ...order,
        status: newStatus,
      });
      queryClient.invalidateQueries(['order', id]);
      queryClient.invalidateQueries('orders');
    } catch {
      // silent fail for demo
    }
    setUpdating(false);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-4xl mx-auto flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Order not found</h2>
          <Link to="/orders" className="mt-4 inline-block text-primary hover:text-accent">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <Link to="/orders" className={`inline-flex items-center gap-1 mb-6 ${darkMode ? 'text-gray-400 hover:text-light' : 'text-gray-600 hover:text-gray-800'} transition-colors`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Order #{order.orderId}</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(order.orderDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </span>
        </div>

        {/* Progress Stepper */}
        {!isCancelled && (
          <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-6 mb-6`}>
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStepIndex ? 'bg-primary text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                      {i <= currentStepIndex ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-1 capitalize ${i <= currentStepIndex ? 'text-primary font-medium' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{step}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${i < currentStepIndex ? 'bg-primary' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            This order has been cancelled.
          </div>
        )}

        {/* Admin Status Control */}
        {isAdmin && (
          <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-4 mb-6`}>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Admin: Update Status</span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-600 text-light' : 'bg-white border-gray-300 text-gray-800'} focus:border-primary focus:outline-none`}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {updating && <span className="text-sm text-primary">Updating...</span>}
            </div>
          </div>
        )}

        {/* Line Items */}
        <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-6`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Items</h2>
          <div className="space-y-3">
            {details.map(detail => {
              const product = productMap.get(detail.productId);
              return (
                <div key={detail.orderDetailId} className={`flex items-center justify-between py-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'} last:border-0`}>
                  <div className="flex items-center gap-3">
                    {product && (
                      <div className={`h-14 w-14 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                        <img src={`/${product.imgName}`} alt={product.name} className="h-full w-full object-contain p-1" />
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>{product?.name || `Product #${detail.productId}`}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {detail.quantity} &times; ${detail.unitPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${(detail.unitPrice * detail.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 pt-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} flex justify-between`}>
            <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Total</span>
            <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

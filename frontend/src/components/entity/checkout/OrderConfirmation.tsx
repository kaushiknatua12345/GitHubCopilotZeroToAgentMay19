import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useTheme } from '../../../context/ThemeContext';
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
}

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { darkMode } = useTheme();
  const id = parseInt(orderId || '0');

  const { data: order, isLoading: orderLoading } = useQuery(['order', id], async () => {
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

  if (orderLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-3xl mx-auto flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Order not found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:text-accent">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Order Confirmed!</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Thank you for your order. Your order ID is <span className="text-primary font-semibold">#{order.orderId}</span>
          </p>
        </div>

        <div className={`rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900' : 'border-gray-300 bg-white'} p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Order Details</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {order.status}
            </span>
          </div>

          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-3">
            {details.map(detail => {
              const product = productMap.get(detail.productId);
              return (
                <div key={detail.orderDetailId} className={`flex items-center justify-between py-2 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'} last:border-0`}>
                  <div className="flex items-center gap-3">
                    {product && (
                      <div className={`h-12 w-12 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                        <img src={`/${product.imgName}`} alt={product.name} className="h-full w-full object-contain p-1" />
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>{product?.name || `Product #${detail.productId}`}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {detail.quantity} x ${detail.unitPrice.toFixed(2)}</p>
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
            <span className={`text-lg font-bold text-primary`}>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/products"
            className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

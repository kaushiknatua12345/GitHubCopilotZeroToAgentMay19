import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
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

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistory() {
  const { darkMode } = useTheme();
  const { isLoggedIn } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery('orders', async () => {
    const { data } = await axios.get<Order[]>(`${api.baseURL}${api.endpoints.orders}`);
    return data;
  });

  const { data: allDetails } = useQuery('orderDetails', async () => {
    const { data } = await axios.get<OrderDetailItem[]>(`${api.baseURL}${api.endpoints.orderDetails}`);
    return data;
  });

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>Please log in to view your orders</h1>
          <Link to="/login" className="mt-4 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-5xl mx-auto flex justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const sortedOrders = [...(orders || [])].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  const getOrderTotal = (orderId: number) => {
    const details = allDetails?.filter(d => d.orderId === orderId) || [];
    return details.reduce((sum, d) => sum + d.unitPrice * d.quantity, 0);
  };

  const getItemCount = (orderId: number) => {
    return allDetails?.filter(d => d.orderId === orderId).length || 0;
  };

  if (sortedOrders.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4`}>
        <div className="max-w-5xl mx-auto text-center py-20">
          <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h1 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>No orders yet</h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start shopping to see your orders here!</p>
          <Link to="/products" className="mt-6 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8`}>Order History</h1>

        <div className="space-y-4">
          {sortedOrders.map(order => (
            <Link
              key={order.orderId}
              to={`/orders/${order.orderId}`}
              className={`block rounded-xl border ${darkMode ? 'border-primary/40 bg-gray-900 hover:bg-gray-800' : 'border-gray-300 bg-white hover:bg-gray-50'} p-6 transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    Order #{order.orderId}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {order.name} &middot; {getItemCount(order.orderId)} item(s)
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                  <span className={`text-lg font-bold text-primary`}>
                    ${getOrderTotal(order.orderId).toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

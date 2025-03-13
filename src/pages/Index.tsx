
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import ChartCard from '@/components/ChartCard';
import OrderLink from '@/components/OrderLink';
import PeriodFilter from '@/components/PeriodFilter';
import { PeriodFilter as PeriodFilterType, Order } from '@/lib/types';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock data - would be replaced with real data from an API or store
const generateMockData = (): Order[] => {
  const now = new Date();
  const orders: Order[] = [];
  
  // Generate 20 sample orders for the last 30 days
  for (let i = 1; i <= 20; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const productPrice = 100 + Math.floor(Math.random() * 900);
    const shippingCost = 10 + Math.floor(Math.random() * 40);
    const productCost = 50 + Math.floor(Math.random() * 200);
    const sellingPrice = productPrice + Math.floor(Math.random() * 200);
    
    orders.push({
      id: `order-${i}`,
      customerName: `Customer ${i}`,
      email: `customer${i}@example.com`,
      cpf: `${100000000 + i}`,
      zipCode: `${10000 + i}`,
      address: `Street ${i}`,
      addressNumber: `${i}`,
      addressComplement: i % 3 === 0 ? `Apt ${i}` : undefined,
      productPrice,
      productBrand: `Brand ${i % 5 + 1}`,
      shippingCost,
      date,
      productCost,
      sellingPrice,
      calculatedProfit: sellingPrice - productCost - shippingCost
    });
  }
  
  return orders;
};

const Index = () => {
  const [period, setPeriod] = useState<PeriodFilterType>('last30days');
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch data from an API based on the selected period
    // For now, we'll use mock data
    setOrders(generateMockData());
  }, [period]);
  
  // Calculate metrics based on orders
  const totalRevenue = orders.reduce((sum, order) => 
    order.sellingPrice ? sum + order.sellingPrice : sum + order.productPrice, 0);
  
  const totalProfit = orders.reduce((sum, order) => 
    order.calculatedProfit ? sum + order.calculatedProfit : sum, 0);
  
  const pendingOrders = orders.filter(order => !order.calculatedProfit).length;
  
  // Generate daily revenue data for chart
  const getDailyData = () => {
    const dailyMap = new Map();
    const today = new Date();
    
    // Initialize with zeros for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyMap.set(dateString, { date: dateString, revenue: 0, profit: 0 });
    }
    
    // Fill in actual data
    orders.forEach(order => {
      const dateString = new Date(order.date).toISOString().split('T')[0];
      if (dailyMap.has(dateString)) {
        const current = dailyMap.get(dateString);
        dailyMap.set(dateString, {
          date: dateString,
          revenue: current.revenue + (order.sellingPrice || order.productPrice),
          profit: current.profit + (order.calculatedProfit || 0)
        });
      }
    });
    
    return Array.from(dailyMap.values());
  };
  
  const getMonthlyData = () => {
    const monthlyMap = new Map();
    
    orders.forEach(order => {
      const date = new Date(order.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyMap.has(monthYear)) {
        monthlyMap.set(monthYear, {
          name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
          revenue: 0,
          orders: 0
        });
      }
      
      const current = monthlyMap.get(monthYear);
      monthlyMap.set(monthYear, {
        ...current,
        revenue: current.revenue + (order.sellingPrice || order.productPrice),
        orders: current.orders + 1
      });
    });
    
    return Array.from(monthlyMap.values());
  };
  
  const dailyData = getDailyData();
  const monthlyData = getMonthlyData();
  
  const metrics = [
    {
      label: 'Total Revenue',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      change: 12.5, // Sample change percentage
      icon: <DollarSign className="text-montelucce-yellow" size={24} />
    },
    {
      label: 'Total Orders',
      value: orders.length,
      change: 8.3, // Sample change percentage
      icon: <Package className="text-montelucce-yellow" size={24} />
    },
    {
      label: 'Total Profit',
      value: `R$ ${totalProfit.toFixed(2)}`,
      change: 15.2, // Sample change percentage
      icon: <TrendingUp className="text-montelucce-yellow" size={24} />
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      change: -5.7, // Sample change percentage (negative is good for pending orders)
      icon: <Clock className="text-montelucce-yellow" size={24} />
    }
  ];
  
  return (
    <Layout>
      <div className="mb-6">
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <DashboardCard title={metric.label}>
              <div className="flex justify-between items-center">
                <div className="p-3 rounded-full bg-montelucce-yellow/10">{metric.icon}</div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-montelucce-light-gray">{metric.value}</p>
                  <div className={`flex items-center justify-end text-sm ${
                    (metric.label === 'Pending Orders' && metric.change < 0) || 
                    (metric.label !== 'Pending Orders' && metric.change > 0)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {(metric.label === 'Pending Orders' && metric.change < 0) || 
                     (metric.label !== 'Pending Orders' && metric.change > 0)
                      ? <ArrowUpRight size={14} />
                      : <ArrowDownRight size={14} />
                    }
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard 
          title="Weekly Revenue" 
          className="lg:col-span-2"
          height={300}
        >
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 184, 0, 0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#8E9196' }} 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
            />
            <YAxis 
              tick={{ fill: '#8E9196' }} 
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#121212', 
                borderColor: 'rgba(245, 184, 0, 0.2)',
                color: '#F6F6F7' 
              }}
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, undefined]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue"
              stroke="#F5B800" 
              activeDot={{ r: 8 }}
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Profit"
              stroke="#4CAF50" 
              strokeWidth={2} 
            />
          </LineChart>
        </ChartCard>
        
        <ChartCard title="Order Link Generator">
          <OrderLink />
        </ChartCard>
      </div>
      
      <div className="mb-8">
        <ChartCard title="Monthly Performance">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 184, 0, 0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#8E9196' }} />
            <YAxis yAxisId="left" orientation="left" tick={{ fill: '#8E9196' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#8E9196' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#121212', 
                borderColor: 'rgba(245, 184, 0, 0.2)',
                color: '#F6F6F7' 
              }}
              formatter={(value, name) => [
                name === 'revenue' ? `R$ ${Number(value).toFixed(2)}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#F5B800" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#9F9EA1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </Layout>
  );
};

export default Index;

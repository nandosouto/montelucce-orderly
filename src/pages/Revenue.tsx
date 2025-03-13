
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import ChartCard from '@/components/ChartCard';
import PeriodFilter from '@/components/PeriodFilter';
import { PeriodFilter as PeriodFilterType, Order } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

// Mock data generator function (same as in previous files)
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
      productCost: i % 4 === 0 ? undefined : productCost,
      sellingPrice: i % 4 === 0 ? undefined : sellingPrice,
      calculatedProfit: i % 4 === 0 ? undefined : sellingPrice - productCost - shippingCost
    });
  }
  
  return orders;
};

const Revenue = () => {
  const [period, setPeriod] = useState<PeriodFilterType>('last30days');
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch data from an API based on the selected period
    // For now, we'll use mock data
    setOrders(generateMockData());
  }, [period]);
  
  // Filter orders based on selected period
  const filterOrdersByPeriod = (orders: Order[], period: PeriodFilterType): Order[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.date) >= startDate && new Date(order.date) <= today
        );
      case 'yesterday':
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        return orders.filter(order => 
          new Date(order.date) >= yesterday && new Date(order.date) <= endOfYesterday
        );
      case 'last7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.date) >= startDate && new Date(order.date) <= today
        );
      case 'last30days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.date) >= startDate && new Date(order.date) <= today
        );
      case 'last3months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.date) >= startDate && new Date(order.date) <= today
        );
      case 'last6months':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.date) >= startDate && new Date(order.date) <= today
        );
      case 'lastyear':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.date) >= startDate && new Date(order.date) <= today
        );
      default:
        return orders;
    }
  };
  
  const filteredOrders = filterOrdersByPeriod(orders, period);
  const calculatedOrders = filteredOrders.filter(order => order.calculatedProfit !== undefined);
  
  // Calculate revenue metrics
  const totalRevenue = calculatedOrders.reduce((sum, order) => sum + order.sellingPrice!, 0);
  const totalProfit = calculatedOrders.reduce((sum, order) => sum + order.calculatedProfit!, 0);
  const totalCost = calculatedOrders.reduce((sum, order) => sum + order.productCost! + order.shippingCost, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Group orders by date for daily revenue chart
  const getDailyRevenueData = () => {
    const dailyMap = new Map();
    
    calculatedOrders.forEach(order => {
      const dateStr = new Date(order.date).toISOString().split('T')[0];
      
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, {
          date: dateStr,
          revenue: 0,
          profit: 0,
          cost: 0
        });
      }
      
      const dayData = dailyMap.get(dateStr);
      dailyMap.set(dateStr, {
        ...dayData,
        revenue: dayData.revenue + order.sellingPrice!,
        profit: dayData.profit + order.calculatedProfit!,
        cost: dayData.cost + order.productCost! + order.shippingCost
      });
    });
    
    return Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  
  // Group orders by product brand for pie chart
  const getProductBrandData = () => {
    const brandMap = new Map();
    
    calculatedOrders.forEach(order => {
      if (!brandMap.has(order.productBrand)) {
        brandMap.set(order.productBrand, {
          name: order.productBrand,
          value: 0,
          count: 0
        });
      }
      
      const brandData = brandMap.get(order.productBrand);
      brandMap.set(order.productBrand, {
        ...brandData,
        value: brandData.value + order.sellingPrice!,
        count: brandData.count + 1
      });
    });
    
    return Array.from(brandMap.values());
  };
  
  const dailyRevenueData = getDailyRevenueData();
  const productBrandData = getProductBrandData();
  
  // Calculate cumulative data for trend analysis
  const getCumulativeData = () => {
    let cumulativeRevenue = 0;
    let cumulativeProfit = 0;
    
    return dailyRevenueData.map(day => {
      cumulativeRevenue += day.revenue;
      cumulativeProfit += day.profit;
      
      return {
        date: day.date,
        cumulativeRevenue,
        cumulativeProfit
      };
    });
  };
  
  const cumulativeData = getCumulativeData();
  
  // Colors for the pie chart
  const COLORS = ['#F5B800', '#8E9196', '#9F9EA1', '#C8C8C9', '#F6F6F7'];
  
  return (
    <Layout>
      <div className="mb-6">
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardCard title="Total Revenue">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-montelucce-yellow/10">
                <DollarSign size={24} className="text-montelucce-yellow" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-montelucce-light-gray">
                  R$ {totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-montelucce-gray">
                  For {calculatedOrders.length} orders
                </p>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <DashboardCard title="Total Profit">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-montelucce-yellow/10">
                <TrendingUp size={24} className="text-montelucce-yellow" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-montelucce-light-gray">
                  R$ {totalProfit.toFixed(2)}
                </p>
                <p className="text-sm text-montelucce-gray">
                  Total profit
                </p>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <DashboardCard title="Profit Margin">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-montelucce-yellow/10">
                <Percent size={24} className="text-montelucce-yellow" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-montelucce-light-gray">
                  {profitMargin.toFixed(2)}%
                </p>
                <p className="text-sm text-montelucce-gray">
                  Average margin
                </p>
              </div>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Revenue Breakdown" className="lg:col-span-2" height={300}>
          <BarChart data={dailyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 184, 0, 0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#8E9196' }} 
              tickFormatter={(value) => value.split('-').slice(1).join('/')}
            />
            <YAxis tick={{ fill: '#8E9196' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#121212', 
                borderColor: 'rgba(245, 184, 0, 0.2)',
                color: '#F6F6F7' 
              }}
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, undefined]}
            />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" stackId="a" fill="#F5B800" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" name="Cost" stackId="a" fill="#9F9EA1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Profit" fill="#4CAF50" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        
        <ChartCard title="Revenue by Product">
          <PieChart>
            <Pie
              data={productBrandData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#F5B800"
              dataKey="value"
              nameKey="name"
              label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {productBrandData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#121212', 
                borderColor: 'rgba(245, 184, 0, 0.2)',
                color: '#F6F6F7' 
              }}
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, undefined]}
            />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>
      
      <div className="mb-8">
        <ChartCard title="Revenue Trend" height={300}>
          <LineChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 184, 0, 0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#8E9196' }} 
              tickFormatter={(value) => value.split('-').slice(1).join('/')}
            />
            <YAxis tick={{ fill: '#8E9196' }} />
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
              dataKey="cumulativeRevenue" 
              name="Cumulative Revenue"
              stroke="#F5B800" 
              strokeWidth={2} 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeProfit" 
              name="Cumulative Profit"
              stroke="#4CAF50" 
              strokeWidth={2} 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardCard title="Revenue Summary">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-montelucce-gray">Total Orders:</span>
              <span className="text-montelucce-light-gray">{calculatedOrders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-montelucce-gray">Total Revenue:</span>
              <span className="text-montelucce-light-gray">R$ {totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-montelucce-gray">Total Cost:</span>
              <span className="text-montelucce-light-gray">R$ {totalCost.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-montelucce-yellow/10 flex justify-between items-center">
              <span className="text-montelucce-gray">Total Profit:</span>
              <span className="text-montelucce-yellow font-semibold">R$ {totalProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-montelucce-gray">Average Profit per Order:</span>
              <span className="text-montelucce-light-gray">
                R$ {(calculatedOrders.length > 0 ? totalProfit / calculatedOrders.length : 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-montelucce-gray">Profit Margin:</span>
              <span className="text-montelucce-light-gray">{profitMargin.toFixed(2)}%</span>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Top Products">
          <div className="space-y-4">
            {productBrandData.slice(0, 5).map((product, index) => (
              <div key={product.name} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-montelucce-light-gray">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-montelucce-light-gray">R$ {product.value.toFixed(2)}</p>
                  <p className="text-xs text-montelucce-gray">{product.count} orders</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </Layout>
  );
};

export default Revenue;

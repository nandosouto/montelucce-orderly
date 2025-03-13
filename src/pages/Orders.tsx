
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import OrderTable from '@/components/OrderTable';
import ExportButton from '@/components/ExportButton';
import PeriodFilter from '@/components/PeriodFilter';
import { PeriodFilter as PeriodFilterType, Order } from '@/lib/types';
import { motion } from 'framer-motion';

// Mock data generator function (same as in Index.tsx)
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

const Orders = () => {
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
  
  // Calculate summary stats
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => 
    order.sellingPrice ? sum + order.sellingPrice : sum + order.productPrice, 0);
  const calculatedOrders = filteredOrders.filter(order => order.calculatedProfit !== undefined).length;
  const pendingCalculation = totalOrders - calculatedOrders;
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PeriodFilter value={period} onChange={setPeriod} />
        <ExportButton orders={filteredOrders} selectedPeriod={period} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardCard title="Total Orders">
            <div className="flex justify-center items-center h-16">
              <span className="text-3xl font-semibold text-montelucce-light-gray">{totalOrders}</span>
            </div>
          </DashboardCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <DashboardCard title="Total Revenue">
            <div className="flex justify-center items-center h-16">
              <span className="text-3xl font-semibold text-montelucce-light-gray">
                R$ {totalRevenue.toFixed(2)}
              </span>
            </div>
          </DashboardCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <DashboardCard title="Pending Calculation">
            <div className="flex justify-center items-center h-16">
              <span className="text-3xl font-semibold text-montelucce-light-gray">
                {pendingCalculation}
              </span>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
      
      <DashboardCard title="Orders">
        <OrderTable orders={filteredOrders} />
      </DashboardCard>
    </Layout>
  );
};

export default Orders;

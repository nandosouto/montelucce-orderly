
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import OrderTable from '@/components/OrderTable';
import { Order } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Tag, Truck } from 'lucide-react';

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

const Calculator = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productCost, setProductCost] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);
  
  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For now, we'll use mock data
    setOrders(generateMockData());
  }, []);
  
  // Reset form when a new order is selected
  useEffect(() => {
    if (selectedOrder) {
      setProductCost(selectedOrder.productCost?.toString() || '');
      setSellingPrice(selectedOrder.sellingPrice?.toString() || selectedOrder.productPrice.toString());
      
      if (selectedOrder.productCost && selectedOrder.sellingPrice) {
        const profit = selectedOrder.sellingPrice - selectedOrder.productCost - selectedOrder.shippingCost;
        setCalculatedProfit(profit);
      } else {
        setCalculatedProfit(null);
      }
    } else {
      setProductCost('');
      setSellingPrice('');
      setCalculatedProfit(null);
    }
  }, [selectedOrder]);
  
  // Calculate profit when inputs change
  useEffect(() => {
    if (selectedOrder && productCost && sellingPrice) {
      const cost = parseFloat(productCost);
      const price = parseFloat(sellingPrice);
      
      if (!isNaN(cost) && !isNaN(price)) {
        const profit = price - cost - selectedOrder.shippingCost;
        setCalculatedProfit(profit);
      } else {
        setCalculatedProfit(null);
      }
    } else {
      setCalculatedProfit(null);
    }
  }, [productCost, sellingPrice, selectedOrder]);
  
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const handleCalculate = () => {
    if (!selectedOrder) {
      toast.error('Please select an order first');
      return;
    }
    
    if (!productCost || !sellingPrice) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const cost = parseFloat(productCost);
    const price = parseFloat(sellingPrice);
    
    if (isNaN(cost) || isNaN(price)) {
      toast.error('Please enter valid numbers');
      return;
    }
    
    // Calculate profit
    const profit = price - cost - selectedOrder.shippingCost;
    
    // Update the selected order in our orders array
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          productCost: cost,
          sellingPrice: price,
          calculatedProfit: profit
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setSelectedOrder(prev => prev ? { ...prev, productCost: cost, sellingPrice: price, calculatedProfit: profit } : null);
    setCalculatedProfit(profit);
    
    toast.success('Profit calculated successfully');
  };
  
  const handleReset = () => {
    setSelectedOrder(null);
    setProductCost('');
    setSellingPrice('');
    setCalculatedProfit(null);
  };
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Select Order">
            <OrderTable orders={orders} onSelectOrder={handleSelectOrder} />
          </DashboardCard>
        </div>
        
        <div className="space-y-6">
          <DashboardCard title="Calculator">
            {selectedOrder ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-montelucce-yellow/5 p-4 rounded-lg border border-montelucce-yellow/10">
                  <h3 className="font-medium text-montelucce-light-gray mb-2">Order Details</h3>
                  <p className="text-sm text-montelucce-gray">
                    <span className="block">Customer: {selectedOrder.customerName}</span>
                    <span className="block">Product: {selectedOrder.productBrand}</span>
                    <span className="block">
                      Shipping Cost: R$ {selectedOrder.shippingCost.toFixed(2)}
                    </span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-montelucce-light-gray flex items-center gap-2">
                      <Tag size={16} className="text-montelucce-yellow" />
                      Product Cost (R$)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter product cost"
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                      className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-montelucce-light-gray flex items-center gap-2">
                      <DollarSign size={16} className="text-montelucce-yellow" />
                      Selling Price (R$)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter selling price"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-montelucce-light-gray flex items-center gap-2">
                      <Truck size={16} className="text-montelucce-yellow" />
                      Shipping Cost (R$)
                    </label>
                    <Input
                      type="number"
                      value={selectedOrder.shippingCost.toFixed(2)}
                      readOnly
                      disabled
                      className="bg-montelucce-black/50 border-montelucce-yellow/20 text-montelucce-gray"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-montelucce-yellow/10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-montelucce-yellow" />
                      <span className="font-medium text-montelucce-light-gray">
                        Profit:
                      </span>
                    </div>
                    <span className={`text-xl font-semibold ${
                      calculatedProfit === null
                        ? 'text-montelucce-gray'
                        : calculatedProfit >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                    }`}>
                      {calculatedProfit === null
                        ? '—'
                        : `R$ ${calculatedProfit.toFixed(2)}`}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleCalculate}
                    className="flex-1 bg-montelucce-yellow text-montelucce-black hover:bg-montelucce-yellow/90"
                  >
                    Calculate
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-montelucce-yellow/20 text-montelucce-light-gray hover:text-montelucce-yellow"
                  >
                    Reset
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-montelucce-gray mb-4">
                  Select an order from the table to calculate profit
                </p>
              </div>
            )}
          </DashboardCard>
          
          {selectedOrder && calculatedProfit !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardCard title="Margin Analysis">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Product Cost:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {parseFloat(productCost).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Shipping Cost:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {selectedOrder.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Total Cost:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {(parseFloat(productCost) + selectedOrder.shippingCost).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-montelucce-yellow/10 pt-4 flex justify-between items-center">
                    <span className="text-montelucce-gray">Selling Price:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {parseFloat(sellingPrice).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Profit:</span>
                    <span className={calculatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                      R$ {calculatedProfit.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Margin:</span>
                    <span className={calculatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {parseFloat(sellingPrice) > 0
                        ? `${((calculatedProfit / parseFloat(sellingPrice)) * 100).toFixed(2)}%`
                        : '0.00%'}
                    </span>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Calculator;

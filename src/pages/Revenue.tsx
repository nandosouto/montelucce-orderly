
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { DashboardCard } from '@/components/DashboardCard';
import ChartCard from '@/components/ChartCard';
import OrderTable from '@/components/OrderTable';
import PeriodFilter from '@/components/PeriodFilter';
import ExportButton from '@/components/ExportButton';
import { PeriodFilter as PeriodFilterType, Order } from '@/lib/types';
import { ptBR } from 'date-fns/locale';
import { format, subDays, subMonths } from 'date-fns';

// Função para gerar dados de pedidos aleatórios para demonstração
const generateSampleOrders = (): Order[] => {
  const brands = ['Montelucce', 'Malbec', 'Piccolo Mondo', 'Chianti'];
  const names = ['João Silva', 'Maria Oliveira', 'Carlos Santos', 'Ana Pereira', 'Pedro Costa'];
  
  // Gera 20 pedidos de amostra
  return Array.from({ length: 20 }, (_, i) => {
    const date = subDays(new Date(), Math.floor(Math.random() * 180)); // Entre hoje e 180 dias atrás
    const productPrice = 50 + Math.floor(Math.random() * 200);
    const shippingCost = 15 + Math.floor(Math.random() * 25);
    const productCost = productPrice * 0.6; // Custo é 60% do preço
    const sellingPrice = productPrice + shippingCost;
    const calculatedProfit = sellingPrice - productCost - shippingCost;
    
    return {
      id: `order-${i + 1}`,
      customerName: names[Math.floor(Math.random() * names.length)],
      email: `cliente${i + 1}@exemplo.com`,
      cpf: `${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 99)}`,
      address: `Rua Exemplo, ${i + 1}`,
      addressNumber: `${Math.floor(Math.random() * 1000)}`,
      addressComplement: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 100)}` : '',
      zipCode: `${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 1000)}`,
      productBrand: brands[Math.floor(Math.random() * brands.length)],
      productPrice,
      shippingCost,
      date: date.toISOString(),
      productCost,
      sellingPrice,
      calculatedProfit
    };
  });
};

const Revenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilterType>('last30days');
  const orders = generateSampleOrders();
  
  // Filtra pedidos com base no período selecionado
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    const today = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return format(orderDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      case 'yesterday':
        const yesterday = subDays(today, 1);
        return format(orderDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd');
      case 'last7days':
        const last7days = subDays(today, 7);
        return orderDate >= last7days;
      case 'last30days':
        const last30days = subDays(today, 30);
        return orderDate >= last30days;
      case 'last3months':
        const last3months = subMonths(today, 3);
        return orderDate >= last3months;
      case 'last6months':
        const last6months = subMonths(today, 6);
        return orderDate >= last6months;
      case 'lastyear':
        const lastYear = subMonths(today, 12);
        return orderDate >= lastYear;
      default:
        return true;
    }
  });
  
  // Calcula métricas para os cards
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.sellingPrice || 0), 0);
  const totalProfit = filteredOrders.reduce((sum, order) => sum + (order.calculatedProfit || 0), 0);
  const averageTicket = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  
  // Dados para o gráfico
  const chartData = filteredOrders.reduce((acc, order) => {
    const date = format(new Date(order.date), 'dd/MM', { locale: ptBR });
    
    if (!acc[date]) {
      acc[date] = {
        name: date,
        receita: 0,
        lucro: 0
      };
    }
    
    acc[date].receita += order.sellingPrice || 0;
    acc[date].lucro += order.calculatedProfit || 0;
    
    return acc;
  }, {} as Record<string, { name: string; receita: number; lucro: number }>);
  
  const chartDataArray = Object.values(chartData).sort((a, b) => {
    const dateA = a.name.split('/').reverse().join('');
    const dateB = b.name.split('/').reverse().join('');
    return dateA.localeCompare(dateB);
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-montelucce-yellow">Receita</h1>
            <div className="flex gap-2">
              <ExportButton 
                orders={filteredOrders} 
                selectedPeriod={selectedPeriod} 
              />
            </div>
          </div>
          
          <PeriodFilter value={selectedPeriod} onChange={setSelectedPeriod} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard 
              title="Receita Total" 
              value={`R$ ${totalRevenue.toFixed(2)}`}
              icon="dollar-sign"
              trend={5.8}
              trendLabel="vs. período anterior"
            />
            <DashboardCard 
              title="Lucro Total" 
              value={`R$ ${totalProfit.toFixed(2)}`}
              icon="trending-up"
              trend={3.1}
              trendLabel="vs. período anterior"
            />
            <DashboardCard 
              title="Ticket Médio" 
              value={`R$ ${averageTicket.toFixed(2)}`}
              icon="shopping-cart"
              trend={-1.2}
              trendLabel="vs. período anterior"
            />
          </div>
          
          <ChartCard 
            title="Visão Geral"
            data={chartDataArray}
            lines={[
              { key: 'receita', name: 'Receita', color: '#E5A541' },
              { key: 'lucro', name: 'Lucro', color: '#299D91' }
            ]}
          />
          
          <div className="bg-montelucce-black rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-montelucce-yellow mb-4">Pedidos Recentes</h2>
            <OrderTable orders={filteredOrders} />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Revenue;

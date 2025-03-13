
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
import ExportButton from '@/components/ExportButton';

// Mock data - substituiria por dados reais da API ou banco de dados
const generateMockData = (): Order[] => {
  const now = new Date();
  const orders: Order[] = [];
  
  // Gerar 20 pedidos de exemplo para os últimos 30 dias
  for (let i = 1; i <= 20; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const produtoPreco = 100 + Math.floor(Math.random() * 900);
    const custoEnvio = 10 + Math.floor(Math.random() * 40);
    const custoProduto = 50 + Math.floor(Math.random() * 200);
    const precoVenda = produtoPreco + Math.floor(Math.random() * 200);
    
    orders.push({
      id: `pedido-${i}`,
      nome_cliente: `Cliente ${i}`,
      email: `cliente${i}@exemplo.com`,
      cpf: `${100000000 + i}`,
      cep: `${10000 + i}`,
      endereco: `Rua ${i}`,
      numero: `${i}`,
      complemento: i % 3 === 0 ? `Apto ${i}` : undefined,
      preco_produto: produtoPreco,
      marca_produto: `Marca ${i % 5 + 1}`,
      custo_envio: custoEnvio,
      data_pedido: date,
      custo_produto: custoProduto,
      preco_venda: precoVenda,
      lucro_calculado: precoVenda - custoProduto - custoEnvio
    });
  }
  
  return orders;
};

const Index = () => {
  const [period, setPeriod] = useState<PeriodFilterType>('ultimos30dias');
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Em um app real, buscaríamos dados de uma API com base no período selecionado
    // Por enquanto, usaremos dados de exemplo
    setOrders(generateMockData());
  }, [period]);
  
  // Calcular métricas com base nos pedidos
  const totalRevenue = orders.reduce((sum, order) => 
    order.preco_venda ? sum + order.preco_venda : sum + order.preco_produto, 0);
  
  const totalProfit = orders.reduce((sum, order) => 
    order.lucro_calculado ? sum + order.lucro_calculado : sum, 0);
  
  const pendingOrders = orders.filter(order => !order.lucro_calculado).length;
  
  // Gerar dados diários de receita para o gráfico
  const getDailyData = () => {
    const dailyMap = new Map();
    const today = new Date();
    
    // Inicializar com zeros para os últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyMap.set(dateString, { 
        date: dateString, 
        revenue: 0, 
        profit: 0,
        faturamento: 0, 
        lucro: 0
      });
    }
    
    // Preencher com dados reais
    orders.forEach(order => {
      const dateString = new Date(order.data_pedido).toISOString().split('T')[0];
      if (dailyMap.has(dateString)) {
        const current = dailyMap.get(dateString);
        const faturamento = order.preco_venda || order.preco_produto;
        const lucro = order.lucro_calculado || 0;
        
        dailyMap.set(dateString, {
          date: dateString,
          revenue: current.revenue + faturamento,
          profit: current.profit + lucro,
          faturamento: current.faturamento + faturamento,
          lucro: current.lucro + lucro
        });
      }
    });
    
    return Array.from(dailyMap.values());
  };
  
  const getMonthlyData = () => {
    const monthlyMap = new Map();
    
    orders.forEach(order => {
      const date = new Date(order.data_pedido);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyMap.has(monthYear)) {
        monthlyMap.set(monthYear, {
          name: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
          revenue: 0,
          orders: 0,
          faturamento: 0,
          lucro: 0
        });
      }
      
      const current = monthlyMap.get(monthYear);
      const faturamento = order.preco_venda || order.preco_produto;
      const lucro = order.lucro_calculado || 0;
      
      monthlyMap.set(monthYear, {
        ...current,
        revenue: current.revenue + faturamento,
        faturamento: current.faturamento + faturamento,
        lucro: current.lucro + lucro,
        orders: current.orders + 1
      });
    });
    
    return Array.from(monthlyMap.values());
  };
  
  const dailyData = getDailyData();
  const monthlyData = getMonthlyData();
  
  const metrics = [
    {
      label: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      change: 12.5, // Exemplo de percentual de mudança
      icon: <DollarSign className="text-montelucce-yellow" size={24} />
    },
    {
      label: 'Total de Pedidos',
      value: orders.length,
      change: 8.3, // Exemplo de percentual de mudança
      icon: <Package className="text-montelucce-yellow" size={24} />
    },
    {
      label: 'Lucro Total',
      value: `R$ ${totalProfit.toFixed(2)}`,
      change: 15.2, // Exemplo de percentual de mudança
      icon: <TrendingUp className="text-montelucce-yellow" size={24} />
    },
    {
      label: 'Pedidos Pendentes',
      value: pendingOrders,
      change: -5.7, // Exemplo de percentual de mudança (negativo é bom para pedidos pendentes)
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
                    (metric.label === 'Pedidos Pendentes' && metric.change < 0) || 
                    (metric.label !== 'Pedidos Pendentes' && metric.change > 0)
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {(metric.label === 'Pedidos Pendentes' && metric.change < 0) || 
                     (metric.label !== 'Pedidos Pendentes' && metric.change > 0)
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
          title="Receita Semanal" 
          className="lg:col-span-2"
          height={300}
          action={<ExportButton orders={orders} selectedPeriod={period} />}
        >
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(245, 184, 0, 0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#8E9196' }} 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { weekday: 'short' })}
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
              dataKey="faturamento" 
              name="Faturamento"
              stroke="#F5B800" 
              activeDot={{ r: 8 }}
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="lucro" 
              name="Lucro"
              stroke="#4CAF50" 
              strokeWidth={2} 
            />
          </LineChart>
        </ChartCard>
        
        <ChartCard title="Gerador de Link de Pedido">
          <OrderLink />
        </ChartCard>
      </div>
      
      <div className="mb-8">
        <ChartCard 
          title="Desempenho Mensal"
          action={<ExportButton orders={orders} selectedPeriod={period} />}
        >
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
              formatter={(value, name) => {
                if (name === 'faturamento' || name === 'lucro') {
                  return [`R$ ${Number(value).toFixed(2)}`, name === 'faturamento' ? 'Faturamento' : 'Lucro'];
                }
                return [value, name === 'orders' ? 'Pedidos' : name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="faturamento" name="Faturamento" fill="#F5B800" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="lucro" name="Lucro" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="orders" name="Pedidos" fill="#9F9EA1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </Layout>
  );
};

export default Index;

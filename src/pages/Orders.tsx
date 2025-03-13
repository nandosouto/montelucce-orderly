
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import OrderTable from '@/components/OrderTable';
import ExportButton from '@/components/ExportButton';
import PeriodFilter from '@/components/PeriodFilter';
import { PeriodFilter as PeriodFilterType, Order } from '@/lib/types';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Orders = () => {
  const [period, setPeriod] = useState<PeriodFilterType>('ultimos30dias');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .order('data_pedido', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Convertemos os dados do Supabase para o formato esperado pelo nosso componente
        if (data) {
          const formattedOrders: Order[] = data.map(order => ({
            id: order.id,
            nome_cliente: order.nome_cliente,
            email: order.email,
            cpf: order.cpf,
            cep: order.cep,
            endereco: order.endereco,
            numero: order.numero,
            complemento: order.complemento,
            preco_produto: Number(order.preco_produto),
            marca_produto: order.marca_produto,
            custo_envio: Number(order.custo_envio),
            data_pedido: new Date(order.data_pedido),
            custo_produto: order.custo_produto ? Number(order.custo_produto) : undefined,
            preco_venda: order.preco_venda ? Number(order.preco_venda) : undefined,
            lucro_calculado: order.lucro_calculado ? Number(order.lucro_calculado) : undefined
          }));
          
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Filtrar pedidos com base no período selecionado
  const filterOrdersByPeriod = (orders: Order[], period: PeriodFilterType): Order[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    let startDate: Date;
    
    switch (period) {
      case 'hoje':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.data_pedido) >= startDate && new Date(order.data_pedido) <= today
        );
      case 'ontem':
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        return orders.filter(order => 
          new Date(order.data_pedido) >= yesterday && new Date(order.data_pedido) <= endOfYesterday
        );
      case 'ultimos7dias':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.data_pedido) >= startDate && new Date(order.data_pedido) <= today
        );
      case 'ultimos30dias':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.data_pedido) >= startDate && new Date(order.data_pedido) <= today
        );
      case 'ultimos3meses':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.data_pedido) >= startDate && new Date(order.data_pedido) <= today
        );
      case 'ultimos6meses':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.data_pedido) >= startDate && new Date(order.data_pedido) <= today
        );
      case 'ultimoano':
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        return orders.filter(order => 
          new Date(order.data_pedido) >= startDate && new Date(order.data_pedido) <= today
        );
      default:
        return orders;
    }
  };
  
  const filteredOrders = filterOrdersByPeriod(orders, period);
  
  // Calcular estatísticas de resumo
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => 
    order.preco_venda ? sum + order.preco_venda : sum + order.preco_produto, 0);
  const calculatedOrders = filteredOrders.filter(order => order.lucro_calculado !== undefined).length;
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
          <DashboardCard title="Total de Pedidos">
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
          <DashboardCard title="Receita Total">
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
          <DashboardCard title="Pendentes de Cálculo">
            <div className="flex justify-center items-center h-16">
              <span className="text-3xl font-semibold text-montelucce-light-gray">
                {pendingCalculation}
              </span>
            </div>
          </DashboardCard>
        </motion.div>
      </div>
      
      <DashboardCard title="Pedidos">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-montelucce-light-gray">Carregando pedidos...</p>
          </div>
        ) : (
          <OrderTable orders={filteredOrders} />
        )}
      </DashboardCard>
    </Layout>
  );
};

export default Orders;

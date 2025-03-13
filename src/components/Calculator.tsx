
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
import { supabase } from '@/integrations/supabase/client';

const Calculator = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productCost, setProductCost] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Buscar dados do Supabase
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
            preco_produto: parseFloat(order.preco_produto),
            marca_produto: order.marca_produto,
            custo_envio: parseFloat(order.custo_envio),
            data_pedido: new Date(order.data_pedido),
            custo_produto: order.custo_produto ? parseFloat(order.custo_produto) : undefined,
            preco_venda: order.preco_venda ? parseFloat(order.preco_venda) : undefined,
            lucro_calculado: order.lucro_calculado ? parseFloat(order.lucro_calculado) : undefined
          }));
          
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        toast.error('Erro ao carregar pedidos. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Resetar formulário quando um novo pedido é selecionado
  useEffect(() => {
    if (selectedOrder) {
      setProductCost(selectedOrder.custo_produto?.toString() || '');
      setSellingPrice(selectedOrder.preco_venda?.toString() || selectedOrder.preco_produto.toString());
      
      if (selectedOrder.custo_produto && selectedOrder.preco_venda) {
        const profit = selectedOrder.preco_venda - selectedOrder.custo_produto - selectedOrder.custo_envio;
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
  
  // Calcular lucro quando os inputs mudam
  useEffect(() => {
    if (selectedOrder && productCost && sellingPrice) {
      const cost = parseFloat(productCost);
      const price = parseFloat(sellingPrice);
      
      if (!isNaN(cost) && !isNaN(price)) {
        const profit = price - cost - selectedOrder.custo_envio;
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
  
  const handleCalculate = async () => {
    if (!selectedOrder) {
      toast.error('Por favor, selecione um pedido primeiro');
      return;
    }
    
    if (!productCost || !sellingPrice) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    const cost = parseFloat(productCost);
    const price = parseFloat(sellingPrice);
    
    if (isNaN(cost) || isNaN(price)) {
      toast.error('Por favor, insira números válidos');
      return;
    }
    
    // Calcular lucro
    const profit = price - cost - selectedOrder.custo_envio;
    
    try {
      // Atualizar o pedido no Supabase
      const { error } = await supabase
        .from('pedidos')
        .update({
          custo_produto: cost,
          preco_venda: price,
          lucro_calculado: profit
        })
        .eq('id', selectedOrder.id);
      
      if (error) {
        throw error;
      }
      
      // Atualizar o pedido na lista local
      const updatedOrders = orders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            custo_produto: cost,
            preco_venda: price,
            lucro_calculado: profit
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      setSelectedOrder(prev => prev ? { ...prev, custo_produto: cost, preco_venda: price, lucro_calculado: profit } : null);
      setCalculatedProfit(profit);
      
      toast.success('Lucro calculado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      toast.error('Erro ao salvar cálculo. Por favor, tente novamente.');
    }
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
          <DashboardCard title="Selecionar Pedido">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-montelucce-light-gray">Carregando pedidos...</p>
              </div>
            ) : (
              <OrderTable orders={orders} onSelectOrder={handleSelectOrder} />
            )}
          </DashboardCard>
        </div>
        
        <div className="space-y-6">
          <DashboardCard title="Calculadora">
            {selectedOrder ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-montelucce-yellow/5 p-4 rounded-lg border border-montelucce-yellow/10">
                  <h3 className="font-medium text-montelucce-light-gray mb-2">Detalhes do Pedido</h3>
                  <p className="text-sm text-montelucce-gray">
                    <span className="block">Cliente: {selectedOrder.nome_cliente}</span>
                    <span className="block">Produto: {selectedOrder.marca_produto}</span>
                    <span className="block">
                      Custo de Envio: R$ {selectedOrder.custo_envio.toFixed(2)}
                    </span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-montelucce-light-gray flex items-center gap-2">
                      <Tag size={16} className="text-montelucce-yellow" />
                      Custo do Produto (R$)
                    </label>
                    <Input
                      type="number"
                      placeholder="Digite o custo do produto"
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                      className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-montelucce-light-gray flex items-center gap-2">
                      <DollarSign size={16} className="text-montelucce-yellow" />
                      Preço de Venda (R$)
                    </label>
                    <Input
                      type="number"
                      placeholder="Digite o preço de venda"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-montelucce-light-gray flex items-center gap-2">
                      <Truck size={16} className="text-montelucce-yellow" />
                      Custo de Envio (R$)
                    </label>
                    <Input
                      type="number"
                      value={selectedOrder.custo_envio.toFixed(2)}
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
                        Lucro:
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
                    Calcular
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-montelucce-yellow/20 text-montelucce-light-gray hover:text-montelucce-yellow"
                  >
                    Limpar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-montelucce-gray mb-4">
                  Selecione um pedido da tabela para calcular o lucro
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
              <DashboardCard title="Análise de Margem">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Custo do Produto:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {parseFloat(productCost).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Custo de Envio:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {selectedOrder.custo_envio.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Custo Total:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {(parseFloat(productCost) + selectedOrder.custo_envio).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="border-t border-montelucce-yellow/10 pt-4 flex justify-between items-center">
                    <span className="text-montelucce-gray">Preço de Venda:</span>
                    <span className="text-montelucce-light-gray">
                      R$ {parseFloat(sellingPrice).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Lucro:</span>
                    <span className={calculatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                      R$ {calculatedProfit.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-montelucce-gray">Margem:</span>
                    <span className={calculatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {parseFloat(sellingPrice) > 0
                        ? `${((calculatedProfit / parseFloat(sellingPrice)) * 100).toFixed(2)}%`
                        : '0,00%'}
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

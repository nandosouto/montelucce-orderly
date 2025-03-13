
import React, { useState } from 'react';
import { Order } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type OrderTableProps = {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
};

const OrderTable: React.FC<OrderTableProps> = ({ orders, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Order>('data_pedido');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.nome_cliente.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      order.cpf.includes(searchTerm) ||
      order.marca_produto.toLowerCase().includes(searchLower)
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'data_pedido') {
      const dateA = new Date(a.data_pedido).getTime();
      const dateB = new Date(b.data_pedido).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortField === 'preco_produto' || sortField === 'custo_envio') {
      return sortDirection === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }

    const valueA = String(a[sortField]).toLowerCase();
    const valueB = String(b[sortField]).toLowerCase();
    return sortDirection === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-montelucce-gray" size={16} />
          <Input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
          />
        </div>
        {onSelectOrder && (
          <Button 
            onClick={() => setSearchTerm('')}
            variant="outline"
            className="shrink-0 border-montelucce-yellow/20 text-montelucce-light-gray hover:text-montelucce-yellow"
          >
            Limpar Filtro
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-montelucce-yellow/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-montelucce-black/50">
            <TableRow>
              <TableHead className="w-0 font-medium text-montelucce-light-gray"></TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('nome_cliente')}
              >
                <div className="flex items-center space-x-1">
                  <span>Cliente</span>
                  {sortField === 'nome_cliente' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('marca_produto')}
              >
                <div className="flex items-center space-x-1">
                  <span>Produto</span>
                  {sortField === 'marca_produto' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('preco_produto')}
              >
                <div className="flex items-center space-x-1">
                  <span>Preço</span>
                  {sortField === 'preco_produto' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('data_pedido')}
              >
                <div className="flex items-center space-x-1">
                  <span>Data</span>
                  {sortField === 'data_pedido' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              {onSelectOrder && (
                <TableHead className="text-right font-medium text-montelucce-light-gray">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onSelectOrder ? 6 : 5} className="text-center py-6 text-montelucce-gray">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow 
                    className={`border-b border-montelucce-yellow/10 transition-colors ${
                      expandedOrderId === order.id ? 'bg-montelucce-yellow/5' : 'hover:bg-montelucce-yellow/5'
                    }`}
                  >
                    <TableCell className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleOrderDetails(order.id)}
                        className="h-8 w-8 text-montelucce-light-gray hover:text-montelucce-yellow"
                      >
                        {expandedOrderId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-montelucce-light-gray">
                      {order.nome_cliente}
                    </TableCell>
                    <TableCell className="text-montelucce-light-gray">{order.marca_produto}</TableCell>
                    <TableCell className="text-montelucce-light-gray">
                      R$ {order.preco_produto.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-montelucce-light-gray">
                      {format(new Date(order.data_pedido), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    {onSelectOrder && (
                      <TableCell className="text-right">
                        <Button
                          onClick={() => onSelectOrder(order)}
                          size="sm"
                          className="bg-montelucce-yellow text-montelucce-black hover:bg-montelucce-yellow/90"
                        >
                          Selecionar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <TableRow className="bg-montelucce-yellow/5">
                        <TableCell colSpan={onSelectOrder ? 6 : 5} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 py-4 text-sm text-montelucce-light-gray"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-montelucce-yellow text-xs uppercase tracking-wider mb-1">
                                  Detalhes do Cliente
                                </h4>
                                <p><span className="text-montelucce-gray">Email:</span> {order.email}</p>
                                <p><span className="text-montelucce-gray">CPF:</span> {order.cpf}</p>
                              </div>
                              <div>
                                <h4 className="text-montelucce-yellow text-xs uppercase tracking-wider mb-1">
                                  Detalhes de Entrega
                                </h4>
                                <p><span className="text-montelucce-gray">Endereço:</span> {order.endereco}, {order.numero}</p>
                                {order.complemento && (
                                  <p><span className="text-montelucce-gray">Complemento:</span> {order.complemento}</p>
                                )}
                                <p><span className="text-montelucce-gray">CEP:</span> {order.cep}</p>
                              </div>
                              <div>
                                <h4 className="text-montelucce-yellow text-xs uppercase tracking-wider mb-1">
                                  Detalhes do Pedido
                                </h4>
                                <p><span className="text-montelucce-gray">Custo de Envio:</span> R$ {order.custo_envio.toFixed(2)}</p>
                                {order.custo_produto !== undefined && (
                                  <p><span className="text-montelucce-gray">Custo do Produto:</span> R$ {order.custo_produto.toFixed(2)}</p>
                                )}
                                {order.preco_venda !== undefined && (
                                  <p><span className="text-montelucce-gray">Preço de Venda:</span> R$ {order.preco_venda.toFixed(2)}</p>
                                )}
                                {order.lucro_calculado !== undefined && (
                                  <p>
                                    <span className="text-montelucce-gray">Lucro:</span> 
                                    <span className={order.lucro_calculado >= 0 ? 'text-green-500' : 'text-red-500'}>
                                      {' '}R$ {order.lucro_calculado.toFixed(2)}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;

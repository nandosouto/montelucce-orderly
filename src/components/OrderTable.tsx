
import React, { useState } from 'react';
import { Order } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type OrderTableProps = {
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
};

const OrderTable: React.FC<OrderTableProps> = ({ orders, onSelectOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Order>('date');
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
      order.customerName.toLowerCase().includes(searchLower) ||
      order.email.toLowerCase().includes(searchLower) ||
      order.cpf.includes(searchTerm) ||
      order.productBrand.toLowerCase().includes(searchLower)
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortField === 'productPrice' || sortField === 'shippingCost') {
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
            placeholder="Search orders..."
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
            Clear Filter
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
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  {sortField === 'customerName' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('productBrand')}
              >
                <div className="flex items-center space-x-1">
                  <span>Product</span>
                  {sortField === 'productBrand' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('productPrice')}
              >
                <div className="flex items-center space-x-1">
                  <span>Price</span>
                  {sortField === 'productPrice' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="font-medium text-montelucce-light-gray cursor-pointer hover:text-montelucce-yellow"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === 'date' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </TableHead>
              {onSelectOrder && (
                <TableHead className="text-right font-medium text-montelucce-light-gray">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onSelectOrder ? 6 : 5} className="text-center py-6 text-montelucce-gray">
                  No orders found.
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
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-montelucce-light-gray">{order.productBrand}</TableCell>
                    <TableCell className="text-montelucce-light-gray">
                      R$ {order.productPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-montelucce-light-gray">
                      {format(new Date(order.date), 'dd/MM/yyyy')}
                    </TableCell>
                    {onSelectOrder && (
                      <TableCell className="text-right">
                        <Button
                          onClick={() => onSelectOrder(order)}
                          size="sm"
                          className="bg-montelucce-yellow text-montelucce-black hover:bg-montelucce-yellow/90"
                        >
                          Select
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
                                  Customer Details
                                </h4>
                                <p><span className="text-montelucce-gray">Email:</span> {order.email}</p>
                                <p><span className="text-montelucce-gray">CPF:</span> {order.cpf}</p>
                              </div>
                              <div>
                                <h4 className="text-montelucce-yellow text-xs uppercase tracking-wider mb-1">
                                  Shipping Details
                                </h4>
                                <p><span className="text-montelucce-gray">Address:</span> {order.address}, {order.addressNumber}</p>
                                {order.addressComplement && (
                                  <p><span className="text-montelucce-gray">Complement:</span> {order.addressComplement}</p>
                                )}
                                <p><span className="text-montelucce-gray">Zip Code:</span> {order.zipCode}</p>
                              </div>
                              <div>
                                <h4 className="text-montelucce-yellow text-xs uppercase tracking-wider mb-1">
                                  Order Details
                                </h4>
                                <p><span className="text-montelucce-gray">Shipping Cost:</span> R$ {order.shippingCost.toFixed(2)}</p>
                                {order.productCost !== undefined && (
                                  <p><span className="text-montelucce-gray">Product Cost:</span> R$ {order.productCost.toFixed(2)}</p>
                                )}
                                {order.sellingPrice !== undefined && (
                                  <p><span className="text-montelucce-gray">Selling Price:</span> R$ {order.sellingPrice.toFixed(2)}</p>
                                )}
                                {order.calculatedProfit !== undefined && (
                                  <p>
                                    <span className="text-montelucce-gray">Profit:</span> 
                                    <span className={order.calculatedProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                                      {' '}R$ {order.calculatedProfit.toFixed(2)}
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

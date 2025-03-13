
import React from 'react';
import { Button } from '@/components/ui/button';
import { PeriodFilter as PeriodFilterType, Order } from '@/lib/types';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';

type ExportButtonProps = {
  orders: Order[];
  selectedPeriod: PeriodFilterType;
};

const ExportButton: React.FC<ExportButtonProps> = ({ orders, selectedPeriod }) => {
  const handleExport = (format: 'csv' | 'excel') => {
    // In a real app, we'd implement the actual export logic
    // For now, we'll simulate the export with a console log
    console.log(`Exporting ${orders.length} orders for period: ${selectedPeriod} in ${format} format`);
    
    // Basic CSV export example
    if (format === 'csv') {
      const headers = [
        'Customer Name',
        'Email',
        'CPF',
        'Address',
        'Zip Code',
        'Product Brand',
        'Product Price',
        'Shipping Cost',
        'Date',
        'Product Cost',
        'Selling Price',
        'Profit'
      ].join(',');

      const csvRows = orders.map(order => {
        return [
          order.customerName,
          order.email,
          order.cpf,
          `${order.address}, ${order.addressNumber} ${order.addressComplement || ''}`,
          order.zipCode,
          order.productBrand,
          order.productPrice.toFixed(2),
          order.shippingCost.toFixed(2),
          new Date(order.date).toLocaleDateString(),
          order.productCost !== undefined ? order.productCost.toFixed(2) : '',
          order.sellingPrice !== undefined ? order.sellingPrice.toFixed(2) : '',
          order.calculatedProfit !== undefined ? order.calculatedProfit.toFixed(2) : ''
        ].join(',');
      });

      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create a blob and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `montelucce_orders_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-montelucce-yellow text-montelucce-black hover:bg-montelucce-yellow/90">
          <Download size={16} className="mr-2" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-montelucce-black border border-montelucce-yellow/20 text-montelucce-light-gray">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          className="cursor-pointer hover:text-montelucce-yellow hover:bg-montelucce-yellow/5"
        >
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('excel')}
          className="cursor-pointer hover:text-montelucce-yellow hover:bg-montelucce-yellow/5"
        >
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;

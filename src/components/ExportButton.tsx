
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ExportButtonProps = {
  orders: Order[];
  selectedPeriod: PeriodFilterType;
};

const ExportButton: React.FC<ExportButtonProps> = ({ orders, selectedPeriod }) => {
  const handleExport = (format: 'csv' | 'excel') => {
    // Em um app real, implementaríamos a lógica de exportação
    console.log(`Exportando ${orders.length} pedidos para o período: ${selectedPeriod} no formato ${format}`);
    
    // Exemplo básico de exportação CSV
    if (format === 'csv') {
      const headers = [
        'Nome do Cliente',
        'Email',
        'CPF',
        'Endereço',
        'CEP',
        'Marca do Produto',
        'Preço do Produto',
        'Custo de Envio',
        'Data',
        'Custo do Produto',
        'Preço de Venda',
        'Lucro'
      ].join(',');

      const csvRows = orders.map(order => {
        return [
          order.nome_cliente,
          order.email,
          order.cpf,
          `${order.endereco}, ${order.numero} ${order.complemento || ''}`,
          order.cep,
          order.marca_produto,
          order.preco_produto.toFixed(2),
          order.custo_envio.toFixed(2),
          format(new Date(order.data_pedido), 'dd/MM/yyyy', { locale: ptBR }),
          order.custo_produto !== undefined ? order.custo_produto.toFixed(2) : '',
          order.preco_venda !== undefined ? order.preco_venda.toFixed(2) : '',
          order.lucro_calculado !== undefined ? order.lucro_calculado.toFixed(2) : ''
        ].join(',');
      });

      const csvContent = [headers, ...csvRows].join('\n');
      
      // Criar um blob e baixar o arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // Create the filename using template literal instead of calling String as a function
      const fileName = `montelucce_pedidos_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      
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
          <Download size={16} className="mr-2" /> Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-montelucce-black border border-montelucce-yellow/20 text-montelucce-light-gray">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          className="cursor-pointer hover:text-montelucce-yellow hover:bg-montelucce-yellow/5"
        >
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('excel')}
          className="cursor-pointer hover:text-montelucce-yellow hover:bg-montelucce-yellow/5"
        >
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;

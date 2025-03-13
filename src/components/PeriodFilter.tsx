
import React from 'react';
import { PeriodFilter as PeriodFilterType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type PeriodFilterProps = {
  value: PeriodFilterType;
  onChange: (value: PeriodFilterType) => void;
};

const PeriodFilter: React.FC<PeriodFilterProps> = ({ value, onChange }) => {
  const filters: { value: PeriodFilterType; label: string }[] = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last7days', label: 'Últimos 7 dias' },
    { value: 'last30days', label: 'Últimos 30 dias' },
    { value: 'last3months', label: 'Últimos 3 meses' },
    { value: 'last6months', label: 'Últimos 6 meses' },
    { value: 'lastyear', label: 'Último ano' },
  ];

  const today = new Date();
  let startDate, endDate;

  switch (value) {
    case 'today':
      startDate = today;
      endDate = today;
      break;
    case 'yesterday':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = startDate;
      break;
    case 'last7days':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
      break;
    case 'last30days':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      endDate = today;
      break;
    case 'last3months':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);
      endDate = today;
      break;
    case 'last6months':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 6);
      endDate = today;
      break;
    case 'lastyear':
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      endDate = today;
      break;
    default:
      startDate = today;
      endDate = today;
  }

  const dateRangeText = startDate === endDate 
    ? format(startDate, 'd MMM, yyyy', { locale: ptBR })
    : `${format(startDate, 'd MMM, yyyy', { locale: ptBR })} - ${format(endDate, 'd MMM, yyyy', { locale: ptBR })}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={value === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(filter.value)}
            className={
              value === filter.value 
                ? "bg-montelucce-yellow text-montelucce-black" 
                : "text-montelucce-light-gray hover:text-montelucce-yellow"
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="text-sm text-montelucce-light-gray/70">
        <p>Mostrando dados para: <span className="font-medium text-montelucce-yellow">{dateRangeText}</span></p>
      </div>
    </div>
  );
};

export default PeriodFilter;

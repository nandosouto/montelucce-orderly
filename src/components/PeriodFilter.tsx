
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { PeriodFilter as PeriodFilterType } from '@/lib/types';
import { Calendar } from 'lucide-react';

type PeriodFilterProps = {
  value: PeriodFilterType;
  onChange: (value: PeriodFilterType) => void;
};

const periodLabels: Record<PeriodFilterType, string> = {
  'hoje': 'Hoje',
  'ontem': 'Ontem',
  'ultimos7dias': 'Últimos 7 dias',
  'ultimos30dias': 'Últimos 30 dias',
  'ultimos3meses': 'Últimos 3 meses',
  'ultimos6meses': 'Últimos 6 meses',
  'ultimoano': 'Último ano'
};

const PeriodFilter: React.FC<PeriodFilterProps> = ({ value, onChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-montelucce-yellow/20 text-montelucce-light-gray hover:text-montelucce-yellow">
          <Calendar size={16} className="mr-2" />
          {periodLabels[value]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-montelucce-black border border-montelucce-yellow/20 text-montelucce-light-gray">
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as PeriodFilterType)}>
          {Object.entries(periodLabels).map(([key, label]) => (
            <DropdownMenuRadioItem 
              key={key} 
              value={key}
              className="cursor-pointer hover:text-montelucce-yellow hover:bg-montelucce-yellow/5"
            >
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PeriodFilter;


import React, { ReactNode, isValidElement } from 'react';
import DashboardCard from './DashboardCard';
import { cn } from '@/lib/utils';

type ChartCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  height?: number;
  action?: ReactNode;
};

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className,
  height = 300,
  action
}) => {
  return (
    <DashboardCard title={title} className={className} action={action}>
      <div className={cn("w-full", className)} style={{ height }}>
        {children}
      </div>
    </DashboardCard>
  );
};

export default ChartCard;

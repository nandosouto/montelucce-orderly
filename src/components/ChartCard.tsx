
import React, { ReactNode } from 'react';
import DashboardCard from './DashboardCard';
import { ResponsiveContainer } from 'recharts';
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
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default ChartCard;

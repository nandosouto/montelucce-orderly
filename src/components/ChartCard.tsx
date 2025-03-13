
import React, { ReactNode, isValidElement } from 'react';
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
  // Ensure that children is a valid React element
  // If it's not, wrap it in a div or return null
  const chartContent = isValidElement(children) 
    ? children 
    : null;
    
  return (
    <DashboardCard title={title} className={className} action={action}>
      <div className={cn("w-full", className)} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartContent}
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default ChartCard;

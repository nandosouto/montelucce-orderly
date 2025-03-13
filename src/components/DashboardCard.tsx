
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type DashboardCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children, 
  className,
  action
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-montelucce-black border border-montelucce-yellow/20 rounded-xl overflow-hidden shadow-neo",
        className
      )}
    >
      <div className="px-6 py-4 border-b border-montelucce-yellow/10 flex justify-between items-center">
        <h3 className="font-semibold text-montelucce-light-gray">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
};

export default DashboardCard;

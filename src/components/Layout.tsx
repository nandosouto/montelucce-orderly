
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-montelucce-black text-montelucce-light-gray flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex-1 container mx-auto py-6 px-4 sm:px-6", className)}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;

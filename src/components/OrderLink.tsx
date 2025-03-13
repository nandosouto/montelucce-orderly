
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LinkIcon, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const OrderLink: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const orderUrl = window.location.origin + '/pedido-form';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(orderUrl);
      setCopied(true);
      toast.success('Order link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-4"
    >
      <div className="flex items-center space-x-2">
        <LinkIcon size={16} className="text-montelucce-yellow" />
        <h3 className="text-lg font-medium text-montelucce-light-gray">Order Link Generator</h3>
      </div>
      
      <p className="text-sm text-montelucce-gray">
        Share this link with your customers to collect their order information.
      </p>
      
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={orderUrl}
          readOnly
          className="bg-montelucce-black border-montelucce-yellow/20 text-montelucce-light-gray"
        />
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="icon"
          className="border-montelucce-yellow/20 text-montelucce-light-gray hover:text-montelucce-yellow transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      
      <div className="text-xs text-montelucce-gray bg-montelucce-yellow/5 p-3 rounded-md border border-montelucce-yellow/10">
        <p>When customers submit the form, their information will automatically appear in your Orders tab.</p>
      </div>
    </motion.div>
  );
};

export default OrderLink;
